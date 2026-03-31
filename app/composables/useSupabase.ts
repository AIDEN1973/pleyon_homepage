import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Nuxt SSR 안전한 싱글톤: 서버/클라이언트 번들 각각 하나의 인스턴스
let client: SupabaseClient | null = null

export function useSupabase() {
  if (client) return client

  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl
  const key = config.public.supabaseAnonKey

  if (!url || !key) {
    throw new Error(
      'Supabase 환경변수가 설정되지 않았습니다. .env 파일에 NUXT_PUBLIC_SUPABASE_URL과 NUXT_PUBLIC_SUPABASE_ANON_KEY를 설정하세요.'
    )
  }

  client = createClient(url, key)
  return client
}
