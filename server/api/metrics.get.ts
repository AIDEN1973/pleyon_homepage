import { createClient } from '@supabase/supabase-js'

interface MetricsCache {
  data: { stores: number; members: number; transactions: number; legoSets: number } | null
  updatedAt: number
}

const cache: MetricsCache = { data: null, updatedAt: 0 }
const TEN_MINUTES = 10 * 60 * 1000

export default defineEventHandler(async () => {
  const now = Date.now()

  // 캐시가 유효하면 (24시간 이내) 캐시 반환
  if (cache.data && now - cache.updatedAt < TEN_MINUTES) {
    return cache.data
  }

  const config = useRuntimeConfig()
  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey || config.public.supabaseAnonKey,
  )

  const tables = [
    'checkin_sessions', 'lego_rentals', 'payment_histories', 'payment_methods',
    'sms_logs', 'point_histories', 'general_point_histories',
    'product_purchases', 'product_purchase_items',
    'member_time_passes', 'member_rental_passes', 'member_point_plans',
    'lego_front_requests', 'checkin_session_lego_changes',
    'plan_edit_histories', 'lego_inventory_change_log', 'franchise_fee_payments',
    'lego_grade_definitions_history', 'lego_change_notifications',
    'lego_registration_requests', 'chat_messages', 'crm_memos',
    'board_posts', 'shop_orders', 'blog_drafts', 'insights',
  ]

  const [storesRes, membersRes, legoRes, ...txResults] = await Promise.all([
    supabase.from('stores').select('id', { count: 'exact', head: true }),
    supabase.from('members').select('id', { count: 'exact', head: true }),
    supabase.from('lego_sets').select('id', { count: 'exact', head: true }),
    ...tables.map(t => supabase.from(t).select('id', { count: 'exact', head: true })),
  ])

  const data = {
    stores: storesRes.count || 0,
    members: membersRes.count || 0,
    transactions: txResults.reduce((sum, r) => sum + (r.count || 0), 0),
    legoSets: legoRes.count || 0,
  }

  cache.data = data
  cache.updatedAt = now

  return data
})
