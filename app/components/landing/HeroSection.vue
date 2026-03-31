<template>
  <section :class="cn('relative -mt-[var(--header-height)] pt-[calc(var(--header-height)+7rem)] pb-28 md:pb-32 text-center overflow-hidden transition-colors duration-700', slides[currentSlide].bg)">
    <!-- 도트 그리드 (헤더 아래부터) -->
    <div class="absolute inset-0 top-[var(--header-height)] pointer-events-none" style="background-image: radial-gradient(circle, rgba(255,255,255,0.12) 1.5px, transparent 1.5px); background-size: 28px 28px;" />
    <!-- 큰 원형 아웃라인 -->
    <div class="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full border-2 border-white/15 pointer-events-none" />
    <div class="absolute -top-16 -right-16 w-[400px] h-[400px] rounded-full border border-white/10 pointer-events-none" />
    <div class="absolute -bottom-28 -left-28 w-[450px] h-[450px] rounded-full border-2 border-white/15 pointer-events-none" />
    <div class="absolute -bottom-10 -left-10 w-[280px] h-[280px] rounded-full border border-white/10 pointer-events-none" />
    <!-- 중간 원형 -->
    <div class="absolute top-[15%] left-[8%] w-[200px] h-[200px] rounded-full border border-white/10 pointer-events-none" />
    <div class="absolute top-[50%] right-[8%] w-[160px] h-[160px] rounded-full border border-white/10 pointer-events-none" />
    <div class="absolute bottom-[10%] right-[25%] w-[220px] h-[220px] rounded-full border border-white/15 pointer-events-none" />
    <div class="absolute top-[5%] left-[40%] w-[120px] h-[120px] rounded-full border border-white/15 pointer-events-none" />
    <!-- 작은 원형 fill -->
    <div class="absolute top-[25%] right-[12%] w-[80px] h-[80px] rounded-full bg-white/[0.04] pointer-events-none" />
    <div class="absolute top-[65%] left-[15%] w-[60px] h-[60px] rounded-full bg-white/[0.05] pointer-events-none" />
    <div class="absolute top-[40%] left-[60%] w-[40px] h-[40px] rounded-full bg-white/[0.04] pointer-events-none" />
    <div class="absolute bottom-[30%] right-[40%] w-[50px] h-[50px] rounded-full bg-white/[0.03] pointer-events-none" />
    <div class="absolute top-[70%] right-[20%] w-[30px] h-[30px] rounded-full bg-white/[0.06] pointer-events-none" />
    <div class="absolute top-[10%] right-[45%] w-[20px] h-[20px] rounded-full bg-white/[0.05] pointer-events-none" />
    <!-- 대각선 라인 -->
    <div class="absolute top-0 right-[30%] w-px h-[150%] bg-white/[0.05] pointer-events-none rotate-[15deg] origin-top" />
    <div class="absolute top-0 left-[25%] w-px h-[150%] bg-white/[0.04] pointer-events-none -rotate-[12deg] origin-top" />
    <div class="absolute top-0 right-[60%] w-px h-[150%] bg-white/[0.03] pointer-events-none rotate-[20deg] origin-top" />
    <div class="absolute top-0 left-[50%] w-px h-[150%] bg-white/[0.03] pointer-events-none -rotate-[8deg] origin-top" />
    <!-- 추가 원형 -->
    <div class="absolute top-[35%] left-[45%] w-[350px] h-[350px] rounded-full border border-white/[0.07] pointer-events-none" />
    <div class="absolute -top-10 left-[20%] w-[250px] h-[250px] rounded-full border border-white/10 pointer-events-none" />
    <div class="absolute bottom-[5%] right-[10%] w-[300px] h-[300px] rounded-full border border-white/[0.07] pointer-events-none" />
    <div class="absolute top-[60%] left-[55%] w-[180px] h-[180px] rounded-full border border-white/[0.06] pointer-events-none" />
    <div class="absolute top-[75%] right-[50%] w-[140px] h-[140px] rounded-full border border-white/[0.06] pointer-events-none" />
    <!-- 추가 fill 원 -->
    <div class="absolute top-[8%] left-[65%] w-[90px] h-[90px] rounded-full bg-white/[0.04] pointer-events-none" />
    <div class="absolute bottom-[15%] left-[35%] w-[70px] h-[70px] rounded-full bg-white/[0.05] pointer-events-none" />
    <div class="absolute top-[50%] left-[5%] w-[50px] h-[50px] rounded-full bg-white/[0.04] pointer-events-none" />
    <div class="absolute bottom-[45%] right-[15%] w-[45px] h-[45px] rounded-full bg-white/[0.05] pointer-events-none" />
    <div class="absolute top-[20%] right-[55%] w-[35px] h-[35px] rounded-full bg-white/[0.06] pointer-events-none" />
    <!-- 추가 대각선 -->
    <div class="absolute top-0 left-[10%] w-px h-[150%] bg-white/[0.04] pointer-events-none rotate-[25deg] origin-top" />
    <div class="absolute top-0 right-[15%] w-px h-[150%] bg-white/[0.04] pointer-events-none -rotate-[18deg] origin-top" />
    <div class="absolute top-0 left-[70%] w-px h-[150%] bg-white/[0.03] pointer-events-none rotate-[10deg] origin-top" />
    <!-- 밝은 도트 -->
    <div class="absolute top-[20%] left-[30%] w-1.5 h-1.5 rounded-full bg-white/25 pointer-events-none" />
    <div class="absolute top-[45%] right-[25%] w-1.5 h-1.5 rounded-full bg-white/25 pointer-events-none" />
    <div class="absolute bottom-[25%] left-[45%] w-1.5 h-1.5 rounded-full bg-white/20 pointer-events-none" />
    <div class="absolute top-[35%] left-[75%] w-1.5 h-1.5 rounded-full bg-white/25 pointer-events-none" />
    <div class="absolute bottom-[40%] left-[10%] w-1 h-1 rounded-full bg-white/20 pointer-events-none" />
    <div class="absolute top-[55%] right-[35%] w-1.5 h-1.5 rounded-full bg-white/25 pointer-events-none" />
    <div class="absolute top-[12%] left-[50%] w-1 h-1 rounded-full bg-white/20 pointer-events-none" />
    <div class="absolute top-[72%] left-[25%] w-1.5 h-1.5 rounded-full bg-white/25 pointer-events-none" />
    <div class="absolute bottom-[35%] right-[55%] w-1 h-1 rounded-full bg-white/20 pointer-events-none" />
    <div class="absolute top-[30%] right-[8%] w-1.5 h-1.5 rounded-full bg-white/25 pointer-events-none" />
    <div class="absolute bottom-[60%] left-[80%] w-1 h-1 rounded-full bg-white/20 pointer-events-none" />
    <div class="absolute top-[80%] left-[60%] w-1.5 h-1.5 rounded-full bg-white/25 pointer-events-none" />
    <div class="relative z-[1] max-w-content mx-auto px-6 flex flex-col items-center gap-8">
      <span class="inline-flex items-center gap-2 text-sm font-medium text-white/80 border border-white/25 rounded-full px-4 py-1.5">
        {{ storeCount }}개 매장이 선택한 운영 솔루션
      </span>
      <div class="relative h-[180px] md:h-[200px] w-full max-w-2xl">
        <div
          v-for="(slide, i) in slides"
          :key="i"
          :class="cn('absolute inset-0 flex flex-col items-center gap-4 transition-opacity duration-700', currentSlide === i ? 'opacity-100' : 'opacity-0 pointer-events-none')"
        >
          <h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-title text-white tracking-tight text-center">
            {{ slide.title }}
          </h1>
          <p class="text-base md:text-lg text-white/80 leading-relaxed max-w-2xl text-center" v-html="slide.desc" />
        </div>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 mt-2">
        <NuxtLink to="/pricing">
          <Button class="w-full sm:w-auto bg-[#FFD91C] text-[#0A1A3A] hover:bg-[#FFD91C]/90 font-semibold text-base px-8 py-3 h-auto rounded-lg">
            무료로 시작하기
          </Button>
        </NuxtLink>
        <a :href="appUrl" target="_blank" rel="noopener">
          <Button
            variant="ghost"
            :class="cn('w-full sm:w-auto text-white hover:text-white font-semibold text-base px-8 py-3 h-auto rounded-lg border-0 transition-colors duration-700', 'bg-[#0A1A3A] hover:bg-[#0A1A3A]/80')"
          >
            미리 둘러보기
          </Button>
        </a>
      </div>
      <!-- 롤링 도트 -->
      <div class="flex gap-2 mt-6 justify-center">
        <button
          v-for="(_, i) in slides"
          :key="i"
          :class="cn('w-2 h-2 rounded-full transition-all duration-300', currentSlide === i ? 'bg-white w-6' : 'bg-white/40')"
          @click="goToSlide(i)"
          :aria-label="`슬라이드 ${i + 1}`"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'

