// 카드 등록 완료: 빌링키 저장 + 7일 무료 체험 시작 (즉시 결제 없음)
export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)

  const body = await readBody(event)
  const { storeId, tier, billingKey } = body

  if (!storeId || !tier) {
    throw createError({ statusCode: 400, message: '필수 항목이 누락되었습니다.' })
  }

  const supabase = useSupabaseServer()

  // 본인 매장 검증
  const { data: profile } = await supabase
    .from('profiles')
    .select('store_id')
    .eq('id', userId)
    .single()

  if (profile?.store_id !== storeId) {
    throw createError({ statusCode: 403, message: '본인 매장만 결제할 수 있습니다.' })
  }

  const validTiers = ['basic', 'standard', 'pro']
  if (!validTiers.includes(tier)) {
    throw createError({ statusCode: 400, message: '올바르지 않은 요금제입니다.' })
  }

  // 7일 후 체험 만료일
  const now = new Date()
  const trialEndsAt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14)
  const trialEndsStr = trialEndsAt.toISOString().split('T')[0]

  // 빌링키 저장(있으면) + 체험 상태로 전환 (결제 없음)
  const updateData: Record<string, unknown> = {
    tier,
    subscription_status: 'trialing',
    trial_ends_at: trialEndsStr,
    subscription_due_date: trialEndsStr, // 첫 결제 예정일 = 체험 만료일
  }
  if (billingKey) {
    updateData.billing_key = billingKey
  }

  const { error } = await supabase
    .from('stores')
    .update(updateData)
    .eq('id', storeId)

  if (error) {
    console.error('[카드 등록 실패]', error)
    throw createError({ statusCode: 500, message: 'DB 업데이트에 실패했습니다.' })
  }

  return { success: true, tier, trialEndsAt: trialEndsStr }
})
