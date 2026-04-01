<template>
  <section class="bg-[#1A7CFD] py-16 md:py-24">
    <div class="max-w-content mx-auto px-6">
      <div class="text-center mb-12">
        <p class="text-sm font-medium text-white/70 tracking-widest uppercase mb-3">FAQ</p>
        <h2 class="font-display text-3xl md:text-4xl font-semibold text-white leading-title mb-4">자주묻는 질문</h2>
        <p class="text-base text-white/80">플레이온에 대해 궁금한 점들을 확인해보세요.</p>
      </div>

      <!-- 카테고리 탭 -->
      <Tabs :default-value="categories[0].name" @update:model-value="onTabChange">
        <TabsList class="flex justify-center gap-2 mb-12 flex-wrap bg-transparent h-auto">
          <TabsTrigger
            v-for="(cat, i) in categories"
            :key="i"
            :value="cat.name"
            class="px-4 md:px-5 py-2 rounded-lg text-sm font-medium text-white/60 bg-white/10 data-[state=active]:bg-white data-[state=active]:text-[#1A7CFD] hover:bg-white/20 transition-colors"
          >
            {{ cat.name }}
          </TabsTrigger>
        </TabsList>

        <TabsContent v-for="(cat, i) in categories" :key="i" :value="cat.name">
          <Accordion type="single" collapsible class="max-w-narrow mx-auto">
            <AccordionItem
              v-for="(item, j) in cat.items"
              :key="j"
              :value="`faq-${i}-${j}`"
              class="border-b border-white/20"
            >
              <AccordionTrigger class="py-5 text-sm md:text-base font-medium text-white hover:text-white/70 hover:no-underline">
                {{ item.q }}
              </AccordionTrigger>
              <AccordionContent class="pb-5 text-sm leading-relaxed text-white">
                {{ item.a }}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '~/components/ui/accordion'

function onTabChange() {}

const categories = [
  {
    name: '회원 및 이용 관리',
    items: [
      { q: '신규 회원 등록 및 기존 회원 관리는 어떻게 하나요?', a: '회원등록 및 관리 기능을 통해 신규 등록, 기본정보 변경, 보호자 정보 연동, 회원 삭제 등을 할 수 있습니다.' },
      { q: '형제나 친구끼리 요금제를 함께 사용할 수 있나요?', a: '네, 그룹회원 기능을 이용해 형제, 자매, 친구 등을 하나의 그룹으로 묶어 요금제를 공유할 수 있습니다.' },
      { q: '회원이 아닌 손님도 매장을 이용할 수 있나요?', a: '네, 비회원입실 기능을 통해 회원이 아니더라도 1회 이용 손님을 위한 입실 처리가 가능합니다.' },
      { q: '시간당 과금이나 정액시간 차감은 어떻게 관리되나요?', a: '입퇴실 기능을 통해 시간당 과금 및 정액시간 차감 처리가 관리됩니다.' },
      { q: '잠시 자리를 비울 때 이용 시간을 멈출 수 있나요?', a: '네, 실시간 홀드 기능을 사용하면 레고 선택이나 잠시 휴식 중 이용 시간을 일시적으로 멈출 수 있습니다.' },
    ],
  },
  {
    name: '요금 및 결제 시스템',
    items: [
      { q: '어떤 종류의 요금제를 설정할 수 있나요?', a: '시간당 기본, 정액, 횟수대여, 월정액, 선불, 포인트 전용 등 다양한 요금제를 설정할 수 있습니다.' },
      { q: '요금 계산은 어떻게 이루어지나요?', a: '지능형 요금계산 시스템이 요금제 종류에 따라 결제수단과 방법을 자동으로 변경하여 빠르게 처리합니다.' },
      { q: '포인트 충전과 사용은 어떻게 관리되나요?', a: '수동/자동 충전, 차감, 지급, 사용이 모두 지원되며 포인트 이력이 자동으로 기록됩니다.' },
      { q: '과자, 음료 등 상품 판매도 관리할 수 있나요?', a: '네, 상품관리 기능을 통해 판매가격 및 재고를 관리하고, 이용요금에 자동 합산할 수 있습니다.' },
    ],
  },
  {
    name: '레고 대여 및 재고 관리',
    items: [
      { q: '레고 대여와 반납은 어떻게 처리되나요?', a: '플레이온의 에이전트가 대여회원을 자동 판단하여 대여, 반납, 연체까지 모두 자동으로 처리합니다.' },
      { q: '대여회원이 아닌 손님도 레고를 대여할 수 있나요?', a: '네, 1회 대여 기능을 통해 비대여 회원도 요금 정책에 따라 1회 대여료가 자동 계산됩니다.' },
      { q: '레고 연체료는 어떻게 계산되나요?', a: '반납일을 초과한 경우 연체 일수에 따라 자동으로 연체료가 계산됩니다.' },
      { q: '새로운 레고를 어떻게 등록하나요?', a: '레고 제품번호만 입력하면 지능형 에이전트가 자동으로 레고정보를 검색해 등록과 입고처리를 해줍니다.' },
    ],
  },
  {
    name: '운영 지원 및 자동화',
    items: [
      { q: '문자 발송은 어떻게 이루어지나요?', a: '입퇴실, 대여반납, 요금충전 등 상황에 맞는 상세한 안내 문자가 자동으로 발송됩니다.' },
      { q: '특정 회원에게만 문자를 보낼 수 있나요?', a: '네, 수동문자 기능을 통해 특정 회원 또는 선택한 여러 회원에게 개별 문자를 발송할 수 있습니다.' },
      { q: '어시스턴트 단말기란 무엇인가요?', a: '회원가입, 요금충전, 퇴실, 반납을 처리하는 보조 단말기로, 손님이 직접 조작할 수 있습니다.' },
    ],
  },
  {
    name: '통계 및 분석',
    items: [
      { q: '매장 매출 현황을 어떻게 확인하나요?', a: '대시보드에서 매출, 요금충전, 상품판매, 신규회원, 방문자, 이용시간 등 실시간 통계를 확인할 수 있습니다.' },
      { q: 'AI 인사이트 분석은 어떤 기능인가요?', a: 'AI가 고객관리, 매출최적화 등 5개 대분류 21개 항목을 분석하고 문제점과 개선방안을 제공합니다.' },
      { q: '레고 이용 현황도 분석할 수 있나요?', a: '네, 인기 레고, 시리즈별 평균 체류시간 등 6개 항목을 그래프와 차트로 시각화해 확인할 수 있습니다.' },
    ],
  },
  {
    name: '시스템 및 관리 지원',
    items: [
      { q: '데이터 백업은 어떻게 이루어지나요?', a: 'AWS를 통한 정기적인 데이터베이스 백업이 자동으로 이루어집니다.' },
      { q: '본사와 실시간 소통이 가능한가요?', a: '네, 실시간 채팅 기능을 통해 카카오톡과 유사한 형태로 본사와 즉시 소통할 수 있습니다.' },
      { q: '프로그램 사용법을 모르겠어요.', a: '챗봇 도움말과 모든 페이지별 상세 매뉴얼이 제공되어 언제든지 참고할 수 있습니다.' },
    ],
  },
]
</script>
