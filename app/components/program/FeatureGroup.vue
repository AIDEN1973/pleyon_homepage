<template>
  <div id="features">
  <section v-for="(group, gi) in groups" :key="group.id" :id="group.id">
    <!-- 기능 섹션 반복 -->
    <div
      v-for="(section, si) in group.sections"
      :key="si"
      :class="cn('py-16 md:py-24', section.phone ? 'bg-foreground' : section.swap ? 'bg-muted/50' : si % 2 === 0 ? 'bg-background' : 'bg-muted/50')"
    >
      <div class="max-w-content mx-auto px-6">
        <div :class="cn('flex flex-col items-stretch lg:flex-row lg:items-center gap-16 lg:gap-28', (section.phone || section.swap || si % 2 === 1) && 'lg:flex-row-reverse')">
          <!-- 이미지 슬라이더 -->
          <div class="w-full lg:flex-1 lg:max-w-[50%]">
            <div v-if="section.images" class="relative w-full aspect-[4/5] rounded-2xl overflow-hidden">
              <img
                v-for="(img, k) in section.images"
                :key="k"
                :src="`${IMG_BASE}/${img.src}`"
                :alt="img.alt"
                :class="cn('absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-500', (slideIndexes[`${gi}-${si}`] || 0) === k && 'opacity-100')"
                width="500"
                height="560"
                :loading="k === 0 ? 'eager' : 'lazy'"
              />
            </div>
            <!-- 문자 채팅 UI — 자동 스크롤 -->
            <div v-if="section.phone" class="w-full max-w-[420px] mx-auto h-[480px] overflow-hidden relative">
              <!-- 상단/하단 페이드 -->
              <div class="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-foreground to-transparent z-10 pointer-events-none" />
              <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-foreground to-transparent z-10 pointer-events-none" />
              <!-- 스크롤 콘텐츠 (2배 복제 → 무한 루프) -->
              <div class="animate-scroll-up space-y-4 py-16">
                <div v-for="(msg, k) in [...section.phone, ...section.phone]" :key="k" class="flex gap-3 items-start">
                  <div class="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                    <span class="text-[10px] font-bold text-white/80">P</span>
                  </div>
                  <div class="flex-1">
                    <span v-if="msg.label" class="text-[9px] font-semibold text-white/40 uppercase tracking-wider mb-1 block">{{ msg.label }}</span>
                    <div class="bg-white/10 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div class="text-xs leading-relaxed text-white/90 [&>strong]:text-white [&>strong]:font-semibold" v-html="msg.text" />
                    </div>
                    <span class="text-[9px] text-white/25 mt-1 ml-1 block">{{ msg.date }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 텍스트 -->
          <div class="w-full lg:flex-1">
            <span :class="cn('text-xs font-bold tracking-widest uppercase mb-4 block', (section.phone) ? 'text-white/50' : 'text-primary')">CORE {{ String(getSectionNumber(gi, si)).padStart(2, '0') }}</span>
            <h3 :class="cn('font-display text-3xl md:text-4xl font-semibold leading-title mb-4', (section.phone) ? 'text-white' : 'text-foreground')">
              <strong class="font-extrabold">{{ section.titleBold }}</strong><br />{{ section.titleSub }}
            </h3>
            <p :class="cn('text-base leading-relaxed mb-6', (section.phone) ? 'text-white/70 [&>strong]:font-bold [&>strong]:text-white' : 'text-muted-foreground [&>strong]:font-bold [&>strong]:text-foreground')" v-html="section.desc" />
            <Accordion type="single" collapsible class="w-full lg:max-w-[420px]">
              <AccordionItem
                v-for="(item, j) in section.accordion"
                :key="j"
                :value="`${gi}-${si}-${j}`"
                :class="cn('border-b', (section.phone) ? 'border-white/10' : 'border-border')"
              >
                <AccordionTrigger :class="cn('py-3.5 text-sm font-medium hover:no-underline data-[state=open]:font-bold', (section.phone) ? 'text-white hover:text-white/80' : 'text-foreground hover:text-primary')">
                  {{ item.title }}
                </AccordionTrigger>
                <AccordionContent :class="cn('pb-3.5 text-sm leading-relaxed', (section.phone) ? 'text-white/60' : 'text-muted-foreground')">
                  {{ item.content }}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  </section>
  </div>
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '~/components/ui/accordion'

const IMG_BASE = 'https://sywkefjwagkddzqarylf.supabase.co/storage/v1/object/public/homepage/program'

const slideIndexes = reactive<Record<string, number>>({})
const timers: ReturnType<typeof setInterval>[] = []

const groups = [
  {
    id: 'automation',
    label: 'Core 01',
    title: '모든게 자동',
    desc: '입퇴실, 대여반납, 가입충전까지. 키오스크 터치 한 번이면 모든 업무가 자동 처리됩니다.',
    sections: [
      {
        titleBold: '모든게 자동',
        titleSub: '입실과 퇴실',
        desc: '모든 업무가 자동화되어 있어요.<br />카운터 전면에 설치된 키오스크를 이용해<br /><strong>손님이 입퇴실을 신청하면 모든 업무가 자동 처리됩니다.</strong>',
        accordion: [
          { title: '편리한 홀드 기능', content: '회원이 잠시 자리를 비우거나, 새로운 레고를 선택하는 경우 이용시간을 일시 멈출 수 있어요.' },
          { title: '상품판매 연동', content: '과자, 음료, 기타 상품 판매금액이 매장 이용요금에 자동으로 합산, 통합 계산할 수 있어 편리해요.' },
          { title: '이용 중인 레고 연동', content: '회원이 어떤 레고를 이용하고 있는지 자동으로 연동되어 회원 이력관리가 가능해요.' },
        ],
        images: [
          { src: 'pleyon_img_1.jpg', alt: '레고카탈로그 메인' },
          { src: 'pleyon_img_2.jpg', alt: '손님 본인인증' },
          { src: 'pleyon_img_3.jpg', alt: '손님 정보확인' },
          { src: 'pleyon_img_4.jpg', alt: '입실완료' },
        ],
      },
      {
        titleBold: '모든게 자동',
        titleSub: '대여와 반납',
        desc: '플레이온의 에이전트가 대여회원을 판단해서<br /><strong>자동으로 대여, 반납, 연체까지 처리하고</strong><br />문자 발송까지 마무리합니다.',
        accordion: [
          { title: '1회 대여 기능', content: '대여회원이 아니어도, 요금 정책에 따라 자동으로 1회 대여료를 계산하고 대여를 해줄 수 있어요.' },
          { title: '초과요금 자동 계산', content: '대여회원이 약정된 등급 이상의 레고를 대여하는 경우 초과요금이 자동으로 계산됩니다.' },
          { title: '연체료 자동 계산', content: '연체 중인 레고의 경우, 반납 시 연체 일수에 따라 자동으로 연체료가 계산됩니다.' },
        ],
        images: [
          { src: 'pleyon_img_5.jpg', alt: '레고카탈로그 메인' },
          { src: 'pleyon_img_6.jpg', alt: '손님 본인인증' },
          { src: 'pleyon_img_8.jpg', alt: '손님 정보확인' },
          { src: 'pleyon_img_7.jpg', alt: '대여완료' },
        ],
      },
      {
        titleBold: '모든게 자동',
        titleSub: '가입과 충전',
        desc: '회원가입 및 요금충전 전용 단말기를 통해<br /><strong>손님이 직접 회원가입과 요금충전을 할 수 있어요.</strong>',
        accordion: [
          { title: '간단한 회원가입 양식', content: '아이 이름과 보호자 연락처만 입력하면 회원가입이 완료됩니다.' },
          { title: '요금제 정보 자동 연동', content: '점주님이 설정한 요금제 정보가 자동으로 연동되고, 손님이 직관적으로 요금제를 선택할 수 있어요.' },
          { title: '친절한 화면 안내', content: '요금충전 후 결제금액과 어떤 요금제를 가입했는지 자동으로 안내되며, 문자로도 즉시 발송됩니다.' },
        ],
        images: [
          { src: 'pleyon_img_9.jpg', alt: '메뉴선택' },
          { src: 'pleyon_img_10.jpg', alt: '회원가입' },
          { src: 'pleyon_img_11.jpg', alt: '손님 정보확인' },
          { src: 'pleyon_img_12.jpg', alt: '요금제 선택' },
          { src: 'pleyon_img_13.jpg', alt: '요금충전 완료' },
        ],
      },
    ],
  },
  {
    id: 'messaging',
    label: 'Core 02',
    title: '문자와 카톡',
    desc: '상황에 맞는 상세한 안내 문자와 알림톡이 자동 발송됩니다.',
    sections: [
      {
        titleBold: '자동 문자도',
        titleSub: '알아서 척척',
        desc: '<strong>상황에 맞는 상세한 안내 문자가 자동으로 발송됩니다.</strong><br />요금제 정보, 레고정보, 이용시간, 잔여시간 등<br />최대한 많은 정보를 담았어요.',
        accordion: [
          { title: '수동문자 발송', content: '특정 회원 또는 선택한 여러 회원에게만 수동으로 개별 문자를 발송할 수 있어요.' },
          { title: '단체문자 발송', content: '등록된 회원 모두에게 수동으로 단체문자를 발송할 수 있어 이벤트나 공지사항을 빠르게 전달할 수 있어요.' },
          { title: '편리한 템플릿 수정', content: '자동발송 문자 내용을 점주님이 직접 수정할 수 있어 점주님만의 문자 서비스를 만들 수 있어요.' },
        ],
        phone: [
          { text: '안녕하세요. 플레이님.<br />플레이 테스트 매장 회원으로 가입해주셔서 감사합니다.', date: '13:55', label: '회원가입' },
          { text: '<strong>요금제명 :</strong> [매장] 10시간<br /><strong>결제금액 :</strong> 75,000원<br />요금충전이 완료되었습니다.', date: '13:58', label: '요금충전' },
          { text: '플레이 명지국제점에 오신 걸 환영합니다.<br /><strong>입실시간 :</strong> 13:20<br /><strong>잔여시간 :</strong> 6시간 40분', date: '14:20', label: '입실 안내' },
          { text: '이용시간이 <strong>10분 후</strong> 종료됩니다.<br />연장을 원하시면 카운터를 방문해주세요.', date: '15:10', label: '시간 만료' },
          { text: '<strong>퇴실시간 :</strong> 15:15<br /><strong>총 이용시간 :</strong> 1시간 55분<br />오늘도 즐거운 시간 되셨나요?', date: '15:15', label: '퇴실 안내' },
          { text: '<strong>레고번호 :</strong> 21255 네더 포털 매복<br /><strong>반납예정일 :</strong> 2025-09-22<br /><strong>잔여횟수 :</strong> 7회', date: '15:19', label: '레고 대여' },
          { text: '레고 반납이 완료되었습니다.<br /><strong>대여기간 :</strong> 5일<br /><strong>연체료 :</strong> 없음', date: '17:08', label: '레고 반납' },
          { text: '생일을 축하합니다! 🎂<br />특별 포인트 <strong>5,000P</strong>가 지급되었습니다.', date: '09:00', label: '생일 축하' },
        ],
      },
    ],
  },
  {
    id: 'ai-analysis',
    label: 'Core 03',
    title: '매장분석',
    desc: 'AI 에이전트가 매장을 모니터링하고 문제점과 개선방안을 알려드립니다.',
    sections: [
      {
        titleBold: '매장분석도',
        titleSub: '인공지능이',
        desc: '<strong>AI 에이전트가 항상 매장을 모니터링하고 있어요.</strong><br />고객관리, 매출최적화 등 5개 대분류, 21개 항목을<br />분석하고 문제점과 개선방안을 알려 드립니다.',
        accordion: [
          { title: 'Real-time Analytics', content: '인공지능 에이전트가 실시간으로 매장 현황을 분석해 요약, 주요발견, 실행계획까지 알려 드려요.' },
          { title: 'ChatGPT LLM', content: 'LLM 모델 중 가장 똑똑한 ChatGPT의 GPT-4o-mini가 빠르게 분석한 결과를 정리해 알려 드려요.' },
          { title: 'Predictive Insights', content: '고객분석, 마케팅 전략, 운영 최적화에 필요한 데이터를 제공해 경쟁 우위를 확보할 수 있도록 도와 드려요.' },
        ],
        images: [
          { src: 'pleyon_img_14.jpg', alt: '스마트폰 대시보드' },
          { src: 'pleyon_img_15.jpg', alt: '실시간 매출 현황' },
        ],
      },
    ],
  },
  {
    id: 'data',
    label: 'Core 04',
    title: '데이터분석',
    desc: '매출부터 레고 이용현황까지 실시간으로 분석, 가공합니다.',
    sections: [
      {
        titleBold: '똑소리 나는',
        titleSub: '데이터 분석',
        swap: true,
        desc: '<strong>지능형 에이전트가 매출부터 레고 이용현황까지</strong><br />실시간으로 수치 데이터를 분석, 가공하고 있어요.<br />특히 레고분석 서비스는 인기 레고와 시리즈,<br />이용시간, 체류시간까지 분석해 냅니다.',
        accordion: [
          { title: '대시보드 기능', content: '실시간으로 매출현황부터, 충전, 결제, 포인트, 입퇴실, 대여/반납 내역까지 모든 데이터를 통계자료로 제공하고 있어요.' },
          { title: '레고분석 서비스', content: '인기레고부터 시리즈별 평균 체류시간 까지, 총 6개 항목에 대한 현황을 그래프와 차트로 시각화해 확인할 수 있어요.' },
          { title: '개별 회원분석 서비스', content: '개별 회원의 이용내역부터 결제내역까지 총 7개 항목에 대한 현황을 상세하게 조회하고 관리할 수 있어요.' },
        ],
        images: [
          { src: 'pleyon_img_16.jpg', alt: '스마트 분석 대시보드' },
          { src: 'pleyon_img_17.jpg', alt: '고객 행동 분석' },
          { src: 'pleyon_img_18.jpg', alt: '매출 예측 차트' },
          { src: 'pleyon_img_19.jpg', alt: 'AI 인사이트' },
          { src: 'pleyon_img_20.jpg', alt: '데이터 시각화' },
        ],
      },
    ],
  },
  {
    id: 'lego',
    label: 'Core 05',
    title: '레고관리',
    desc: '레고 제품번호만 입력하면 자동 등록. 체계적인 재고 관리.',
    sections: [
      {
        titleBold: '레고등록도',
        titleSub: '클릭한번에',
        desc: '꼭 필요한 일이지만 귀찮은게 사실이에요.<br /><strong>한 번에 1,000개까지, 레고 제품번호만 입력하면</strong><br />지능형 에이전트가 자동으로 레고정보를 검색해<br />등록과 입고처리까지 한 번에 끝내 드려요.',
        accordion: [
          { title: '원클릭 입고처리', content: '간편한 원클릭 등록 시스템으로 한 번에 1,000개까지, 레고를 빠르게 입고할 수 있어요.' },
          { title: '자동화된 레고 데이터베이스', content: '매일 새벽 3시에 자동 업데이트되는 레고 데이터베이스를 통해 레고 정보를 실시간으로 관리할 수 있어요.' },
          { title: '자동 등록요청 기능', content: '레고 데이터베이스에 없는 제품인 경우 본사로 자동 등록요청과 입고처리까지 한 번에 처리할 수 있어요.' },
        ],
        images: [
          { src: 'pleyon_img_21.jpg', alt: '통합 대시보드' },
          { src: 'pleyon_img_22.jpg', alt: '운영 관리 시스템' },
        ],
      },
    ],
  },
]

function getSectionNumber(gi: number, si: number) {
  let count = 0
  for (let g = 0; g < gi; g++) count += groups[g].sections.length
  return count + si + 1
}

onMounted(() => {
  groups.forEach((group, gi) => {
    group.sections.forEach((section, si) => {
      if (section.images) {
        const key = `${gi}-${si}`
        slideIndexes[key] = 0
        timers.push(setInterval(() => {
          slideIndexes[key] = ((slideIndexes[key] || 0) + 1) % section.images!.length
        }, 3000))
      }
    })
  })
})

onUnmounted(() => timers.forEach(t => clearInterval(t)))
</script>
