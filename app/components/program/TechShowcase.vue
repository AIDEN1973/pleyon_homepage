<template>
  <section class="relative w-full h-[320px] md:h-[550px] overflow-hidden bg-foreground">
    <div
      :class="cn('flex h-full w-[300%] transition-transform duration-500 ease-in-out', slideOffsets[currentIndex])"
    >
      <div
        v-for="(item, i) in items"
        :key="i"
        class="flex-[0_0_33.333%] h-full relative flex items-center justify-center"
      >
        <img
          :src="item.image"
          :alt="item.alt"
          width="1920"
          height="550"
          loading="lazy"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/50 z-[1]" />
        <div
          class="absolute top-[30%] left-1/2 -translate-x-1/2 text-white/50 text-xs md:text-sm font-medium text-center tracking-widest uppercase z-[2]"
        >
          {{ item.label }}
        </div>
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-display text-2xl md:text-4xl font-semibold text-center leading-title z-[2] max-w-full px-4 md:max-w-none md:px-0 whitespace-nowrap"
        >
          {{ item.text }}<br />
          <span class="text-primary">{{ item.accent }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils'

const IMG_BASE = 'https://sywkefjwagkddzqarylf.supabase.co/storage/v1/object/public/homepage/program'

const slideOffsets = ['translate-x-0', '-translate-x-1/3', '-translate-x-2/3'] as const

const isMobile = ref(false)
onMounted(() => {
  isMobile.value = window.innerWidth < 768
  window.addEventListener('resize', () => { isMobile.value = window.innerWidth < 768 })
})

const items = computed(() => [
  {
    image: `${IMG_BASE}/pleyon_img_29.jpg`,
    alt: '소스코드 규모',
    label: 'FEATURES 01',
    text: isMobile.value ? '차세대 SaaS' : '한 줄로 세우면 서울에서 대전까지',
    accent: isMobile.value ? '기술 스택' : '18만 줄의 소스코드',
  },
  {
    image: `${IMG_BASE}/pleyon_img_30.jpg`,
    alt: '엔터프라이즈급 아키텍처',
    label: 'FEATURES 02',
    text: isMobile.value ? '엔터프라이즈급' : '1,164개 파일, 88개 DB 테이블',
    accent: isMobile.value ? '아키텍처' : '엔터프라이즈급 아키텍처',
  },
  {
    image: `${IMG_BASE}/pleyon_img_31.jpg`,
    alt: '차세대 SaaS 기술 스택',
    label: 'FEATURES 03',
    text: isMobile.value ? '서울에서 대전까지' : '최신 SPA 프레임워크, PostgreSQL 서버리스',
    accent: isMobile.value ? '18만 줄의 소스코드' : '차세대 SaaS 기술 스택',
  },
])

const currentIndex = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % items.value.length
  }, 3000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
