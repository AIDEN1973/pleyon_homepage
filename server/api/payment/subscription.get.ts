// 구독 현황 조회 (인증 필요)
export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const supabase = useSupabaseServer()

  // profiles에서 store_id 조회
  const { data: profile } = await supabase
    .from('profiles')
    .select('store_id')
    .eq('id', userId)
    .single()

  if (!profile?.store_id) {
    return { store: null, payments: [] }
  }

  // 매장 정보 (billing_key는 존재 여부만 반환)
  const { data: storeData } = await supabase
    .from('stores')
    .select('id, name, tier, billing_cycle, subscription_status, subscription_due_date, billing_key, store_owner_name, owner_phone')
    .eq('id', profile.store_id)
    .single()

  // 이메일은 auth에서 조회
  const { data: authUser } = await supabase.auth.admin.getUserById(userId)

  // 결제 이력 (실제 결제 완료된 건만 표시)
  const { data: paymentData } = await supabase
    .from('saas_subscription_payments')
    .select('id, tier, amount, payment_date, payment_status, payment_year, payment_month')
    .eq('store_id', profile.store_id)
    .eq('payment_status', 'paid')
    .order('created_at', { ascending: false })
    .limit(20)

  return {
    store: storeData ? {
      id: storeData.id,
      name: storeData.name,
      tier: storeData.tier,
      billingCycle: storeData.billing_cycle || 'monthly',
      subscription_status: storeData.subscription_status,
      subscription_due_date: storeData.subscription_due_date,
      hasBillingKey: !!storeData.billing_key,
      ownerName: storeData.store_owner_name,
      ownerPhone: storeData.owner_phone,
      email: authUser?.user?.email || '',
    } : null,
    payments: paymentData || [],
  }
})
