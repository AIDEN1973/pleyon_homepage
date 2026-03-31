// 플랜 변경 요청: 차액 계산 + plan_change_requests 저장
export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const body = await readBody(event)
  const { storeId, toTier } = body

  if (!storeId || !toTier) {
    throw createError({ statusCode: 400, message: '필수 항목이 누락되었습니다.' })
  }

  const validTiers = ['basic', 'standard', 'pro']
  if (!validTiers.includes(toTier)) {
    throw createError({ statusCode: 400, message: '올바르지 않은 요금제입니다.' })
  }

  const supabase = useSupabaseServer()

  // 본인 매장 검증
  const { data: profile } = await supabase
    .from('profiles')
    .select('store_id')
    .eq('id', userId)
    .single()

  if (profile?.store_id !== storeId) {
    throw createError({ statusCode: 403, message: '본인 매장만 변경할 수 있습니다.' })
  }

  // 매장 정보 조회
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('id, tier, billing_cycle, subscription_status, subscription_due_date')
    .eq('id', storeId)
    .single()

  if (storeError || !store) {
    throw createError({ statusCode: 404, message: '매장을 찾을 수 없습니다.' })
  }

  if (store.tier === toTier) {
    throw createError({ statusCode: 400, message: '현재 플랜과 동일합니다.' })
  }

  // 이미 대기 중인 플랜 변경 요청 확인
  const { data: pendingRequest } = await supabase
    .from('plan_change_requests')
    .select('id')
    .eq('store_id', storeId)
    .eq('status', 'pending')
    .single()

  if (pendingRequest) {
    throw createError({ statusCode: 409, message: '이미 대기 중인 플랜 변경 요청이 있습니다.' })
  }

  const tierMonthly: Record<string, number> = { basic: 33000, standard: 55000, pro: 99000 }
  const ANNUAL_DISCOUNT = 0.10
  const cycle = store.billing_cycle || 'monthly'
  const periodDays = cycle === 'annual' ? 365 : 30

  const calcCycleAmount = (tier: string): number => {
    const monthly = tierMonthly[tier] || 33000
    if (cycle === 'annual') return Math.round(monthly * 12 * (1 - ANNUAL_DISCOUNT) / 100) * 100
    return monthly
  }

  const fromAmount = calcCycleAmount(store.tier)
  const toAmount = calcCycleAmount(toTier)

  // 차액 계산: 남은 일수 기준 일할 계산
  let diffAmount = 0
  const isUpgrade = toAmount > fromAmount

  if (store.subscription_status === 'trialing') {
    diffAmount = 0
  } else if (store.subscription_due_date) {
    const now = new Date()
    const dueDate = new Date(store.subscription_due_date)
    const remainingDays = Math.max(0, Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    diffAmount = Math.round(((toAmount - fromAmount) * remainingDays) / periodDays)
  } else {
    diffAmount = toAmount - fromAmount
  }

  // 트라이얼이면 바로 tier 변경
  if (store.subscription_status === 'trialing') {
    await supabase
      .from('stores')
      .update({ tier: toTier })
      .eq('id', storeId)

    return {
      success: true,
      immediate: true,
      fromTier: store.tier,
      toTier,
      diffAmount: 0,
      message: '플랜이 즉시 변경되었습니다.',
    }
  }

  // 하위 플랜 변경 (차액 환불/차감): 즉시 변경 + 다음 결제에서 차감
  if (!isUpgrade) {
    await supabase
      .from('stores')
      .update({ tier: toTier })
      .eq('id', storeId)

    // 기록용 요청 저장 (완료 상태)
    await supabase
      .from('plan_change_requests')
      .insert({
        store_id: storeId,
        from_tier: store.tier,
        to_tier: toTier,
        diff_amount: diffAmount,
        status: 'completed',
        memo: `하위 플랜 변경 (차액 ${Math.abs(diffAmount).toLocaleString()}원 다음 결제 차감)`,
      })

    return {
      success: true,
      immediate: true,
      fromTier: store.tier,
      toTier,
      diffAmount,
      message: `플랜이 즉시 변경되었습니다. ${Math.abs(diffAmount).toLocaleString()}원은 다음 결제에서 차감됩니다.`,
    }
  }

  // 상위 플랜 변경: 차액 입금 대기
  const { data: request, error: insertError } = await supabase
    .from('plan_change_requests')
    .insert({
      store_id: storeId,
      from_tier: store.tier,
      to_tier: toTier,
      diff_amount: diffAmount,
      status: 'pending',
    })
    .select('id')
    .single()

  if (insertError) {
    console.error('[플랜 변경 요청 실패]', insertError)
    throw createError({ statusCode: 500, message: '플랜 변경 요청에 실패했습니다.' })
  }

  return {
    success: true,
    immediate: false,
    requestId: request.id,
    fromTier: store.tier,
    toTier,
    diffAmount,
    message: `차액 ${diffAmount.toLocaleString()}원 입금 확인 후 플랜이 변경됩니다.`,
  }
})
