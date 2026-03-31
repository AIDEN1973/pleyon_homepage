// 결제 준비: 매장 생성 + paymentId 발급
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userId, storeName, ownerName, phone, email, tier, billingCycle } = body
  const cycle = billingCycle === 'annual' ? 'annual' : 'monthly'

  if (!userId || !storeName || !ownerName || !phone || !email || !tier) {
    throw createError({ statusCode: 400, message: '필수 항목이 누락되었습니다.' })
  }

  const validTiers = ['basic', 'standard', 'pro']
  if (!validTiers.includes(tier)) {
    throw createError({ statusCode: 400, message: '올바르지 않은 요금제입니다.' })
  }

  const supabase = useSupabaseServer()

  // 인증 확인: userId가 실제 존재하는 auth user인지 검증
  const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId)
  if (authError || !authUser?.user) {
    throw createError({ statusCode: 401, message: '인증되지 않은 사용자입니다.' })
  }

  // 1. 기존 pending 매장 확인 (결제 실패 후 재시도 케이스)
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('store_id')
    .eq('id', userId)
    .single()

  let storeId: string | null = null

  if (existingProfile?.store_id) {
    const { data: existingStore } = await supabase
      .from('stores')
      .select('id, subscription_status')
      .eq('id', existingProfile.store_id)
      .single()

    if (existingStore) {
      const { subscription_status: ss } = existingStore
      if (ss === 'active' || ss === 'trialing') {
        // 정상 구독 중 or 체험 중 → 재가입 차단
        throw createError({ statusCode: 409, message: '이미 활성화된 구독이 있습니다.' })
      }
      if (ss === 'pending' || ss === 'past_due' || ss === 'cancelled') {
        // 결제 미완료 / 미납 / 해지 → 기존 매장 재사용 (tier만 업데이트)
        await supabase.from('stores').update({ tier, billing_cycle: cycle, subscription_status: 'pending' }).eq('id', existingStore.id)
        storeId = existingStore.id
      }
    }
  }

  if (!storeId) {
    // 2. 신규 매장 생성
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .insert({
        name: storeName,
        store_owner_id: userId,
        store_owner_name: ownerName,
        owner_phone: phone,
        tier,
        billing_cycle: cycle,
        is_franchise: false,
        subscription_status: 'pending',
      })
      .select('id')
      .single()

    if (storeError) {
      console.error('[매장 생성 실패]', storeError)
      throw createError({ statusCode: 500, message: '매장 생성에 실패했습니다.' })
    }
    storeId = store.id

    // 3. profiles 연결 (owner 역할)
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ store_id: storeId, role: 'owner' })
      .eq('id', userId)

    if (profileError) {
      console.error('[프로필 연결 실패]', profileError)
    }
  }

  // 4. paymentId 생성 (PG사 40자 제한: p{32hex}{7base36})
  if (!storeId) throw createError({ statusCode: 500, message: '매장 ID를 확인할 수 없습니다.' })
  const paymentId = generatePaymentId(storeId)

  return {
    paymentId,
    storeId,
    tier,
  }
})
