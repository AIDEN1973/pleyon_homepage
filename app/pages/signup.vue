<template>
  <div class="min-h-screen flex flex-col lg:flex-row">
    <!-- 왼쪽: 가치 제안 패널 -->
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
        <!-- 로고 / 브랜드 -->
        <NuxtLink to="/" class="inline-flex items-center gap-2.5 mb-12 group">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="10" fill="#1A7CFD"/><path d="M10 10h12v4H14v8h-4V10z" fill="#fff"/></svg>
          <span class="text-xl font-bold tracking-tight text-[#1A7CFD]">플레이온 홈</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-white/30 group-hover:text-white/60 transition-colors"><path d="M7 17l9.2-5L7 7v10z" fill="currentColor"/></svg>
        </NuxtLink>

        <!-- 선택된 플랜 정보 -->
        <div class="mb-10">
          <span class="text-xs font-bold tracking-widest uppercase text-white/50 mb-3 block">선택한 플랜</span>
          <div class="flex items-baseline gap-3">
            <h1 class="font-display text-3xl font-bold">{{ selectedTier.name }}</h1>
            <span class="text-lg text-white/60">{{ selectedTier.displayPrice }}<span class="text-sm"> / 월</span></span>
          </div>
          <div v-if="isAnnual" class="flex items-center gap-2 mt-1.5">
            <span class="text-xs text-white/30 line-through">{{ selectedTier.monthlyLabel }}</span>
            <span class="text-xs font-semibold text-[hsl(213,98%,65%)]">연간 결제 10% 할인</span>
          </div>
          <p class="text-sm text-white/50 mt-2">{{ selectedTier.desc }}</p>
        </div>

        <!-- 혜택 리스트 -->
        <div class="space-y-5 mb-12">
          <div v-for="(benefit, i) in benefits" :key="i" class="flex gap-4">
            <div class="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path :d="benefit.icon" stroke="hsl(213, 98%, 65%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-white/90">{{ benefit.title }}</p>
              <p class="text-xs text-white/45 mt-0.5 leading-relaxed">{{ benefit.desc }}</p>
            </div>
          </div>
        </div>

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
              <span class="text-xs text-white/40">카드 등록 없이 시작</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 오른쪽: 회원가입 폼 -->
    <div class="flex-1 flex items-center justify-center bg-background px-5 py-16 lg:py-24">
      <div class="w-full max-w-[540px]">
        <!-- 모바일 타이틀 -->
        <div class="lg:hidden mb-8">
          <NuxtLink to="/" class="inline-flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="10" fill="#1A7CFD"/><path d="M10 10h12v4H14v8h-4V10z" fill="#fff"/></svg>
              <span class="text-xl font-bold text-[#1A7CFD]">플레이온 홈</span>
            </NuxtLink>
        </div>

        <!-- 헤더 -->
        <div class="mb-10">
          <h2 class="font-display text-2xl md:text-3xl font-bold text-foreground">무료이용 시작하기</h2>
          <p class="text-sm text-muted-foreground mt-2">14일간 모든 기능을 무료로 이용할 수 있습니다.</p>
        </div>

        <!-- 스텝 인디케이터 -->
        <div class="mb-8">
          <div class="flex items-center gap-2">
            <div
              v-for="(s, i) in steps"
              :key="i"
              class="flex items-center"
            >
              <div class="flex items-center gap-2">
                <div
                  :class="cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all',
                    step === i && 'bg-primary text-primary-foreground',
                    step > i && 'bg-foreground text-background',
                    step < i && 'bg-muted text-muted-foreground border border-border'
                  )"
                >
                  <svg v-if="step > i" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <span v-else>{{ i + 1 }}</span>
                </div>
                <span
                  :class="cn(
                    'text-sm font-medium',
                    step === i ? 'text-foreground' : 'text-muted-foreground'
                  )"
                >{{ s }}</span>
              </div>
              <div v-if="i < steps.length - 1" class="w-8 h-px bg-border mx-3" />
            </div>
          </div>
        </div>

        <!-- Step 0: 매장 정보 -->
        <form v-if="step === 0" class="flex flex-col gap-5" @submit.prevent="nextStep">
          <div class="flex flex-col gap-1.5">
            <Label for="storeName" class="text-xs font-medium">매장명 <span class="text-destructive">*</span></Label>
            <Input
              id="storeName"
              v-model="form.storeName"
              type="text"
              placeholder="예: 플레이온 강남점"
              class="h-11"
              required
            />
          </div>
          <div class="flex gap-4 max-[480px]:flex-col">
            <div class="flex flex-1 flex-col gap-1.5">
              <Label for="ownerName" class="text-xs font-medium">대표자명 <span class="text-destructive">*</span></Label>
              <Input
                id="ownerName"
                v-model="form.ownerName"
                type="text"
                placeholder="홍길동"
                class="h-11"
                required
              />
            </div>
            <div class="flex flex-1 flex-col gap-1.5">
              <Label for="phone" class="text-xs font-medium">연락처 <span class="text-destructive">*</span></Label>
              <Input
                id="phone"
                v-model="form.phone"
                type="tel"
                placeholder="010-1234-5678"
                class="h-11"
                required
              />
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <Label for="email" class="text-xs font-medium">이메일 (로그인용) <span class="text-destructive">*</span></Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="owner@example.com"
              class="h-11"
              autocomplete="email"
              required
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <Label for="password" class="text-xs font-medium">비밀번호 <span class="text-destructive">*</span></Label>
            <Input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="8자 이상"
              class="h-11"
              minlength="8"
              autocomplete="new-password"
              required
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <Label for="passwordConfirm" class="text-xs font-medium">비밀번호 확인 <span class="text-destructive">*</span></Label>
            <Input
              id="passwordConfirm"
              v-model="form.passwordConfirm"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요"
              class="h-11"
              minlength="8"
              autocomplete="new-password"
              required
            />
            <p v-if="form.passwordConfirm && form.password !== form.passwordConfirm" class="text-xs text-destructive">비밀번호가 일치하지 않습니다.</p>
          </div>
          <Button type="submit" size="lg" class="w-full h-12 mt-2 text-base font-semibold" :disabled="!isStep0Valid">
            다음 단계
          </Button>
        </form>

        <!-- Step 1: 티어 선택 -->
        <div v-else-if="step === 1" class="flex flex-col gap-5">
          <div class="flex flex-col gap-3">
            <div
              v-for="t in tiers"
              :key="t.id"
              :style="{
                border: form.tier === t.id ? '1px solid hsl(213, 98%, 55%)' : '1px solid #e0e0e0',
                backgroundColor: form.tier === t.id ? 'hsl(213, 98%, 55%, 0.05)' : 'transparent',
              }"
              class="w-full cursor-pointer rounded-xl p-5 text-left transition-all"
              @click="form.tier = t.id"
            >
              <div class="mb-1 flex items-center justify-between">
                <strong class="text-base font-bold text-foreground">{{ t.name }}</strong>
                <div class="flex items-center gap-2">
                  <span v-if="isAnnual" class="text-xs text-muted-foreground line-through">{{ t.monthlyLabel }}</span>
                  <Badge variant="secondary" class="font-semibold text-primary">{{ t.displayPrice }}</Badge>
                </div>
              </div>
              <p class="text-sm text-muted-foreground">{{ t.desc }}</p>
            </div>
          </div>
          <div class="flex gap-3 mt-2">
            <Button type="button" variant="outline" class="h-12 border-border bg-muted hover:bg-muted/70" @click="step = 0">이전</Button>
            <Button
              type="button"
              size="lg"
              class="flex-1 h-12 text-base font-semibold"
              :disabled="isSubmitting"
              @click="handleSignup"
            >
              {{ isSubmitting ? '처리 중...' : '14일 무료 이용 시작' }}
            </Button>
          </div>
          <ul class="text-left text-sm leading-relaxed text-muted-foreground list-disc pl-4 space-y-1">
            <li>14일 동안 선택한 플랜의 모든 기능을 무료로 이용할 수 있습니다.</li>
            <li>계속 이용을 희망하시는 경우, 무통장입금으로 이용료 결제가 가능합니다.</li>
            <li>플랜은 언제든 취소하거나 변경할 수 있습니다.</li>
          </ul>
          <Alert v-if="errorMessage" variant="destructive">
            <AlertDescription>{{ errorMessage }}</AlertDescription>
          </Alert>
        </div>

        <!-- 하단 로그인 링크 -->
        <p class="text-center text-sm text-muted-foreground mt-8">
          이미 계정이 있으신가요?
          <a href="https://www.pleyon.co.kr/login" class="text-primary font-medium hover:underline">로그인</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { Badge } from '~/components/ui/badge'

