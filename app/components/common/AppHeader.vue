<template>
  <header
    :class="cn(
      'fixed top-0 left-0 right-0 h-[var(--header-height)] z-[100] transition-all duration-200',
      isHeroPage && !isScrolled
        ? 'bg-white'
        : 'bg-white border-b border-border'
    )"
  >
    <div class="w-full px-6 flex items-center justify-between h-full gap-8">
      <NuxtLink to="/" class="flex-shrink-0 z-[101]" aria-label="플레이온 홈">
        <svg width="170" height="32" viewBox="0 0 170 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="10" fill="#1A7CFD" />
          <path d="M10 10h12v4H14v8h-4V10z" fill="#fff" />
          <text x="40" y="23" font-size="22" font-weight="700" fill="hsl(222, 47%, 11%)" stroke="hsl(222, 47%, 11%)" stroke-width="0.8" font-family="Gmarket Sans, sans-serif" letter-spacing="0.5">PLEYON</text>
        </svg>
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
        <template v-for="item in navItems" :key="item.label">
          <NuxtLink
            v-if="item.to"
            :to="item.to"
            :class="cn(
              'relative inline-flex items-center text-base font-bold px-3 py-2 hover:text-[#1A7CFD] hover:font-extrabold transition-all duration-200 group',
              isActiveNav(item.to) ? 'text-[#1A7CFD] font-extrabold' : 'text-[#212121]'
            )"
          >
            {{ item.label }}
            <span :class="cn('absolute bottom-0 left-3 right-3 h-[3px] bg-[#1A7CFD] rounded-full transition-all duration-200', isActiveNav(item.to) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100')" />
          </NuxtLink>
          <button
            v-else
            class="relative inline-flex items-center text-base font-bold px-3 py-2 text-[#212121] hover:text-[#1A7CFD] hover:font-extrabold transition-all duration-200 group cursor-pointer"
            @click="item.action?.()"
          >
            {{ item.label }}
            <span class="absolute bottom-0 left-3 right-3 h-[3px] bg-[#1A7CFD] rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100" />
          </button>
        </template>
      </nav>

      <!-- Desktop Actions -->
      <div class="hidden md:flex items-center gap-2">
        <template v-if="isLoggedIn">
          <NuxtLink to="/my">
            <Button size="sm" class="rounded-lg font-bold bg-transparent text-foreground hover:bg-muted" style="border: 1px solid #ccc;">마이페이지</Button>
          </NuxtLink>
          <Button size="sm" class="rounded-lg font-bold bg-transparent text-foreground hover:bg-muted" style="border: 1px solid #ccc;" @click="handleLogout">로그아웃</Button>
        </template>
        <template v-else>
          <NuxtLink to="/my">
            <Button size="sm" class="rounded-lg font-bold bg-foreground text-white hover:bg-foreground/90">로그인</Button>
          </NuxtLink>
        </template>
        <a :href="appUrl">
          <Button size="sm" class="rounded-lg">플레이온 접속하기</Button>
        </a>
      </div>

      <!-- Mobile Toggle -->
      <button
        :class="cn(
          'md:hidden z-[101]',
          isMobileOpen ? 'text-white' : 'text-foreground'
        )"
        aria-label="메뉴 열기"
        @click="isMobileOpen = !isMobileOpen"
      >
        <svg v-if="!isMobileOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <!-- Mobile Nav -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isMobileOpen" class="md:hidden fixed inset-0 z-[100]">
          <!-- 배경 오버레이 -->
          <div class="absolute inset-0 bg-[#0F1B2D]/95 backdrop-blur-sm" @click="isMobileOpen = false" />

          <!-- 콘텐츠 -->
          <div class="relative z-10 flex flex-col h-full px-6 pt-[var(--header-height)]">
            <!-- 메뉴 -->
            <nav class="flex flex-col gap-1 mt-8">
              <template v-for="item in navItems" :key="item.label">
                <NuxtLink
                  v-if="item.to"
                  :to="item.to"
                  class="flex items-center gap-3 text-lg font-bold text-white/80 hover:text-white px-4 py-3.5 rounded-xl hover:bg-white/[0.06] transition-all"
                  @click="isMobileOpen = false"
                >
                  {{ item.label }}
                </NuxtLink>
                <button
                  v-else
                  class="flex items-center gap-3 text-lg font-bold text-white/80 hover:text-white px-4 py-3.5 rounded-xl hover:bg-white/[0.06] transition-all text-left cursor-pointer"
                  @click="item.action?.(); isMobileOpen = false"
                >
                  {{ item.label }}
                </button>
              </template>
            </nav>

            <!-- 구분선 -->
            <div class="my-6 mx-4 h-px bg-white/10" />

            <!-- 액션 버튼 -->
            <div class="flex flex-col gap-3 px-4">
              <template v-if="isLoggedIn">
                <NuxtLink to="/my" class="block" @click="isMobileOpen = false">
                  <Button class="w-full h-12 text-base font-semibold rounded-xl bg-white text-[#0F1B2D] hover:bg-white/90">마이페이지</Button>
                </NuxtLink>
                <Button class="w-full h-12 text-base font-medium rounded-xl bg-white/10 text-white/60 hover:bg-white/15 hover:text-white border-0" @click="handleLogout(); isMobileOpen = false">로그아웃</Button>
              </template>
              <template v-else>
                <NuxtLink to="/my" class="block" @click="isMobileOpen = false">
                  <Button class="w-full h-12 text-base font-semibold rounded-xl bg-white text-[#0F1B2D] hover:bg-white/90">로그인</Button>
                </NuxtLink>
              </template>
              <a :href="appUrl" class="block" @click="isMobileOpen = false">
                <Button class="w-full h-12 text-base font-semibold rounded-xl bg-[#1A7CFD] text-white hover:bg-[#1A7CFD]/90 border-0">플레이온 접속하기</Button>
              </a>
            </div>

            <!-- 하단 -->
            <div class="mt-auto pb-8 px-4 text-center">
              <p class="text-xs text-white/20">&copy; {{ new Date().getFullYear() }} 플레이온</p>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'

const route = useRoute()
const appUrl = useRuntimeConfig().public.appUrl || 'https://app.pleyon.co.kr/login'
const supabase = useSupabase()
const isScrolled = ref(false)
const isMobileOpen = ref(false)
const isLoggedIn = ref(false)
const router = useRouter()
const isHeroPage = computed(() => route.path === '/')

async function handleLogout() {
  await supabase.auth.signOut()
  isLoggedIn.value = false
  router.push('/')
}

const navItems = [
  { label: '기능소개', to: '/#features' },
  { label: '요금제', to: '/pricing' },
  { label: '문의하기', to: '', action: () => { if (typeof window !== 'undefined' && (window as any).ChannelIO) (window as any).ChannelIO('showMessenger') } },
]

function isActiveNav(to: string) {
  if (to === '/#features') return route.path === '/'
  return route.path === to
}

const onScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  isLoggedIn.value = !!session?.user

  supabase.auth.onAuthStateChange((_event, session) => {
    isLoggedIn.value = !!session?.user
  })

  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => window.removeEventListener('scroll', onScroll))

watch(isMobileOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})
</script>
