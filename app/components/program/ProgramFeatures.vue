<template>
  <section class="bg-muted/50 py-16 md:py-24">
    <div class="max-w-content mx-auto px-6">
      <div class="text-center mb-16">
        <p class="text-sm font-medium text-primary tracking-widest uppercase mb-3">All Features</p>
        <h2 class="font-display text-3xl md:text-4xl font-semibold text-foreground leading-title mb-4">주요기능</h2>
        <p class="text-base text-muted-foreground">플레이온의 모든 기능을 한 눈에 확인하세요.</p>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="(feat, i) in visibleItems"
          :key="i"
          class="bg-background border border-border rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-0.5"
        >
          <div class="w-10 h-10 flex items-center justify-center mx-auto mb-3 text-foreground" v-html="feat.icon" />
          <h4 class="text-base font-semibold text-foreground mb-1">{{ feat.title }}</h4>
          <p class="text-xs text-[#555555] leading-relaxed">{{ feat.desc }}</p>
        </div>
      </div>

      <div v-if="!showAll" class="text-center mt-8">
        <button
          class="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          @click="showAll = true"
        >
          모든 기능 보기 ({{ hiddenCount }}개 더보기)
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const showAll = ref(false)

const icon = (path: string) =>
  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="${path}" fill="currentColor"/></svg>`

const ICONS = {
  person: icon('M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'),
  group: icon('M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z'),
  guest: icon('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'),
  memo: icon('M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z'),
  checkin: icon('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'),
  hold: icon('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z'),
  product: icon('M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'),
  lego: icon('M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z'),
  rental: icon('M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z'),
  pricing: icon('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z'),
  chart: icon('M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z'),
  star: icon('M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'),
  mail: icon('M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'),
  settings: icon('M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z'),
  dashboard: icon('M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z'),
  calendar: icon('M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z'),
  chat: icon('M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z'),
  security: icon('M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.4 16,13V16C16,16.6 15.6,17 15,17H9C8.4,17 8,16.6 8,16V13C8,12.4 8.4,11.5 9,11.5V10C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,9.2 10.2,10V11.5H13.8V10C13.8,9.2 12.8,8.2 12,8.2Z'),
  backup: icon('M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H7V10H17V12ZM15 16H7V14H15V16ZM17 8H7V6H17V8Z'),
  trophy: icon('M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z'),
  blog: icon('M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z'),
  palette: icon('M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.2-.64-1.67-.08-.1-.13-.21-.13-.33 0-.28.22-.5.5-.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z'),
  grid: icon('M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z'),
  search: icon('M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'),
  book: icon('M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z'),
  forum: icon('M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z'),
}

const featureGroups = [
  { items: [
    { icon: ICONS.person, title: '회원등록 및 관리', desc: '신규 회원등록, 정보변경, 보호자 연동, 회원관리' },
    { icon: ICONS.group, title: '그룹회원', desc: '형제, 친구 등 그룹 묶어 요금제 공유' },
    { icon: ICONS.guest, title: '비회원입실', desc: '1회 이용 손님을 위한 간편 입실 처리' },
    { icon: ICONS.memo, title: 'CRM메모', desc: '회원별 메모 및 특이사항 기록, 관리' },
  ] },
  { items: [
    { icon: ICONS.checkin, title: '입퇴실', desc: '시간당 과금 및 정액시간 차감 처리 관리' },
    { icon: ICONS.hold, title: '실시간홀드', desc: '레고 선택, 휴식 시 이용시간 일시 중지' },
    { icon: ICONS.product, title: '상품판매', desc: '과자, 음료 등 상품판매 금액 자동 합산' },
    { icon: ICONS.lego, title: '레고정보연동', desc: '회원이 이용 중인 레고 자동 연동 관리' },
  ] },
  { items: [
    { icon: ICONS.rental, title: '대여반납', desc: '레고 대여 신청부터 반납까지 자동 처리' },
    { icon: ICONS.rental, title: '1회대여', desc: '비대여 회원의 1회성 대여 자동 요금 계산' },
    { icon: ICONS.rental, title: '중복대여', desc: '한 회원이 여러 레고를 동시에 대여 가능' },
    { icon: ICONS.chart, title: '초과요금계산', desc: '약정 등급 초과 대여 시 자동 계산' },
    { icon: ICONS.chart, title: '자동연체료', desc: '반납일 초과 시 연체 일수별 자동 계산' },
    { icon: ICONS.lego, title: '레고입고', desc: '원클릭 레고 등록 및 입고 처리' },
    { icon: ICONS.settings, title: '레고등급설정', desc: '레고의 등급과 사이즈 변경 및 내역 관리' },
    { icon: ICONS.book, title: '레고 데이터베이스', desc: '매일 자동 업데이트되는 레고 정보 관리' },
  ] },
  { items: [
    { icon: ICONS.pricing, title: '다양한 요금설정', desc: '시간당, 정액, 횟수대여, 월정액, 포인트 전용 등' },
    { icon: ICONS.chart, title: '지능형 요금계산', desc: '요금제별 결제수단/방법 자동 변경 및 빠른 처리' },
    { icon: ICONS.star, title: '포인트', desc: '수동/자동 충전, 차감, 지급, 사용 지원' },
    { icon: ICONS.product, title: '상품관리', desc: '상품 판매가격 및 재고 관리' },
  ] },
  { items: [
    { icon: ICONS.checkin, title: '자동 프론트 기능', desc: '손님 신청 입퇴실, 대여/반납 현황 일괄 관리' },
    { icon: ICONS.memo, title: '전자 카탈로그', desc: '키오스크에서 레고 확인 및 선택 리스트 자동 생성' },
    { icon: ICONS.person, title: '어시스턴트', desc: '회원가입, 요금충전, 퇴실, 반납 처리 보조 단말기' },
    { icon: ICONS.mail, title: '자동문자', desc: '상황에 맞는 상세한 안내 문자 자동 발송' },
    { icon: ICONS.mail, title: '수동문자', desc: '특정 회원에게만 개별 문자 발송' },
    { icon: ICONS.mail, title: '단체문자', desc: '등록된 회원 모두에게 단체 문자 발송' },
    { icon: ICONS.chat, title: '알림톡 발송', desc: '카카오 알림톡으로 자동/수동 메시지 발송' },
    { icon: ICONS.settings, title: '문자 템플릿 관리', desc: '자동발송 문자 내용 직접 편집 및 관리' },
    { icon: ICONS.search, title: '문자 발송 로그', desc: '발송된 문자 이력 조회 및 관리' },
  ] },
  { items: [
    { icon: ICONS.memo, title: '운영메모', desc: '매장 운영에 필요한 간단한 메모 저장 및 관리' },
    { icon: ICONS.settings, title: '환경설정', desc: '문자, 프론트, 시작페이지 등 환경설정 관리' },
    { icon: ICONS.product, title: '쇼핑몰', desc: '매장 운영에 필요한 물품 구매 전용 쇼핑몰' },
    { icon: ICONS.dashboard, title: '대시보드', desc: '매출, 충전, 신규회원, 방문자 등 통계 확인' },
    { icon: ICONS.calendar, title: '매장 캘린더', desc: '일일 매출, 충전, 대여현황 월별 캘린더 조회' },
    { icon: ICONS.chart, title: '레고분석', desc: '인기 레고, 시리즈별 체류시간 등 그래프/차트 시각화' },
    { icon: ICONS.trophy, title: '랭킹 시스템', desc: '전국 매장 성과 벤치마킹 및 순위 비교' },
    { icon: ICONS.person, title: '회원 CRM 분석', desc: '개별 회원 방문 패턴, 성장경로, 이탈위험 분석' },
    { icon: ICONS.chart, title: '레고 이력 분석', desc: '개별 레고 수익, ROI, 대여 타임라인 분석' },
    { icon: ICONS.search, title: '레고 부품 검색', desc: '개별 부품 검색 및 조회로 분실 부품 확인' },
    { icon: ICONS.book, title: '레고 설명서 검색', desc: '조립 설명서 검색 및 바로보기 제공' },
    { icon: ICONS.chat, title: '실시간 채팅', desc: '본사와의 실시간 메신저' },
  ] },
  { items: [
    { icon: ICONS.blog, title: '블로그 자동 생성', desc: 'AI가 레고 소개 블로그 글을 자동 작성' },
    { icon: ICONS.palette, title: '인쇄물 디자인', desc: '명함, 포스터 등 마케팅 자료 자체 제작' },
    { icon: ICONS.grid, title: '비즈 도안', desc: '비즈 도안 편집기, 이미지를 도안으로 자동 변환' },
    { icon: ICONS.forum, title: '게시판', desc: '점주 간 소통 및 본사 공지 확인' },
  ] },
  { items: [
    { icon: ICONS.star, title: '통계배지', desc: '모든 페이지 상단에 간단한 통계 정보 배지 출력' },
    { icon: ICONS.book, title: '매뉴얼', desc: '모든 페이지별 상세 사용 매뉴얼 제공' },
    { icon: ICONS.pricing, title: '성능 모니터링', desc: '시스템 성능 모니터링 및 이상 징후 탐지' },
    { icon: ICONS.security, title: '보안시스템', desc: '사용자별 권한 관리 및 데이터 보안' },
    { icon: ICONS.backup, title: '데이터 백업 및 복구', desc: 'AWS를 통한 정기적인 데이터베이스 백업' },
    { icon: ICONS.memo, title: '공지사항', desc: '본사 발송 공지 및 시스템 업데이트 알림 확인' },
  ] },
]

const allItems = featureGroups.flatMap(g => g.items)
const INITIAL_ROWS = 3
const COLS = 4
const visibleItems = computed(() => showAll.value ? allItems : allItems.slice(0, INITIAL_ROWS * COLS))
const hiddenCount = computed(() => allItems.length - INITIAL_ROWS * COLS)
</script>
