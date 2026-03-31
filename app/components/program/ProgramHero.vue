<template>
  <section class="relative bg-[#1A7CFD] text-white min-h-[480px] md:min-h-[540px] flex items-center justify-center overflow-hidden">
    <div class="relative w-full max-w-content mx-auto py-32 px-10 z-[1] max-md:py-24 max-md:px-6">
      <!-- 좌우 네비게이션 -->
      <div class="absolute top-1/2 left-0 right-0 -translate-y-1/2 z-[2] pointer-events-none">
        <button
          class="absolute top-1/2 -translate-y-1/2 left-4 max-md:left-2 w-10 h-10 rounded-full border border-white/20 text-white/50 text-sm flex items-center justify-center pointer-events-auto transition-colors hover:bg-white/10 hover:text-white"
          @click="prevSlide"
          aria-label="이전 슬라이드"
        >
          &lt;
        </button>
        <button
          class="absolute top-1/2 -translate-y-1/2 right-4 max-md:right-2 w-10 h-10 rounded-full border border-white/20 text-white/50 text-sm flex items-center justify-center pointer-events-auto transition-colors hover:bg-white/10 hover:text-white"
          @click="nextSlide"
          aria-label="다음 슬라이드"
        >
          &gt;
        </button>
      </div>

      <div class="relative h-[200px] max-md:h-[240px]">
        <div
          v-for="(slide, i) in slides"
          :key="i"
          :class="cn(
            'absolute inset-0 opacity-0 transition-opacity duration-500 flex items-center justify-center',
            currentSlide === i && 'opacity-100'
          )"
        >
          <div class="max-w-[720px] text-center">
            <h1 class="font-display text-4xl md:text-5xl font-semibold leading-title tracking-tight mb-6">
              {{ slide.title }}
            </h1>
            <p class="text-base max-md:text-sm leading-relaxed text-white/80">
              <span v-for="(line, j) in slide.lines" :key="j">
                <span v-if="line.bold" class="font-bold text-white">{{ line.text }}</span>
                <template v-else>{{ line.text }}</template>
                <br v-if="j < slide.lines.length - 1" />
              </span>
            </p>
          </div>
        </div>
      </div>

      <!-- 도트 인디케이터 -->
      <div class="flex gap-2 mt-8 justify-center">
        <button
          v-for="(_, i) in slides"
          :key="i"
          :class="cn(
            'w-2 h-2 rounded-full transition-all',
            currentSlide === i ? 'bg-white' : 'bg-white/30'
          )"
          @click="goToSlide(i)"
          :aria-label="`슬라이드 ${i + 1}`"
        />
      </div>

      <!-- 하단 버튼 -->
      <div class="flex gap-3 mt-8 justify-center max-md:flex-col">
        <Button
          variant="outline"
          class="bg-[#0A1A3A] text-white rounded-lg px-6 py-2.5 h-auto text-sm font-medium hover:bg-[#0A1A3A]/90 transition-colors max-md:w-full border-0"
          @click="showHistory = true"
        >
          히스토리
        </Button>
        <Button
          class="rounded-lg px-6 py-2.5 h-auto text-sm font-medium bg-[#FFD91C] text-[#0A1A3A] hover:bg-[#FFD91C]/90 transition-colors max-md:w-full"
          @click="showTour = true"
        >
          플레이온 둘러보기
        </Button>
      </div>
    </div>

    <!-- 히스토리 모달 -->
    <Dialog :open="showHistory" @update:open="showHistory = $event">
      <DialogContent class="max-w-[500px] w-[90%] max-h-[80vh] overflow-y-auto p-0 gap-0 border-0">
        <DialogHeader class="bg-foreground text-white p-6 rounded-t-lg">
          <DialogTitle class="font-display text-4xl md:text-5xl font-semibold text-center">
            플레이온 히스토리
          </DialogTitle>
        </DialogHeader>
        <div class="p-10 max-md:p-6 text-sm leading-relaxed text-muted-foreground [&>p]:mb-4">
          <p>
            창업 전에는 몰랐던, 운영해 보면 알게되는 것들이 얼마나 많을까요?<br />
            회원가입, 입퇴실, 대여반납, 요금충전 등을 처리하는 프로그램이 그렇습니다.
          </p>
          <p class="font-bold text-foreground">
            꼭! 프로그램 먼저 확인하세요.<br />
            프로그램이 똑똑해야 점주님이 편해 집니다.
          </p>
          <p>
            지난 11년 간, 3번의 시행착오와 4번의 도전.<br />
            우리는 IT 회사가 아니지만, 상상했던 모든 기능을 하나하나 직접 만들었습니다.<br />
            제대로된 프로그램은 꼭 필요하니까요.
          </p>
          <div class="relative pl-6 my-6 border-l-2 border-primary">
            <div
              v-for="item in timeline"
              :key="item.year"
              class="relative mb-4 last:mb-0"
            >
              <div class="absolute -left-[23px] top-1.5 w-2 h-2 bg-primary rounded-full" />
              <p class="text-sm"><strong class="text-foreground">{{ item.year }}</strong> {{ item.text }}</p>
            </div>
          </div>
          <p class="font-bold text-foreground">
            1인 운영에 딱 맞도록, 모든 업무가 자동 처리됩니다.
          </p>
          <p>점주님의 피같은 돈과 시간, 아껴 드릴게요.</p>
        </div>
      </DialogContent>
    </Dialog>

    <!-- 둘러보기 모달 -->
    <Dialog :open="showTour" @update:open="showTour = $event">
      <DialogContent class="max-w-[500px] w-[90%] max-h-[80vh] overflow-y-auto p-0 gap-0 border-0">
        <DialogHeader class="bg-foreground text-white p-6 rounded-t-lg">
          <DialogTitle class="font-display text-4xl md:text-5xl font-semibold text-center">
            플레이온 둘러보기
          </DialogTitle>
        </DialogHeader>
        <div class="p-10 max-md:p-6 text-sm leading-relaxed text-muted-foreground text-center [&>p]:mb-4">
          <p>아래 플레이온 접속 버튼 클릭 후 로그인 창에서 테스트 계정으로 로그인,</p>
          <p>비밀번호 4자리 4417을 입력하시면 플레이온의 다양한 기능을 확인할 수 있어요.</p>
          <div class="text-5xl max-md:text-4xl font-black text-foreground tracking-[8px] my-8">4417</div>
          <a
            href="https://app.pleyon.co.kr"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block px-6 py-3 border border-border rounded-lg font-medium text-sm text-foreground transition-colors mt-4 hover:bg-muted"
          >
            플레이온 접속
          </a>
        </div>
      </DialogContent>
    </Dialog>
  </section>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

