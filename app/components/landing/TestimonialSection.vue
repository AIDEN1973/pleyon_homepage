<template>
  <section id="testimonials" class="py-24 md:py-40 bg-muted/40">
    <div class="max-w-content mx-auto px-6">
      <div class="mb-16">
        <p class="text-sm font-medium text-muted-foreground tracking-widest uppercase mb-3">Testimonials</p>
        <h2 class="text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight">
          점주님들의 실제 경험
        </h2>
      </div>

      <div ref="gridRef" class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[560px] lg:max-w-none mx-auto">
        <div
          v-for="(t, i) in testimonials"
          :key="t.name"
          class="fade-in flex flex-col justify-between bg-background rounded-2xl p-8 border border-border/60"
          :class="`fade-in-delay-${i + 1}`"
        >
          <p class="text-base text-foreground/80 leading-relaxed mb-8">
            "{{ t.text }}"
          </p>
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-semibold">
              {{ t.name[0] }}
            </div>
            <div>
              <p class="text-sm font-semibold text-foreground">{{ t.name }}</p>
              <p class="text-xs text-muted-foreground">{{ t.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

const gridRef = ref<HTMLElement | null>(null)

onMounted(() => {
  useIntersectionObserver(gridRef, ([entry]) => {
    if (entry?.isIntersecting) {
      gridRef.value?.querySelectorAll('.fade-in').forEach((el) => {
        el.classList.add('is-visible')
      })
    }
  }, { threshold: 0.1 })
})

const testimonials = [
  {
    text: '직원이 레고 관리에 쓰던 시간이 절반으로 줄었어요. 바코드 찍으면 바로 대여 처리가 되니까 실수도 없고요.',
    name: '김민서',
    role: '키즈파크 OO점 대표',
  },
  {
    text: '체크인 줄이 사라졌습니다. 주말 피크타임에도 태블릿 터치 한 번이면 끝이라 부모님들 반응이 확 달라졌어요.',
    name: '박준혁',
    role: '플레이존 OO점 대표',
  },
  {
    text: '매출 정산을 엑셀로 하다가 플레이온으로 바꾸니 월말 정산이 10분이면 끝나요. 왜 진작 안 썼나 싶어요.',
    name: '이수진',
    role: '브릭월드 OO점 대표',
  },
]
</script>