definePageMeta({ layout: false })

useHead({ title: '회원가입 - 플레이온' })

const supabase = useSupabase()
const router = useRouter()
const route = useRoute()

const step = ref(0)
const steps = ['매장 정보', '플랜 선택']
const isSubmitting = ref(false)
const errorMessage = ref('')

const isAnnual = computed(() => route.query.billing === 'annual')

const form = reactive({
  storeName: '',
  ownerName: '',
  phone: '',
  address: '',
  addressDetail: '',
  zonecode: '',
  email: '',
  password: '',
  passwordConfirm: '',
  tier: (route.query.tier as string) || 'basic',
})

// 카카오 주소검색
declare global {
  interface Window {
    daum: { Postcode: new (opts: Record<string, unknown>) => { open: () => void } }
  }
}

const postcodeScriptLoaded = ref(false)

function loadPostcodeScript(): Promise<void> {
  if (postcodeScriptLoaded.value) return Promise.resolve()
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.onload = () => {
      postcodeScriptLoaded.value = true
      resolve()
    }
    document.head.appendChild(script)
  })
}

async function openAddressSearch() {
  await loadPostcodeScript()
  new window.daum.Postcode({
    oncomplete(data: { address: string; zonecode: string; buildingName: string }) {
      form.address = data.address
      form.zonecode = data.zonecode
      if (data.buildingName) {
        form.addressDetail = data.buildingName
      }
    },
  }).open()
}

const formatKRW = (n: number) =>
  '월 ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원'

