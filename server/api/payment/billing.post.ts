// 빌링키 관리: 등록/변경/삭제 + 정기결제 실행
export default defineEventHandler(async (event) => {
  // 인증 확인
  const userId = await requireAuth(event)

  const body = await readBody(event)
  const { action, storeId, billingKey } = body

  if (!action || !storeId) {
    throw createError({ statusCode: 400, message: '필수 항목이 누락되었습니다.' })
  }

  const supabase = useSupabaseServer()
  const portone = usePortoneServer()

  // storeId가 요청 유저의 매장인지 검증
  const { data: profile } = await supabase
    .from('profiles')
    .select('store_id')
    .eq('id', userId)
    .single()

  if (profile?.store_id !== storeId) {
    throw createError({ statusCode: 403, message: '본인 매장만 관리할 수 있습니다.' })
  }

  // 매장 정보 조회
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('id, name, tier, billing_key, subscription_status, subscription_due_date')
    .eq('id', storeId)
    .single()

  if (storeError || !store) {
    throw createError({ statusCode: 404, message: '매장을 찾을 수 없습니다.' })
  }

  const tierAmounts: Record<string, number> = { basic: 33000, standard: 55000, pro: 99000 }

  switch (action) {
    case 'update': {
      // 빌링키 변경 (카드 변경)
      if (!billingKey) {
        throw createError({ statusCode: 400, message: '빌링키가 필요합니다.' })
      }

      const { error } = await supabase
        .from('stores')
        .update({ billing_key: billingKey })
        .eq('id', storeId)

      if (error) throw createError({ statusCode: 500, message: '빌링키 변경에 실패했습니다.' })

      return { success: true, message: '결제 수단이 변경되었습니다.' }
    }

    case 'delete': {
      // 빌링키 삭제 (구독 해지)
      const { error } = await supabase
        .from('stores')
        .update({
          billing_key: null,
          subscription_status: 'cancelled',
        })
        .eq('id', storeId)

      if (error) throw createError({ statusCode: 500, message: '구독 해지에 실패했습니다.' })

      return { success: true, message: '구독이 해지되었습니다. 현재 결제 기간까지는 정상 이용 가능합니다.' }
    }

    case 'charge': {
      // 빌링키로 정기결제 실행
      if (!store.billing_key) {
        throw createError({ statusCode: 400, message: '등록된 결제 수단이 없습니다.' })
      }

      const amount = tierAmounts[store.tier] || 33000
      const paymentId = generatePaymentId(storeId)
      const now = new Date()

      try {
        const payment = await portone.payWithBillingKey({
          paymentId,
          billingKey: store.billing_key,
          orderName: `플레이온 ${store.tier} 플랜 정기결제`,
          amount,
        })

        if (payment.status === 'PAID') {
          const nextDue = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())

          await supabase
            .from('stores')
            .update({
              subscription_status: 'active',
              subscription_due_date: nextDue.toISOString().split('T')[0],
            })
            .eq('id', storeId)

          await supabase
            .from('saas_subscription_payments')
            .insert({
              store_id: storeId,
              tier: store.tier,
              amount,
              payment_year: now.getFullYear(),
              payment_month: now.getMonth() + 1,
              payment_status: 'paid',
              payment_date: now.toISOString().split('T')[0],
              payment_method: 'BILLING_KEY',
              portone_payment_id: paymentId,
            })

          return { success: true, message: '정기결제가 완료되었습니다.' }
        } else {
          await supabase
            .from('stores')
            .update({ subscription_status: 'past_due' })
            .eq('id', storeId)

          throw createError({ statusCode: 400, message: '정기결제에 실패했습니다.' })
        }
      } catch (err: any) {
        // createError로 던진 에러는 그대로 전달
        if (err?.statusCode) throw err
        console.error('[정기결제 실패]', err)
        throw createError({ statusCode: 500, message: '정기결제 처리 중 오류가 발생했습니다.' })
      }
    }

    default:
      throw createError({ statusCode: 400, message: `지원하지 않는 action: ${action}` })
  }
})
