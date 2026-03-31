<template>
  <section class="py-24 md:py-32 text-center bg-foreground">
    <div class="max-w-content mx-auto px-6 flex flex-col items-center gap-6">
      <h2 class="font-display text-3xl md:text-4xl font-semibold text-white tracking-tight leading-title">
        매장 운영, 더 빠르고 쉽게.
      </h2>
      <p class="text-base md:text-lg text-white/60 leading-relaxed max-w-lg">
        플레이온이 레고카페 운영의 복잡함을 해결합니다.<br class="hidden md:inline">
        지금 무료 이용을 신청하고 직접 경험해보세요.
      </p>
      <div class="flex flex-col sm:flex-row gap-3 mt-4">
        <NuxtLink to="/pricing">
          <Button class="w-full sm:w-auto bg-[#FFD91C] text-[#0A1A3A] hover:bg-[#FFD91C]/90 font-semibold text-base px-8 py-3 h-auto rounded-lg">
            무료로 시작하기
          </Button>
        </NuxtLink>
        <a :href="appUrl" target="_blank" rel="noopener">
          <Button variant="ghost" class="w-full sm:w-auto bg-[#1A7CFD] text-white hover:bg-[#1A7CFD]/80 hover:text-white font-semibold text-base px-8 py-3 h-auto rounded-lg border-0">
            미리 둘러보기
          </Button>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'

const appUrl = useRuntimeConfig().public.appUrl || 'https://www.pleyon.co.kr/login'

function openChannelTalk() {
  if (typeof window !== 'undefined' && (window as any).ChannelIO) {
    (window as any).ChannelIO('showMessenger')
  }
}
</script>
