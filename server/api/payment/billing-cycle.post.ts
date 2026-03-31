// 결제 주기 변경 (월간 ↔ 연간)
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

  // 본인 매장 검증
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
    .select('id, billing_cycle, subscription_status')
    .eq('id', storeId)
    .single()

  if (!store) {
    throw createError({ statusCode: 404, message: '매장을 찾을 수 없습니다.' })
  }

  if (store.billing_cycle === billingCycle) {
    throw createError({ statusCode: 400, message: '현재 결제 주기와 동일합니다.' })
  }

  // 결제 주기 변경 (다음 결제일부터 적용)
  await supabase
    .from('stores')
    .update({ billing_cycle: billingCycle })
    .eq('id', storeId)

  const cycleLabel = billingCycle === 'annual' ? '연간' : '월간'

  return {
    success: true,
    billingCycle,
    message: `결제 주기가 ${cycleLabel}으로 변경되었습니다. 다음 결제일부터 적용됩니다.`,
  }
})
