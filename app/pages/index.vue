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
  title: '플레이온 - 레고카페 블럭방 레고방 통합 운영 프로그램',
  meta: [
    { name: 'keywords', content: '레고카페, 블럭방, 레고방, 레고대여점, 블럭카페, 브릭카페, 블록방, 블럭대여점, 레고카페 관리 프로그램, 레고카페 운영 프로그램, 블럭방 프로그램, 레고방 프로그램, 레고대여점 프로그램, 블럭카페 프로그램, 레고카페 솔루션, 매장 관리, 회원 관리, 레고 대여 관리' },
  ],
})

useSeoMeta({
  description: '레고카페, 블럭방, 레고방, 레고대여점, 블럭카페, 브릭카페 통합 운영 프로그램. 스마트 체크인, 레고 대여/반납, 회원 관리, 결제/정산, SMS/알림톡까지 하나로. 11년 운영 노하우를 담은 레고카페 전용 솔루션.',
  ogTitle: '플레이온 - 레고카페 블럭방 레고방 통합 운영 프로그램',
  ogDescription: '레고카페, 블럭방, 레고방, 레고대여점 운영의 모든 것을 하나로. 지금 무료 이용을 시작하세요.',
  ogType: 'website',
  ogUrl: 'https://home.pleyon.co.kr',
  twitterCard: 'summary_large_image',
})
</script>
