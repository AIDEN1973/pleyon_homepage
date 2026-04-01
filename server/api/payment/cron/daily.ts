// Vercel Cron Job: 매일 00:00 UTC (한국 09:00) 실행
// 1. 체험 만료 → 첫 구독기간 레코드 생성 (무통장: past_due, 카드: 자동결제)
// 2. 구독 갱신 → 다음 구독기간 결제
// 3. 미납 재시도 (3일·7일·14일 차) → 15일 초과 시 자동 해지
export default defineEventHandler(async (event) => {
  const cronSecret = process.env.CRON_SECRET
  const authHeader = getHeader(event, 'authorization')

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    throw createError({ statusCode: 401, message: '인증되지 않은 Cron 요청입니다.' })
  }

  const supabase = useSupabaseServer()
  const portone = usePortoneServer()
  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]

  const results: Array<{ storeId: string; task: string; status: string; detail?: string }> = []

  // ─── 1. 체험 만료 처리 ────────────────────────────────
  const { data: trialStores } = await supabase
    .from('stores')
    .select('id, name, tier, billing_cycle, billing_key')
    .eq('subscription_status', 'trialing')
    .eq('is_franchise', false)
    .lte('trial_ends_at', todayStr)

  for (const store of trialStores || []) {
    const cycle = store.billing_cycle || 'monthly'
    const amount = calcAmount(store.tier, cycle)
    const periodStart = todayStr
    const dueDateNext = calcNextDate(todayStr, cycle)

    // 빌링키 없는 매장 (무통장입금) → 자동결제 없이 past_due 전환
    if (!store.billing_key) {
      await supabase.from('stores').update({
        subscription_status: 'past_due',
        subscription_due_date: dueDateNext,
        trial_ends_at: null,
      }).eq('id', store.id)

      await supabase.from('saas_subscription_payments').upsert({
        store_id: store.id,
        tier: store.tier,
        amount,
        period_start: periodStart,
        period_end: dueDateNext,
        payment_status: 'unpaid',
        payment_method: 'BANK_TRANSFER',
      }, { onConflict: 'store_id,period_start', ignoreDuplicates: true })

      results.push({ storeId: store.id, task: 'trial_end', status: 'past_due', detail: '무통장입금 대기' })
      continue
    }

    // 빌링키 있는 매장 → 포트원 자동결제
    const paymentId = generatePaymentId(store.id)

    try {
      const payment = await portone.payWithBillingKey({
        paymentId,
        billingKey: store.billing_key,
        orderName: `플레이온 ${store.tier} 플랜 (${cycle === 'annual' ? '연간' : '월간'} 체험 종료)`,
        amount,
      })

      if (payment.status === 'PAID') {
        await supabase.from('stores').update({
          subscription_status: 'active',
          subscription_due_date: dueDateNext,
          trial_ends_at: null,
        }).eq('id', store.id)

        await supabase.from('saas_subscription_payments').upsert({
          store_id: store.id,
          tier: store.tier,
          amount,
          period_start: periodStart,
          period_end: dueDateNext,
          payment_status: 'paid',
          payment_date: todayStr,
          payment_method: 'BILLING_KEY',
          portone_payment_id: paymentId,
        }, { onConflict: 'store_id,period_start', ignoreDuplicates: true })

        results.push({ storeId: store.id, task: 'trial_end', status: 'success' })
      } else {
        await supabase.from('stores').update({
          subscription_status: 'past_due',
          subscription_due_date: dueDateNext,
          trial_ends_at: null,
        }).eq('id', store.id)
        results.push({ storeId: store.id, task: 'trial_end', status: 'failed', detail: payment.status })
      }
    } catch (err) {
      console.error(`[체험 만료 결제 실패] store=${store.id}:`, err)
      await supabase.from('stores').update({
        subscription_status: 'past_due',
        subscription_due_date: dueDateNext,
        trial_ends_at: null,
      }).eq('id', store.id)
      results.push({ storeId: store.id, task: 'trial_end', status: 'error' })
    }
  }

  // ─── 2. 구독 갱신 ────────────────────────────────────
  const { data: renewStores } = await supabase
    .from('stores')
    .select('id, name, tier, billing_cycle, billing_key, subscription_due_date, pending_credit')
    .eq('subscription_status', 'active')
    .eq('is_franchise', false)
    .lte('subscription_due_date', todayStr)

  for (const store of renewStores || []) {
    const cycle = store.billing_cycle || 'monthly'
    const baseAmount = calcAmount(store.tier, cycle)
    const credit = store.pending_credit || 0
    const chargeAmount = Math.max(0, baseAmount - credit)
    const usedCredit = Math.min(credit, baseAmount)
    const remainingCredit = credit - usedCredit
    const periodStart = todayStr
    const dueDateNext = calcNextDate(todayStr, cycle)

    // 빌링키 없는 매장 (무통장입금) → past_due 전환
    if (!store.billing_key) {
      await supabase.from('stores').update({
        subscription_status: chargeAmount === 0 ? 'active' : 'past_due',
        subscription_due_date: dueDateNext,
        pending_credit: remainingCredit,
      }).eq('id', store.id)

      await supabase.from('saas_subscription_payments').upsert({
        store_id: store.id,
        tier: store.tier,
        amount: chargeAmount,
        period_start: periodStart,
        period_end: dueDateNext,
        payment_status: chargeAmount === 0 ? 'paid' : 'unpaid',
        payment_method: chargeAmount === 0 ? 'CREDIT' : 'BANK_TRANSFER',
        payment_date: chargeAmount === 0 ? todayStr : null,
      }, { onConflict: 'store_id,period_start', ignoreDuplicates: true })

      results.push({ storeId: store.id, task: 'renew', status: 'past_due', detail: '무통장입금 대기' })
      continue
    }

    // 크레딧이 전액 커버하면 결제 스킵
    if (chargeAmount === 0) {
      await supabase.from('stores').update({
        subscription_status: 'active',
        subscription_due_date: dueDateNext,
        pending_credit: remainingCredit,
      }).eq('id', store.id)

      await supabase.from('saas_subscription_payments').upsert({
        store_id: store.id, tier: store.tier, amount: 0,
        period_start: periodStart, period_end: dueDateNext,
        payment_status: 'paid', payment_date: todayStr, payment_method: 'CREDIT',
      }, { onConflict: 'store_id,period_start', ignoreDuplicates: true })

      results.push({ storeId: store.id, task: 'renew', status: 'credit_covered' })
      continue
    }

    // 빌링키 있는 매장 → 포트원 자동결제
    const paymentId = generatePaymentId(store.id)

    try {
      const payment = await portone.payWithBillingKey({
        paymentId,
        billingKey: store.billing_key,
        orderName: `플레이온 ${store.tier} 플랜 ${cycle === 'annual' ? '연간' : '월간'} 정기결제`,
        amount: chargeAmount,
      })

      if (payment.status === 'PAID') {
        await supabase.from('stores').update({
          subscription_status: 'active',
          subscription_due_date: dueDateNext,
          pending_credit: remainingCredit,
        }).eq('id', store.id)

        await supabase.from('saas_subscription_payments').upsert({
          store_id: store.id,
          tier: store.tier,
          amount: chargeAmount,
          period_start: periodStart,
          period_end: dueDateNext,
          payment_status: 'paid',
          payment_date: todayStr,
          payment_method: 'BILLING_KEY',
          portone_payment_id: paymentId,
        }, { onConflict: 'store_id,period_start', ignoreDuplicates: true })

        results.push({ storeId: store.id, task: 'renew', status: 'success' })
      } else {
        await supabase.from('stores').update({ subscription_status: 'past_due' }).eq('id', store.id)
        results.push({ storeId: store.id, task: 'renew', status: 'failed', detail: payment.status })
      }
    } catch (err) {
      console.error(`[구독 갱신 실패] store=${store.id}:`, err)
      await supabase.from('stores').update({ subscription_status: 'past_due' }).eq('id', store.id)
      results.push({ storeId: store.id, task: 'renew', status: 'error' })
    }
  }

  // ─── 3. 미납 재시도 (Dunning) ─────────────────────────
  const { data: pastDueStores } = await supabase
    .from('stores')
    .select('id, name, tier, billing_cycle, billing_key, subscription_due_date')
    .eq('subscription_status', 'past_due')
    .eq('is_franchise', false)

  for (const store of pastDueStores || []) {
    if (!store.subscription_due_date) continue

    const dueDate = new Date(store.subscription_due_date)
    const daysPastDue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

    // 15일 초과: 자동 해지
    if (daysPastDue >= 15) {
      await supabase.from('stores').update({ subscription_status: 'cancelled' }).eq('id', store.id)
      results.push({ storeId: store.id, task: 'dunning', status: 'cancelled', detail: `${daysPastDue}일 경과` })
      continue
    }

    // 빌링키 없는 매장 (무통장입금) → 자동 재시도 없이 대기
    if (!store.billing_key) continue

    // 3일·7일·14일 차에만 재시도 (빌링키 있는 매장만)
    if (![3, 7, 14].includes(daysPastDue)) continue

    // 미납 레코드 찾기 (가장 최근 period_start)
    const { data: unpaidRecord } = await supabase
      .from('saas_subscription_payments')
      .select('period_start, period_end, amount')
      .eq('store_id', store.id)
      .eq('payment_status', 'unpaid')
      .order('period_start', { ascending: false })
      .limit(1)
      .single()

    const paymentId = generatePaymentId(store.id)
    // Bug 7: 원래 청구 금액 사용 (변경된 billing_cycle로 재계산하지 않음)
    const amount = unpaidRecord?.amount || calcAmount(store.tier, store.billing_cycle || 'monthly')

    try {
      const payment = await portone.payWithBillingKey({
        paymentId,
        billingKey: store.billing_key,
        orderName: `플레이온 ${store.tier} 플랜 미납 재결제`,
        amount,
      })

      if (payment.status === 'PAID') {
        await supabase.from('stores').update({
          subscription_status: 'active',
          subscription_due_date: calcNextDate(todayStr, store.billing_cycle || 'monthly'),
        }).eq('id', store.id)

        // 미납 레코드를 paid로 업데이트
        if (unpaidRecord) {
          await supabase.from('saas_subscription_payments')
            .update({
              payment_status: 'paid',
              payment_date: todayStr,
              payment_method: 'BILLING_KEY',
              portone_payment_id: paymentId,
            })
            .eq('store_id', store.id)
            .eq('period_start', unpaidRecord.period_start)
        }

        results.push({ storeId: store.id, task: 'dunning', status: 'recovered', detail: `${daysPastDue}일 차 재시도` })
      } else {
        results.push({ storeId: store.id, task: 'dunning', status: 'failed', detail: `${daysPastDue}일 차 재시도 실패` })
      }
    } catch (err) {
      console.error(`[미납 재시도 실패] store=${store.id} day=${daysPastDue}:`, err)
      results.push({ storeId: store.id, task: 'dunning', status: 'error', detail: `${daysPastDue}일 차` })
    }
  }

  console.log(`[Daily Cron] 완료: ${results.length}건 처리`)
  return { date: todayStr, processed: results.length, results }
})
