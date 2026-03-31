<template>
  <div class="overflow-x-hidden">
    <HeroSection />
    <TrustMetrics />
    <FeatureGroup />
    <ProgramFeatures />
    <TechShowcase />
    <ProgramFaq />
    <CtaSection />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '플레이온 - 레고카페 통합 운영 솔루션',
})

useSeoMeta({
  description: '스마트 체크인, 레고 관리, 결제/정산, SMS/알림톡까지. 레고카페 통합 운영 플랫폼.',
  ogTitle: '플레이온 - 레고카페 통합 운영 솔루션',
  ogDescription: '레고카페 운영의 모든 것을 하나로. 지금 무료 이용을 시작하세요.',
  ogType: 'website',
  ogUrl: 'https://home.pleyon.co.kr',
  twitterCard: 'summary_large_image',
})
</script>
