import { createHmac } from 'node:crypto'

// 포트원 웹훅 수신: 결제 상태 변경 시 Supabase 자동 업데이트
export default defineEventHandler(async (event) => {
  // 1. raw body 읽기 (시그니처 검증을 위해 먼저 읽어야 함)
  const rawBody = (await readRawBody(event)) || ''

  // 2. 포트원 V2 웹훅 시그니처 검증 (Standard Webhooks 스펙)
  const config = useRuntimeConfig()
  const webhookSecret = config.portoneWebhookSecret as string

  if (webhookSecret) {
    const msgId = getHeader(event, 'webhook-id') || ''
    const msgTimestamp = getHeader(event, 'webhook-timestamp') || ''
    const msgSignature = getHeader(event, 'webhook-signature') || ''

    if (!msgId || !msgTimestamp || !msgSignature) {
      throw createError({ statusCode: 400, message: '웹훅 시그니처 헤더가 누락되었습니다.' })
    }

    // 타임스탬프 유효성 검사 (5분 이내)
    const timestamp = parseInt(msgTimestamp, 10)
    const nowSec = Math.floor(Date.now() / 1000)
    if (Math.abs(nowSec - timestamp) > 300) {
      throw createError({ statusCode: 400, message: '웹훅 타임스탬프가 유효하지 않습니다.' })
    }

    // HMAC-SHA256 서명 생성 및 비교
    const toSign = `${msgId}\n${msgTimestamp}\n${rawBody}`
    const secretBuffer = Buffer.from(webhookSecret.replace(/^whsec_/, ''), 'base64')
    const expected = createHmac('sha256', secretBuffer).update(toSign).digest('base64')

    // 'v1,{base64}' 형식 또는 단순 base64 형식 모두 지원
    const signatures = msgSignature.split(' ')
    const valid = signatures.some((sig) => {
      const sigValue = sig.startsWith('v1,') ? sig.slice(3) : sig
      return sigValue === expected
    })

    if (!valid) {
      throw createError({ statusCode: 401, message: '웹훅 시그니처가 유효하지 않습니다.' })
    }
  }

  // 3. body 파싱
  const body = JSON.parse(rawBody || '{}')
  const { type, data } = body

  if (!type || !data?.paymentId) {
    throw createError({ statusCode: 400, message: '잘못된 웹훅 요청입니다.' })
  }

  const portone = usePortoneServer()
  const supabase = useSupabaseServer()

  // 포트원에서 결제 정보 직접 조회 (웹훅 데이터가 아닌 원본 검증)
  let payment
  try {
    payment = await portone.getPayment(data.paymentId)
  } catch (err) {
    console.error('[웹훅 결제 조회 실패]', err)
    throw createError({ statusCode: 500, message: '결제 조회에 실패했습니다.' })
  }

  // paymentId에서 storeId 추출 (형식: p{32hex}{7base36} = 40자)
  const storeId = extractStoreIdFromPaymentId(data.paymentId)
  if (!storeId) {
    console.error('[웹훅] 알 수 없는 paymentId 형식:', data.paymentId)
    return { received: true }
  }

  // 매장의 실제 tier 조회
  const { data: store } = await supabase
    .from('stores')
    .select('tier')
    .eq('id', storeId)
    .single()

  const storeTier = store?.tier || 'basic'
  const now = new Date()

  if (type === 'Transaction.Paid' && payment.status === 'PAID') {
    // 결제 성공
    const nextDue = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())

    await supabase
      .from('stores')
      .update({
        subscription_status: 'active',
        subscription_due_date: nextDue.toISOString().split('T')[0],
      })
      .eq('id', storeId)

    // 결제 이력 저장 — unique는 (store_id, payment_year, payment_month)
    // complete에서 이미 저장했을 수 있으므로 중복 시 무시
    const { error: insertError } = await supabase
      .from('saas_subscription_payments')
      .insert({
        store_id: storeId,
        tier: storeTier,
        amount: payment.amount.total,
        payment_year: now.getFullYear(),
        payment_month: now.getMonth() + 1,
        payment_status: 'paid',
        payment_date: now.toISOString().split('T')[0],
        payment_method: payment.method?.type || 'CARD',
        portone_payment_id: data.paymentId,
      })

    if (insertError) {
      // 이미 같은 월 결제 기록이 있으면 무시 (duplicate key)
      if (!insertError.code?.includes('23505')) {
        console.error('[웹훅 결제 이력 저장 실패]', insertError)
      }
    }
  } else if (type === 'Transaction.Failed') {
    // 결제 실패 (정기결제 갱신 실패 등)
    await supabase
      .from('stores')
      .update({ subscription_status: 'past_due' })
      .eq('id', storeId)
  } else if (type === 'Transaction.Cancelled') {
    // 결제 취소
    await supabase
      .from('saas_subscription_payments')
      .update({ payment_status: 'refunded' })
      .eq('portone_payment_id', data.paymentId)
  }

  return { received: true }
})