import { cn } from '~/lib/utils'

const appUrl = useRuntimeConfig().public.appUrl || 'https://app.pleyon.co.kr/login'

function openChannelTalk() {
  if (typeof window !== 'undefined' && (window as any).ChannelIO) {
    (window as any).ChannelIO('showMessenger')
  }
}

const { data: metrics } = await useFetch('/api/metrics', { default: () => ({ stores: 28 }) })
const storeCount = computed(() => metrics.value?.stores || 28)

const slides = [
  {
    title: '레고카페만을 위해',
    desc: '오직 레고카페만을 위해 만들었습니다.<br>몸에 맞는 옷을 입어야지, 옷에 몸을 맞출 수는 없으니까요.<br><strong class="text-white font-bold">최신 기술이 적용된 플레이온으로 시작하세요.</strong>',
    bg: 'bg-[#1A7CFD]',
  },
  {
    title: '플레이가 직접 만든',
    desc: '국내 최초 레고대여점 브랜드 플레이가 직접 만들었어요.<br>우리는 IT 회사가 아니지만, 상상했던 모든 기능을 하나하나 직접 만들었습니다.<br><strong class="text-white font-bold">제대로된 프로그램은 꼭 필요하니까요.</strong>',
    bg: 'bg-[#DC3545]',
  },
  {
    title: '1인 운영에 딱 맞게',
    desc: '1인 운영에 딱 맞게, 모든 업무가 자동 처리됩니다.<br>마치 알아서 판단하고 운전하는 자율주행 자동차처럼 말이죠.<br><strong class="text-white font-bold">점주님의 피같은 돈과 시간, 아껴 드릴게요.</strong>',
    bg: 'bg-[#6C5CE7]',
  },
]

const currentSlide = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

function startTimer() {
  timer = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length
  }, 5000)
}

function goToSlide(i: number) {
  currentSlide.value = i
  if (timer) clearInterval(timer)
  startTimer()
}

onMounted(() => startTimer())

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
