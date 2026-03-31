<template>
  <div>
    <!-- 결제 주기 토글 + 요금 카드 -->
    <section class="pt-16 pb-20 bg-white">
      <div class="max-w-content mx-auto px-6">
        <!-- 결제 주기 토글 -->
        <div class="flex justify-center mb-12">
          <div class="inline-flex items-center flex-wrap justify-center gap-3 bg-muted border border-border rounded-full px-5 py-2.5">
            <span
              :class="cn(
                'text-sm font-medium transition-colors flex items-center gap-2',
                billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'
              )"
            >월간 결제</span>
            <Switch
              :model-value="billingCycle === 'annual'"
              aria-label="연간/월간 결제 전환"
              @update:model-value="billingCycle = $event ? 'annual' : 'monthly'"
            />
            <span
              :class="cn(
                'text-sm font-medium transition-colors flex items-center gap-2',
                billingCycle === 'annual' ? 'text-foreground' : 'text-muted-foreground'
              )"
            >
              연간 결제
              <Badge class="bg-primary text-primary-foreground border-0 font-bold text-xs">10% 할인</Badge>
            </span>
          </div>
        </div>
      </div>
      <div class="max-w-content mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start max-w-[440px] lg:max-w-none mx-auto">
          <Card
            v-for="plan in displayPlans"
            :key="plan.id"
            :class="cn(
              'relative flex flex-col gap-4 p-8 rounded-2xl border shadow-none',
              plan.featured
                ? 'border-primary'
                : 'border-border'
            )"
          >
            <Badge
              v-if="plan.featured"
              class="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-bold text-xs px-4 whitespace-nowrap"
            >추천</Badge>
            <CardHeader class="p-0 space-y-1">
              <h3 class="text-xl font-bold text-foreground">{{ plan.name }}</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">{{ plan.description }}</p>
            </CardHeader>
            <CardContent class="p-0 space-y-1">
              <div class="flex flex-col gap-1">
                <span v-if="billingCycle === 'annual'" class="text-sm text-muted-foreground line-through">{{ plan.monthlyPriceFormatted }}</span>
                <div class="flex items-baseline gap-2">
                  <span class="text-4xl font-extrabold text-foreground tracking-tight">{{ plan.displayPrice }}</span>
                  <span class="text-sm text-muted-foreground">/ 월</span>
                </div>
              </div>
              <p class="text-xs text-muted-foreground -mt-1">
                VAT 포함
                <span v-if="billingCycle === 'annual'" class="text-primary font-medium">· 연 {{ plan.annualTotal }} 청구</span>
              </p>
            </CardContent>
            <CardFooter class="p-0 flex-col gap-4">
              <NuxtLink
                :to="`/signup?tier=${plan.id}${billingCycle === 'annual' ? '&billing=annual' : ''}`"
                class="w-full"
              >
                <Button
                  variant="default"
                  class="w-full"
                >
                  14일 무료이용 시작
                </Button>
              </NuxtLink>
              <Separator />
              <ul class="flex flex-col gap-3 w-full">
                <li
                  v-for="h in plan.highlights"
                  :key="h"
                  class="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <circle cx="9" cy="9" r="9" :fill="plan.featured ? 'hsl(var(--primary))' : 'hsl(var(--border))'" />
                    <path d="M5.5 9l2.5 2.5 4.5-4.5" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  {{ h }}
                </li>
              </ul>
              <a href="#compare" class="text-center text-sm text-primary font-medium mt-1 hover:opacity-75 transition-opacity">전체 기능 비교 ↓</a>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>

    <!-- 기능 전체 비교표 -->
    <section id="compare" class="py-20 bg-white">
      <div class="max-w-content mx-auto px-6">
        <div class="text-center space-y-3 mb-14">
          <h2 class="font-display text-3xl md:text-4xl font-semibold text-foreground tracking-tight">플랜별 기능 전체 비교</h2>
          <p class="text-base text-muted-foreground max-w-2xl mx-auto">
            어떤 플랜이 우리 매장에 맞는지 기능 하나하나 확인하세요.
          </p>
        </div>

        <!-- 모바일 스크롤 안내 -->
        <p class="hidden max-md:block text-center text-xs text-muted-foreground mb-4">← 좌우로 스크롤하여 비교할 수 있습니다 →</p>

        <div class="overflow-x-auto border border-border rounded-xl overflow-hidden">
          <table class="w-full min-w-[600px] text-sm">
            <colgroup>
              <col class="w-[46%]" />
              <col class="w-[18%]" />
              <col class="w-[18%]" />
              <col class="w-[18%]" />
            </colgroup>

            <!-- 헤더 -->
            <thead>
              <tr class="border-b border-border">
                <th class="text-left px-5 py-5 align-bottom border-r border-border">
                  <span class="text-base font-bold text-foreground">항목</span>
                </th>
                <th
                  v-for="plan in displayPlans"
                  :key="plan.id"
                  class="text-center px-4 py-5 align-bottom border-r border-border last:border-r-0"
                  scope="col"
                >
                  <div class="flex flex-col items-center gap-1">
                    <Badge v-if="plan.featured" class="bg-primary text-primary-foreground font-bold text-xs px-3 mb-1">추천</Badge>
                    <span class="text-base font-bold text-foreground">{{ plan.name }}</span>
                    <span class="text-sm text-muted-foreground">{{ plan.displayPrice }}/월</span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              <template v-for="cat in featureCategories" :key="cat.id">
                <!-- 카테고리 헤더 -->
                <tr class="border-b border-border">
                  <td colspan="4" class="px-5 py-3 bg-muted/40">
                    <span class="text-sm font-bold text-foreground">{{ cat.name }}</span>
                  </td>
                </tr>

                <!-- 기능 행 -->
                <tr
                  v-for="feat in cat.features"
                  :key="feat.name"
                  class="border-b border-border/40 hover:bg-muted/20 transition-colors"
                >
                  <!-- 기능명 -->
                  <td class="px-5 py-3.5 align-middle border-r border-border">
                    <span class="text-sm font-medium text-foreground">{{ feat.name }}</span>
                    <span v-if="feat.desc" class="block text-xs text-muted-foreground mt-0.5 leading-normal">{{ feat.desc }}</span>
                  </td>

                  <!-- 베이직 -->
                  <td class="px-3 py-3.5 text-center align-middle border-r border-border">
                    <template v-if="feat.basic === true">
                      <svg class="inline-block" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-label="제공">
                        <path d="M5 10.5l3.5 3.5L15 7" stroke="hsl(var(--primary))" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </template>
                    <template v-else-if="feat.basic === 'partial'">
                      <span class="text-xs font-medium text-muted-foreground">{{ feat.basicNote || '일부' }}</span>
                    </template>
                    <template v-else>
                      <span class="text-muted-foreground/40">—</span>
                    </template>
                  </td>

                  <!-- 스탠다드 -->
                  <td class="px-3 py-3.5 text-center align-middle bg-primary/[0.03] border-r border-border">
                    <template v-if="feat.standard === true">
                      <svg class="inline-block" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-label="제공">
                        <path d="M5 10.5l3.5 3.5L15 7" stroke="hsl(var(--primary))" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </template>
                    <template v-else-if="feat.standard === 'partial'">
                      <span class="text-xs font-medium text-primary">{{ feat.standardNote || '일부' }}</span>
                    </template>
                    <template v-else>
                      <span class="text-muted-foreground/40">—</span>
                    </template>
                  </td>

                  <!-- 프로 -->
                  <td class="px-3 py-3.5 text-center align-middle">
                    <template v-if="feat.pro === true">
                      <svg class="inline-block" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-label="제공">
                        <path d="M5 10.5l3.5 3.5L15 7" stroke="hsl(var(--primary))" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </template>
                    <template v-else>
                      <span class="text-muted-foreground/40">—</span>
                    </template>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- 요금 FAQ -->
    <section class="py-20 bg-muted">
      <div class="container max-w-narrow">
        <div class="text-center space-y-4 mb-12">
          <h2 class="font-display text-3xl md:text-4xl font-semibold text-foreground tracking-tight">요금 관련 궁금한 점</h2>
        </div>
        <div class="flex flex-col gap-3">
          <div
            v-for="(item, index) in pricingFaqs"
            :key="index"
            :class="cn(
              'bg-card border rounded-xl overflow-hidden transition-all',
              openFaq === index
                ? 'border-primary'
                : 'border-border'
            )"
          >
            <button
              class="w-full flex items-center justify-between gap-4 px-6 py-5 text-base font-semibold text-left"
              :class="cn(
                openFaq === index ? 'text-primary' : 'text-foreground'
              )"
              @click="openFaq = openFaq === index ? null : index"
            >
              <span>{{ item.q }}</span>
              <svg
                :class="cn(
                  'shrink-0 transition-transform w-5 h-5',
                  openFaq === index ? 'rotate-180 text-primary' : 'text-muted-foreground'
                )"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M5 8l5 5 5-5" />
              </svg>
            </button>
            <div
              class="grid transition-all"
              :class="openFaq === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
            >
              <p
                :class="cn(
                  'overflow-hidden text-sm text-muted-foreground leading-relaxed px-6',
                  openFaq === index && 'pb-5'
                )"
              >{{ item.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <CtaSection />
  </div>
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils'
import { Card, CardHeader, CardContent, CardFooter } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Switch } from '~/components/ui/switch'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '~/components/ui/table'
import { Separator } from '~/components/ui/separator'

useHead({ title: '요금제 - 플레이온' })
useSeoMeta({
  description: '합리적인 가격으로 레고카페 운영을 혁신하세요. 베이직 33,000원 · 스탠다드 55,000원 · 프로 99,000원. 전체 기능 비교표로 우리 매장에 맞는 플랜을 확인하세요.',
})

const openFaq = ref<number | null>(null)
const billingCycle = ref<'monthly' | 'annual'>('monthly')

// ─── 타입 ─────────────────────────────────────────────
type Avail = true | false | 'partial'

interface Feature {
  name: string
  desc?: string
  basic: Avail
  basicNote?: string      // basic이 'partial'일 때 표시할 제한 설명
  standard: Avail
  standardNote?: string   // standard가 'partial'일 때 표시할 제한 설명
  pro: Avail
}

interface FeatureCategory {
  id: string
  name: string
  badge: string
  badgeType: 'all' | 'standard' | 'pro'
  features: Feature[]
}

interface Plan {
  id: 'basic' | 'standard' | 'pro'
  name: string
  description: string
  monthlyPrice: number
  featured: boolean
  highlights: string[]
}

// ─── 요금 카드 데이터 ──────────────────────────────────
const plans: Plan[] = [
  {
    id: 'basic',
    name: '베이직',
    description: '시간요금제 중심의 기본 매장 운영',
    monthlyPrice: 33000,
    featured: false,
    highlights: [
      '회원 관리 & 체크인/아웃',
      '시간 요금제 운영',
      'SMS & 카카오 알림톡',
      '대시보드 & 통계',
      '적립금 자동 적립',
    ],
  },
  {
    id: 'standard',
    name: '스탠다드',
    description: '대여·포인트 요금제까지 활용하는 성장 매장',
    monthlyPrice: 55000,
    featured: true,
    highlights: [
      '베이직 모든 기능 포함',
      '대여·포인트 요금제 운영',
      '레고 대여/반납 관리',
      '레고 이력 검색 & 추적',
      '전국 매장 랭킹',
    ],
  },
  {
    id: 'pro',
    name: '프로',
    description: '전 기능 — 프론트, 터미널, AI 블로그까지',
    monthlyPrice: 99000,
    featured: false,
    highlights: [
      '스탠다드 모든 기능 포함',
      '고객용 레고 카탈로그 (프론트)',
      '보조 단말기 운영',
      'AI 블로그 글 자동생성',
      '레고 부품검색 & 설명서',
    ],
  },
]

const ANNUAL_DISCOUNT = 0.10

// SSR 환경(Node.js)에서 locale 지원 여부와 무관하게 동일한 결과를 보장
const formatKRW = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원'

const displayPlans = computed(() =>
  plans.map(plan => {
    const discounted = billingCycle.value === 'annual'
      ? Math.round(plan.monthlyPrice * (1 - ANNUAL_DISCOUNT) / 100) * 100
      : plan.monthlyPrice
    return {
      ...plan,
      monthlyPriceFormatted: formatKRW(plan.monthlyPrice),
      displayPrice: formatKRW(discounted),
      annualTotal: formatKRW(discounted * 12),
    }
  })
)

// ─── 기능 비교표 데이터 ────────────────────────────────
const featureCategories: FeatureCategory[] = [
  {
    id: 'ops',
    name: '기본 운영',
    badge: '전 플랜',
    badgeType: 'all',
    features: [
      {
        name: '회원 관리',
        desc: '등록·수정·검색·등급·CRM 이력 조회',
        basic: true, standard: true, pro: true,
      },
      {
        name: '체크인/아웃',
        desc: '입퇴실 처리 및 자동 요금 계산',
        basic: true, standard: true, pro: true,
      },
      {
        name: '결제 처리',
        desc: '현금·카드·포인트 결제 및 영수증',
        basic: true, standard: true, pro: true,
      },
      {
        name: '레고 재고 관리',
        desc: '보유 레고 입고·재고 현황 관리',
        basic: true, standard: true, pro: true,
      },
      {
        name: 'SMS 문자 발송',
        desc: '대량 문자·생일 알림·수동 발송',
        basic: true, standard: true, pro: true,
      },
      {
        name: '카카오 알림톡',
        desc: '카카오톡 알림톡 자동 발송',
        basic: true, standard: true, pro: true,
      },
      {
        name: '대시보드 & 통계',
        desc: '매출·입실·레고 현황 분석',
        basic: true, standard: true, pro: true,
      },
      {
        name: '시간 요금제',
        desc: '시간정액권·선불권·월정액 설정 및 운영',
        basic: true, standard: true, pro: true,
      },
      {
        name: '적립금 관리',
        desc: '결제 시 자동 적립·수동 지급/차감',
        basic: true, standard: true, pro: true,
      },
      {
        name: '상품 판매',
        desc: '음료·간식 등 부가 상품 결제',
        basic: true, standard: true, pro: true,
      },
      {
        name: '인쇄물·비즈도안',
        desc: '테이블 카드·비즈도안 파일 출력',
        basic: true, standard: true, pro: true,
      },
      {
        name: '운영메모 & 게시판',
        desc: '매장 운영 메모 작성·본사 공지 확인',
        basic: true, standard: true, pro: true,
      },
    ],
  },
  {
    id: 'rental',
    name: '대여·포인트 시스템',
    badge: '스탠다드+',
    badgeType: 'standard',
    features: [
      {
        name: '요금제 충전',
        desc: '회원에게 요금제 충전',
        basic: 'partial', basicNote: '시간권만',
        standard: true, pro: true,
      },
      {
        name: '요금제 설정',
        desc: '요금 상품 등록·관리',
        basic: 'partial', basicNote: '시간권만',
        standard: true, pro: true,
      },
      {
        name: '포인트/적립금 관리',
        desc: '포인트·적립금 수동 지급/차감',
        basic: 'partial', basicNote: '적립금만',
        standard: true, pro: true,
      },
      {
        name: '대여 요금제',
        desc: '대여권 상품 설정 및 충전',
        basic: false, standard: true, pro: true,
      },
      {
        name: '포인트 요금제',
        desc: '포인트 구매·충전 상품 운영',
        basic: false, standard: true, pro: true,
      },
      {
        name: '레고 대여/반납',
        desc: '집에서 레고 빌려가기·반납 처리',
        basic: false, standard: true, pro: true,
      },
      {
        name: '레고 이력 검색',
        desc: '레고별 사용 이력 전체 추적',
        basic: false, standard: true, pro: true,
      },
      {
        name: '전국 매장 랭킹',
        desc: '레고 인기 순위·월별 리포트 비교',
        basic: false, standard: true, pro: true,
      },
      {
        name: '레고 등급 설정',
        desc: '레고 등급 분류 및 추가요금 설정',
        basic: false, standard: true, pro: true,
      },
      {
        name: '1회 대여료 설정',
        desc: '당일 레고 대여 단가 개별 설정',
        basic: false, standard: true, pro: true,
      },
    ],
  },
  {
    id: 'front',
    name: '프론트 시스템',
    badge: '프로 전용',
    badgeType: 'pro',
    features: [
      {
        name: '고객용 레고 카탈로그',
        desc: '손님이 직접 레고 검색·대여 신청하는 전용 화면',
        basic: false, standard: false, pro: true,
      },
      {
        name: '보조 단말기 (터미널)',
        desc: '추가 태블릿으로 퇴실·반납 동시 운영',
        basic: false, standard: false, pro: true,
      },
      {
        name: 'AI 블로그 자동생성',
        desc: '레고 기반 블로그 글 AI 초안 자동 생성',
        basic: false, standard: false, pro: true,
      },
      {
        name: '레고 부품 검색',
        desc: '부품 번호로 세트 내 부품 조회',
        basic: false, standard: false, pro: true,
      },
      {
        name: '레고 조립 설명서',
        desc: '세트별 공식 설명서 즉시 조회',
        basic: false, standard: false, pro: true,
      },
      {
        name: '프론트 환경설정',
        desc: '카탈로그 디자인·운영 방식 설정',
        basic: false, standard: false, pro: true,
      },
    ],
  },
]

// ─── FAQ 데이터 ────────────────────────────────────────
const pricingFaqs = [
  {
    q: '무료 이용 기간이 있나요?',
    a: '네, 모든 플랜에 14일 무료 이용이 제공됩니다. 이용 기간 동안 선택한 플랜의 모든 기능을 제한 없이 사용할 수 있습니다.',
  },
  {
    q: '중도 해지가 가능한가요?',
    a: '네, 언제든 해지 가능합니다. 월간 결제의 경우 해지 시 해당 결제 기간(월말)까지 정상 이용 가능하며, 이미 결제된 월 요금은 환불되지 않고 다음 달부터 과금이 중단됩니다. 연간 결제의 경우 이용한 기간을 할인 전 월 정가로 계산하여 잔액을 환불합니다.',
  },
  {
    q: 'SMS/알림톡 비용은 별도인가요?',
    a: 'SMS와 알림톡은 건당 과금됩니다. 플랜 요금에는 포함되지 않으며, 실제 발송량만큼만 과금됩니다.',
  },
  {
    q: '플랜 변경이 가능한가요?',
    a: '네, 마이페이지에서 언제든 상위 플랜으로 업그레이드하거나 하위 플랜으로 변경할 수 있습니다. 플랜 변경은 즉시 적용되며, 상위 플랜 변경 시 남은 기간에 대한 차액이 청구되고 하위 플랜 변경 시 남은 기간의 차액이 다음 결제에서 차감됩니다.',
  },
  {
    q: '가맹점도 이 요금제를 사용하나요?',
    a: '아닙니다. 가맹점은 별도 가맹 계약으로 전 기능을 이용하며, SaaS 요금제와는 별개입니다.',
  },
  {
    q: '베이직에서 스탠다드로 올리면 기존 데이터는 유지되나요?',
    a: '네, 플랜을 변경해도 기존에 쌓인 회원·결제·레고 데이터는 모두 유지됩니다. 업그레이드 즉시 추가 기능이 활성화됩니다.',
  },
  {
    q: '연간 결제와 월간 결제의 차이는 무엇인가요?',
    a: '연간 결제를 선택하면 월 구독료의 10%가 할인됩니다. 예를 들어 스탠다드 플랜은 월 55,000원에서 49,500원으로 줄어들며, 연간 594,000원이 일괄 청구됩니다. 중도 해지 시 이용한 기간은 할인 전 월 정가로 계산하고, 연간 결제액에서 차감한 잔액을 환불합니다. (예: 스탠다드 연간 594,000원 결제 후 3개월 이용 시 환불액 = 594,000 - 55,000 × 3 = 429,000원)',
  },
]
</script>
