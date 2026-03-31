<template>
  <section class="py-20 md:py-28">
    <div class="max-w-content mx-auto px-6">
      <div ref="metricsRef" class="grid grid-cols-2 md:flex md:justify-between text-center">
        <div
          v-for="(metric, i) in metricItems"
          :key="metric.label"
          :class="cn(
            'fade-in flex flex-col items-center gap-2 px-4 md:px-10 py-6 relative',
            `fade-in-delay-${i + 1}`
          )"
        >
          <!-- 모바일: 좌측 열 우측 구분선 -->
          <div v-if="i % 2 === 0" class="absolute right-0 top-1/2 -translate-y-1/2 w-px h-1/2 bg-border md:hidden" />
          <!-- 데스크탑: 항목 사이 구분선 -->
          <div v-if="i > 0" class="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-1/2 bg-border" />
          <component :is="metric.icon" :size="24" :stroke-width="1.5" class="text-primary mb-1" />
          <span class="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight tabular-nums">
            {{ animatedValues[i].toLocaleString() }}
          </span>
          <span class="text-xs md:text-sm text-muted-foreground">{{ metric.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils'
import { useIntersectionObserver } from '@vueuse/core'
import { Store, Users, Activity, Blocks } from 'lucide-vue-next'

const fallback = { stores: 28, members: 51808, transactions: 575268, legoSets: 4353 }

const metrics = ref(fallback)

const { data } = await useFetch('/api/metrics', { default: () => fallback })
if (data.value) {
  metrics.value = data.value
}

const metricItems = computed(() => [
  { value: metrics.value.stores, label: '이용매장', icon: Store },
  { value: metrics.value.members, label: '등록회원', icon: Users },
  { value: metrics.value.transactions, label: '처리건수', icon: Activity },
  { value: metrics.value.legoSets, label: '레고세트', icon: Blocks },
])

const animatedValues = ref(metricItems.value.map(() => 0))
const metricsRef = ref<HTMLElement | null>(null)
let repeatTimer: ReturnType<typeof setInterval> | null = null

function animateCountUp() {
  const duration = 1500
  const steps = 50
  animatedValues.value = metricItems.value.map(() => 0)

  metricItems.value.forEach((metric, i) => {
    const increment = metric.value / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      animatedValues.value[i] = Math.min(Math.round(increment * step), metric.value)
      if (step >= steps) {
        clearInterval(timer)
        animatedValues.value[i] = metric.value
      }
    }, duration / steps)
  })
}

useIntersectionObserver(metricsRef, ([entry]) => {
  if (entry?.isIntersecting) {
    metricsRef.value?.querySelectorAll('.fade-in').forEach((el) => {
      el.classList.add('is-visible')
    })
    animateCountUp()
    if (!repeatTimer) {
      repeatTimer = setInterval(() => {
        animateCountUp()
      }, 10000)
    }
  }
}, { threshold: 0.3 })

onUnmounted(() => {
  if (repeatTimer) clearInterval(repeatTimer)
})
</script>
