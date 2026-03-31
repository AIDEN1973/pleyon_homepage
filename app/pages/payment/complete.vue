<template>
  <div class="min-h-screen flex flex-col lg:flex-row">
    <!-- 왼쪽: 브랜드 패널 -->
    <div class="relative lg:w-[480px] xl:w-[520px] shrink-0 bg-[#0F1B2D] text-white overflow-hidden">
      <!-- 배경 장식 -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full border border-white/10" />
        <div class="absolute -bottom-16 -left-16 w-[250px] h-[250px] rounded-full border border-white/[0.07]" />
        <div class="absolute top-[40%] right-[10%] w-[180px] h-[180px] rounded-full border border-white/[0.05]" />
        <div class="absolute top-[20%] left-[15%] w-[60px] h-[60px] rounded-full bg-white/[0.03]" />
        <div class="absolute bottom-[25%] right-[25%] w-[40px] h-[40px] rounded-full bg-white/[0.04]" />
        <div class="absolute inset-0" style="background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 24px 24px;" />
      </div>

      <div class="relative z-10 flex flex-col justify-center h-full px-8 lg:px-12 py-16 lg:py-24">
        <NuxtLink to="/" class="inline-flex items-center gap-2 mb-12">
          <span class="text-xl font-bold tracking-tight">플레이온</span>
        </NuxtLink>

        <!-- 성공 시 플랜 정보 -->
        <template v-if="status === 'success'">
          <div class="mb-10">
            <span class="text-xs font-bold tracking-widest uppercase text-white/50 mb-3 block">가입 완료</span>
            <h1 class="font-display text-3xl font-bold">{{ tierLabel }} 플랜</h1>
            <p class="text-sm text-white/50 mt-2">14일 무료이용이 시작되었습니다.</p>
          </div>

          <div class="space-y-5 mb-12">
            <div class="flex gap-4">
              <div class="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="hsl(213, 98%, 65%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M22 4L12 14.01l-3-3" stroke="hsl(213, 98%, 65%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-white/90">모든 기능 즉시 사용 가능</p>
                <p class="text-xs text-white/45 mt-0.5 leading-relaxed">선택한 플랜의 모든 기능을 바로 이용하세요.</p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="hsl(213, 98%, 65%)" stroke-width="2" fill="none" />
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="hsl(213, 98%, 65%)" stroke-width="2" stroke-linecap="round" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-white/90">14일 무료이용</p>
                <p class="text-xs text-white/45 mt-0.5 leading-relaxed">
                  <template v-if="trialEndLabel">{{ trialEndLabel }}까지 무료로 이용할 수 있습니다.</template>
                  <template v-else>14일간 무료로 이용할 수 있습니다.</template>
                </p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="hsl(213, 98%, 65%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-white/90">실시간 1:1 지원</p>
                <p class="text-xs text-white/45 mt-0.5 leading-relaxed">궁금한 점은 실시간 채팅으로 바로 해결됩니다.</p>
              </div>
            </div>
          </div>
        </template>

        <!-- 실패 또는 기타 -->
        <template v-else>
          <div class="mb-10">
            <span class="text-xs font-bold tracking-widest uppercase text-white/50 mb-3 block">플레이온</span>
            <h1 class="font-display text-3xl font-bold">레고카페 통합 운영 솔루션</h1>
            <p class="text-sm text-white/50 mt-2">매장 운영의 모든 것을 하나로.</p>
          </div>
        </template>

        <!-- 신뢰 지표 -->
        <div class="border-t border-white/10 pt-6">
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="hsl(213, 98%, 65%)" stroke-width="1.5" fill="none" />
              </svg>
              <span class="text-xs text-white/40">SSL 암호화</span>
            </div>
            <div class="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="hsl(213, 98%, 65%)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <circle cx="12" cy="12" r="10" stroke="hsl(213, 98%, 65%)" stroke-width="1.5" fill="none" />
              </svg>
              <span class="text-xs text-white/40">안전한 데이터 관리</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 오른쪽: 콘텐츠 -->
    <div class="flex-1 flex items-center justify-center bg-background px-5 py-16 lg:py-24">
      <div class="w-full max-w-[540px]">
        <!-- 모바일 타이틀 -->
        <div class="lg:hidden mb-8">
          <NuxtLink to="/" class="text-lg font-bold text-foreground">플레이온</NuxtLink>
        </div>

        <!-- 처리 중 -->
        <template v-if="isProcessing">
          <div class="text-center py-12">
            <div class="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p class="text-base text-muted-foreground">처리 중입니다...</p>
          </div>
        </template>

        <!-- 성공 -->
        <template v-else-if="status === 'success'">
          <div class="mb-8">
            <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="hsl(213, 98%, 55%)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h2 class="font-display text-2xl md:text-3xl font-bold text-foreground">가입이 완료되었습니다!</h2>
            <p class="text-sm text-muted-foreground mt-2">
              <strong>{{ tierLabel }}</strong> 플랜의 14일 무료이용이 시작되었습니다.
              <template v-if="trialEndLabel"><br />무료이용 종료일은 <strong>{{ trialEndLabel }}</strong>입니다.</template>
            </p>
          </div>

          <!-- 결제 안내 -->
          <div class="rounded-xl bg-muted/50 p-6 mb-8" style="border: 1px solid #e0e0e0;">
            <h3 class="text-sm font-bold text-foreground mb-1">무료이용 종료 후 결제 안내</h3>
            <p class="text-xs text-muted-foreground mb-4">계속 이용을 희망하시는 경우, 아래 계좌로 이용료를 입금해 주세요.</p>
            <dl class="flex flex-col gap-3">
              <div class="flex justify-between text-sm">
                <dt class="text-muted-foreground">입금 은행</dt>
                <dd class="font-semibold text-foreground">카카오뱅크</dd>
              </div>
              <div class="flex justify-between text-sm">
                <dt class="text-muted-foreground">계좌번호</dt>
                <dd class="font-semibold text-foreground">3333-14-1078266</dd>
              </div>
              <div class="flex justify-between text-sm">
                <dt class="text-muted-foreground">예금주</dt>
                <dd class="font-semibold text-foreground">박소영 (러츠)</dd>
              </div>
              <div class="flex justify-between text-sm">
                <dt class="text-muted-foreground">입금자명</dt>
                <dd class="font-semibold text-foreground">대표자명으로 입금</dd>
              </div>
            </dl>
          </div>

          <Button as="a" :href="appUrl" size="lg" class="w-full h-12 text-base font-semibold">
            매장 관리 시작하기
          </Button>
        </template>

        <!-- 실패 -->
        <template v-else-if="status === 'error'">
          <div class="mb-8">
            <div class="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="hsl(0, 84%, 60%)" stroke-width="2.5" stroke-linecap="round" />
              </svg>
            </div>
            <h2 class="font-display text-2xl md:text-3xl font-bold text-foreground">결제에 실패했습니다</h2>
            <p class="text-sm text-muted-foreground mt-2">
              {{ errorMessage || '결제 처리 중 문제가 발생했습니다.' }}<br />
              다시 시도하거나 문의해 주세요.
            </p>
          </div>
          <div class="flex gap-3">
            <NuxtLink to="/pricing" class="flex-1">
              <Button size="lg" class="w-full h-12 text-base font-semibold">다시 시도하기</Button>
            </NuxtLink>
            <Button variant="outline" class="h-12" @click="openChannelTalk">문의하기</Button>
          </div>
        </template>

        <!-- 잘못된 접근 -->
        <template v-else>
          <div class="mb-8">
            <h2 class="font-display text-2xl font-bold text-foreground">잘못된 접근입니다.</h2>
            <p class="text-sm text-muted-foreground mt-2">유효하지 않은 페이지입니다.</p>
          </div>
          <NuxtLink to="/pricing">
            <Button variant="outline" size="lg" class="h-12">요금제 보기</Button>
          </NuxtLink>
        </template>

        <!-- 하단 링크 -->
        <p class="text-center text-sm text-muted-foreground mt-8">
          도움이 필요하신가요?
          <button class="text-primary font-medium hover:underline" @click="openChannelTalk">실시간 채팅 문의</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'

definePageMeta({ layout: false })

function openChannelTalk() {
  if (typeof window !== 'undefined' && (window as any).ChannelIO) {
    (window as any).ChannelIO('showMessenger')
  }
}

useHead({ title: '가입 완료 - 플레이온' })

const config = useRuntimeConfig()
const supabase = useSupabase()
const route = useRoute()

const status = ref((route.query.status as string) || '')
const tier = ref((route.query.tier as string) || 'basic')
const trialEndsAt = ref((route.query.trialEndsAt as string) || '')
const appUrl = config.public.appUrl || 'https://www.pleyon.co.kr'
const errorMessage = ref('')
const isProcessing = ref(false)

const tierLabels: Record<string, string> = { basic: '베이직', standard: '스탠다드', pro: '프로' }
const tierLabel = computed(() => tierLabels[tier.value] || tier.value)

const trialEndLabel = computed(() => {
  if (!trialEndsAt.value) return ''
  const d = new Date(trialEndsAt.value)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
})

// 모바일 리디렉션: requestIssueBillingKey 후 ?billingKey=... 쿼리파라미터로 복귀
onMounted(async () => {
  const billingKey = route.query.billingKey as string | undefined
  const issueId = route.query.issueId as string | undefined
  const code = route.query.code as string | undefined

  if (code) {
    status.value = 'error'
    errorMessage.value = (route.query.message as string) || '카드 등록이 취소되었습니다.'
    return
  }

  if (billingKey && issueId) {
    isProcessing.value = true
    try {
      if (!issueId.startsWith('p') || issueId.length !== 40) throw new Error('결제 정보를 확인할 수 없습니다.')
      const hex = issueId.slice(1, 33)
      const storeId = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`

      const tierValue = tier.value

      const session = (await supabase.auth.getSession()).data.session
      if (!session?.access_token) throw new Error('인증 세션이 없습니다. 다시 로그인해주세요.')

      const completeRes = await $fetch<{ success: boolean; trialEndsAt: string }>('/api/payment/complete', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { storeId, tier: tierValue, billingKey },
      })

      trialEndsAt.value = completeRes.trialEndsAt || ''
      status.value = 'success'
    } catch (err: unknown) {
      const error = err as { data?: { message?: string }; message?: string }
      status.value = 'error'
      errorMessage.value = error?.data?.message || error?.message || '결제 처리에 실패했습니다.'
    } finally {
      isProcessing.value = false
    }
  }
})
</script>
