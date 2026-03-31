<template>
  <section class="py-24 md:py-32">
    <div class="max-w-narrow mx-auto px-6">
      <div class="text-center mb-12">
        <p class="text-sm font-medium text-primary tracking-widest uppercase mb-3">FAQ</p>
        <h2 class="font-display text-4xl md:text-5xl font-semibold text-foreground tracking-tight leading-title">자주 묻는 질문</h2>
      </div>

      <Accordion type="single" collapsible class="flex flex-col gap-0">
        <AccordionItem
          v-for="(item, index) in faqs"
          :key="index"
          :value="`faq-${index}`"
          class="border-b border-border"
        >
          <AccordionTrigger class="py-5 text-base font-medium text-foreground hover:no-underline">
            {{ item.question }}
          </AccordionTrigger>
          <AccordionContent class="pb-5 text-sm text-muted-foreground leading-relaxed">
            {{ item.answer }}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '~/components/ui/accordion'

const faqs = [
  {
    question: '가맹비와 월 이용료는 얼마인가요?',
    answer: '가맹비와 월 이용료는 매장 규모와 필요한 기능에 따라 달라집니다. 자세한 요금은 요금제 페이지를 확인하시거나, 문의하기를 통해 맞춤 견적을 받아보세요.',
  },
  {
    question: '도입까지 얼마나 걸리나요?',
    answer: '기본 세팅은 1~2일이면 완료됩니다. 기존 회원 데이터 이관이 필요한 경우에도 일주일 내로 진행 가능합니다. 도입 과정에서 전담 매니저가 1:1로 지원합니다.',
  },
  {
    question: '기존 회원 데이터를 옮길 수 있나요?',
    answer: '네, 엑셀 파일이나 기존 시스템의 데이터를 플레이온으로 이관할 수 있습니다. 회원정보, 포인트 잔액, 이용권 정보 등을 안전하게 마이그레이션합니다.',
  },
  {
    question: '태블릿/PC 사양 제한이 있나요?',
    answer: '플레이온은 웹 기반 SaaS이므로 크롬 브라우저가 실행 가능한 모든 기기에서 사용할 수 있습니다. 별도 프로그램 설치가 필요 없습니다.',
  },
  {
    question: '인터넷이 끊기면 어떻게 되나요?',
    answer: '네트워크 일시 단절 시에도 현재 진행 중인 세션 정보는 로컬에 보존됩니다. 연결이 복구되면 자동으로 서버와 동기화됩니다.',
  },
  {
    question: '여러 매장을 한 번에 관리할 수 있나요?',
    answer: '네, 관리자 계정 하나로 여러 매장의 매출, 회원, 재고를 통합 관리할 수 있습니다. 매장별 비교 리포트도 자동 생성됩니다.',
  },
]
</script>