const slides = [
  {
    title: '프로그램에 진심인 이유',
    lines: [
      { text: '레고는 아날로그지만, 운영은 모든게 디지털이기 때문이에요.' },
      { text: '직접 운영해 보면 알게됩니다. 프로그램이 얼마나 중요한지를요.' },
      { text: '창업 전, 프로그램 먼저 선택하세요.', bold: true },
    ],
  },
  {
    title: '남이 만든 프로그램',
    lines: [
      { text: '다른 곳은 여기 저기 쓰이는 일반 프로그램을 빌려 씁니다.' },
      { text: '손으로 쓰던 장부를 컴퓨터로 옮겨 놓은 수준이지요.' },
      { text: '말도 안되지만, 프로그램에 일을 맞춰야 해요.', bold: true },
    ],
  },
  {
    title: '우리는 달라요',
    lines: [
      { text: '오로지 레고카페만을 위해 만들었어요.' },
      { text: '몸에 맞는 옷을 입어야지, 옷에 몸을 맞출 수는 없으니까요.' },
      { text: '플레이온으로 시작하세요.', bold: true },
    ],
  },
  {
    title: '일이 절반으로',
    lines: [
      { text: '1인 운영에 딱 맞도록, 모든 업무가 자동 처리됩니다.' },
      { text: '마치 알아서 판단하고 운전하는 자율주행 자동차처럼 말이죠.' },
      { text: '점주님의 피같은 돈과 시간, 아껴 드릴게요.', bold: true },
    ],
  },
]

const timeline = [
  { year: '2015년', text: '매장운영 프로그램 V1.0 개발' },
  { year: '2019년', text: '매장운영 프로그램 V2.0 개발' },
  { year: '2023년', text: '매장운영 프로그램 V3.0 개발' },
  { year: '2025년', text: '자동화/인공지능 에이전트 프로그램 플레이온 4.0 개발' },
]

const currentSlide = ref(0)
const showHistory = ref(false)
const showTour = ref(false)
let autoPlayTimer: ReturnType<typeof setInterval> | null = null

function goToSlide(index: number) {
  currentSlide.value = index
  restartAutoPlay()
}

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.length
  restartAutoPlay()
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
  restartAutoPlay()
}

function startAutoPlay() {
  autoPlayTimer = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length
  }, 7000)
}

function restartAutoPlay() {
  if (autoPlayTimer) clearInterval(autoPlayTimer)
  startAutoPlay()
}

onMounted(() => startAutoPlay())
onUnmounted(() => {
  if (autoPlayTimer) clearInterval(autoPlayTimer)
})
</script>
