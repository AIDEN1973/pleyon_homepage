// 결제 주기 변경 (월간 ↔ 연간) — 일할 정산 포함
export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const body = await readBody(event)
  const { storeId, billingCycle } = body

  if (!storeId || !billingCycle) {
    throw createError({ statusCode: 400, message: '필수 항목이 누락되었습니다.' })
  }

  if (!['monthly', 'annual'].includes(billingCycle)) {
    throw createError({ statusCode: 400, message: '올바르지 않은 결제 주기입니다.' })
  }

  const supabase = useSupabaseServer()

  const { data: profile } = await supabase
    .from('profiles')
    .select('store_id')
    .eq('id', userId)
    .single()

  if (profile?.store_id !== storeId) {
    throw createError({ statusCode: 403, message: '본인 매장만 변경할 수 있습니다.' })
  }

  const { data: store } = await supabase
    .from('stores')
    .select('id, tier, billing_cycle, subscription_status, subscription_due_date, pending_credit')
    .eq('id', storeId)
    .single()

  if (!store) {
    throw createError({ statusCode: 404, message: '매장을 찾을 수 없습니다.' })
  }

  // Bug 6: 미납 상태에서 주기 변경 차단
  if (store.subscription_status === 'past_due' || store.subscription_status === 'restricted') {
    throw createError({ statusCode: 400, message: '미납 상태에서는 결제 주기를 변경할 수 없습니다. 먼저 미납 요금을 결제해주세요.' })
  }

  if (store.billing_cycle === billingCycle) {
    throw createError({ statusCode: 400, message: '현재 결제 주기와 동일합니다.' })
  }

  // Bug 5: 일할 정산 — 잔여 기간 기준 크레딧 계산
  let prorationCredit = 0

  // 무료이용(trialing) 중에는 일할 정산 불필요
  if (store.subscription_status === 'active' && store.subscription_due_date) {
    const now = new Date()
    const dueDate = new Date(store.subscription_due_date)
    const remainingDays = Math.max(0, Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

    const oldCycle = store.billing_cycle || 'monthly'
    const oldAmount = calcAmount(store.tier, oldCycle)
    const newAmount = calcAmount(store.tier, billingCycle)
    const oldPeriodDays = oldCycle === 'annual' ? 365 : 30
    const newPeriodDays = billingCycle === 'annual' ? 365 : 30

    const oldRemainingValue = Math.round((oldAmount * remainingDays) / oldPeriodDays)
    const newRemainingValue = Math.round((newAmount * remainingDays) / newPeriodDays)
    prorationCredit = oldRemainingValue - newRemainingValue
  }

  const existingCredit = store.pending_credit || 0
  const newCredit = Math.max(0, existingCredit + prorationCredit)

  await supabase
    .from('stores')
    .update({
      billing_cycle: billingCycle,
      pending_credit: newCredit,
    })
    .eq('id', storeId)

  const cycleLabel = billingCycle === 'annual' ? '연간' : '월간'
  let message = `결제 주기가 ${cycleLabel}으로 변경되었습니다. 다음 결제일부터 적용됩니다.`
  if (prorationCredit > 0) {
    message += ` 일할 정산 크레딧 ${prorationCredit.toLocaleString()}원이 다음 결제에서 차감됩니다.`
  }

  return {
    success: true,
    billingCycle,
    prorationCredit,
    message,
  }
})
