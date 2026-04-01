// 대기 중인 플랜 변경 요청 취소
export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const body = await readBody(event)
  const { storeId } = body

  if (!storeId) {
    throw createError({ statusCode: 400, message: '필수 항목이 누락되었습니다.' })
  }

  const supabase = useSupabaseServer()

  const { data: profile } = await supabase
    .from('profiles')
    .select('store_id')
    .eq('id', userId)
    .single()

  if (profile?.store_id !== storeId) {
    throw createError({ statusCode: 403, message: '본인 매장만 관리할 수 있습니다.' })
  }

  const { data: pendingRequest } = await supabase
    .from('plan_change_requests')
    .select('id')
    .eq('store_id', storeId)
    .eq('status', 'pending')
    .maybeSingle()

  if (!pendingRequest) {
    throw createError({ statusCode: 404, message: '대기 중인 플랜 변경 요청이 없습니다.' })
  }

  await supabase
    .from('plan_change_requests')
    .update({ status: 'cancelled' })
    .eq('id', pendingRequest.id)

  return { success: true, message: '플랜 변경 요청이 취소되었습니다.' }
})
