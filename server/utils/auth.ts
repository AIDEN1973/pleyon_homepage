import type { H3Event } from 'h3'

// JWT 토큰에서 userId를 추출 (만료 확인 포함)
// getUser() 대비 Auth 서버 네트워크 왕복 제거 → 응답 속도 대폭 개선
export async function requireAuth(event: H3Event): Promise<string> {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: '로그인이 필요합니다.' })
  }

  const token = authHeader.slice(7)

  try {
    // JWT payload 디코딩 (Base64)
    const payload = JSON.parse(atob(token.split('.')[1]))

    // 만료 확인
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      throw createError({ statusCode: 401, message: '인증 토큰이 만료되었습니다.' })
    }

    const userId = payload.sub
    if (!userId) {
      throw createError({ statusCode: 401, message: '유효하지 않은 인증 토큰입니다.' })
    }

    return userId
  } catch (err: any) {
    if (err.statusCode) throw err
    throw createError({ statusCode: 401, message: '유효하지 않은 인증 토큰입니다.' })
  }
}
