import type { H3Event } from 'h3'

// 요청의 Authorization 헤더에서 Supabase 세션 토큰을 검증하고 userId를 반환
export async function requireAuth(event: H3Event): Promise<string> {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: '로그인이 필요합니다.' })
  }

  const token = authHeader.slice(7)
  const supabase = useSupabaseServer()

  // service_role로 토큰 검증 (getUser는 서버에서만 사용 — CLAUDE.md 규칙 준수)
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data?.user) {
    throw createError({ statusCode: 401, message: '유효하지 않은 인증 토큰입니다.' })
  }

  return data.user.id
}