const baseTiers = [
  { id: 'basic', name: '베이직', monthly: 33000, desc: '시간요금제 중심의 기본 매장 운영' },
  { id: 'standard', name: '스탠다드', monthly: 55000, desc: '대여/포인트 요금제까지 활용하는 성장 매장' },
  { id: 'pro', name: '프로', monthly: 99000, desc: '전 기능 사용 — 프론트, 터미널, 블로그까지' },
]

const tiers = computed(() =>
  baseTiers.map(t => {
    const discounted = isAnnual.value
      ? Math.round(t.monthly * 0.9 / 100) * 100
      : t.monthly
    return {
      ...t,
      displayPrice: formatKRW(discounted),
      monthlyLabel: formatKRW(t.monthly),
    }
  })
)

const selectedTier = computed(() => {
  const found = tiers.value.find(t => t.id === form.tier)
  return found || tiers.value[0]
})

const benefits = [
  {
    icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8',
    title: '10초면 세팅 완료',
    desc: '복잡한 설치 없이 가입 즉시 매장 운영을 시작할 수 있습니다.',
  },
  {
    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    title: '안전한 데이터 관리',
    desc: 'AWS 기반 인프라로 매장 데이터를 안전하게 보호합니다.',
  },
  {
    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    title: '전국 레고카페 점주님들이 선택',
    desc: '검증된 솔루션으로 매장 운영 효율을 높이세요.',
  },
  {
    icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    title: '실시간 1:1 지원',
    desc: '운영 중 궁금한 점은 실시간 채팅으로 바로 해결됩니다.',
  },
]

const isStep0Valid = computed(() => {
  const phoneClean = form.phone.replace(/[^0-9]/g, '')
  return (
    form.storeName.trim().length > 0 &&
    form.ownerName.trim().length > 0 &&
    /^01[016789]\d{7,8}$/.test(phoneClean) &&
    form.email.includes('@') &&
    form.password.length >= 8 &&
    form.password === form.passwordConfirm
  )
})

function formatPhone(value: string) {
  const digits = value.replace(/[^0-9]/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

watch(() => form.phone, (val) => {
  const formatted = formatPhone(val)
  if (val !== formatted) form.phone = formatted
})

function nextStep() {
  if (isStep0Valid.value) step.value = 1
}

async function handleSignup() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    let userId = ''
    let sessionToken: string | undefined

    // 1. Supabase Auth 회원가입
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          store_name: form.storeName,
          owner_name: form.ownerName,
          phone: form.phone.replace(/[^0-9]/g, ''),
          address: form.address,
          address_detail: form.addressDetail,
          zonecode: form.zonecode,
        },
      },
    })

    if (authError) {
      if (authError.message === 'User already registered') {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        })
        if (signInError) throw new Error('이미 가입된 이메일입니다. 비밀번호를 확인해주세요.')
        if (!signInData.user) throw new Error('로그인에 실패했습니다.')

        const { data: profile } = await supabase
          .from('profiles')
          .select('store_id')
          .eq('id', signInData.user.id)
          .single()

        if (profile?.store_id) {
          const { data: store } = await supabase
            .from('stores')
            .select('subscription_status')
            .eq('id', profile.store_id)
            .single()

          if (store?.subscription_status === 'active' || store?.subscription_status === 'trialing') {
            throw new Error('이미 가입된 계정입니다. 플레이온(www.pleyon.co.kr)에서 로그인해주세요.')
          }
        }

        userId = signInData.user.id
        sessionToken = signInData.session?.access_token
      } else {
        throw new Error(authError.message)
      }
    } else {
      if (!authData.user) throw new Error('회원가입에 실패했습니다.')
      userId = authData.user.id
      sessionToken = authData.session?.access_token
    }

    // 2. 서버에서 매장 생성 + 결제 준비
    const checkoutRes = await $fetch('/api/payment/checkout', {
      method: 'POST',
      body: {
        userId,
        storeName: form.storeName,
        ownerName: form.ownerName,
        phone: form.phone.replace(/[^0-9]/g, ''),
        address: form.address,
        addressDetail: form.addressDetail,
        zonecode: form.zonecode,
        email: form.email,
        tier: form.tier,
        billingCycle: isAnnual.value ? 'annual' : 'monthly',
      },
    })

    // 3. 7일 체험 시작
    const accessToken = sessionToken || (await supabase.auth.getSession()).data.session?.access_token
    if (!accessToken) {
      throw new Error('인증 세션이 없습니다. 잠시 후 다시 시도해주세요.')
    }
    const completeRes = await $fetch<{ success: boolean; trialEndsAt: string }>('/api/payment/complete', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: {
        storeId: checkoutRes.storeId,
        tier: form.tier,
      },
    })

    // 4. 완료 페이지로 이동
    router.push(`/payment/complete?status=success&tier=${form.tier}&trialEndsAt=${completeRes.trialEndsAt || ''}`)
  } catch (err: unknown) {
    const error = err as { data?: { message?: string }; message?: string }
    errorMessage.value = error?.data?.message || error?.message || '가입에 실패했습니다. 잠시 후 다시 시도해주세요.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
