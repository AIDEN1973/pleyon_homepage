<template>
  <div>
    <!-- 로그인 시 헤더 표시 -->
    <AppHeader v-if="!isLoading && user" />

    <!-- 로딩 -->
    <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
      <div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>

    <!-- 비로그인 -->
    <div v-else-if="!user" class="min-h-screen flex flex-col lg:flex-row">
      <div class="relative lg:w-[480px] xl:w-[520px] shrink-0 bg-[#0F1B2D] text-white overflow-hidden">
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full border border-white/10" />
          <div class="absolute -bottom-16 -left-16 w-[250px] h-[250px] rounded-full border border-white/[0.07]" />
          <div class="absolute inset-0" style="background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 24px 24px;" />
        </div>
        <div class="relative z-10 flex flex-col justify-center h-full px-8 lg:px-12 py-16 lg:py-24">
          <NuxtLink to="/" class="inline-flex items-center gap-2.5 mb-12 group">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="10" fill="#1A7CFD"/><path d="M10 10h12v4H14v8h-4V10z" fill="#fff"/></svg>
            <span class="text-xl font-bold tracking-tight text-[#1A7CFD]">플레이온 홈</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-white/30 group-hover:text-white/60 transition-colors"><path d="M7 17l9.2-5L7 7v10z" fill="currentColor"/></svg>
          </NuxtLink>
          <h1 class="font-display text-3xl font-bold mb-3">마이페이지</h1>
          <p class="text-sm text-white/50 mb-10">구독 현황 확인 및 계정 관리</p>
          <div class="space-y-5">
            <div class="flex gap-4">
              <div class="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="hsl(213,98%,65%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
              <div><p class="text-sm font-semibold text-white/90">안전한 계정 관리</p><p class="text-xs text-white/45 mt-0.5">비밀번호 변경, 구독 관리를 한 곳에서.</p></div>
            </div>
            <div class="flex gap-4">
              <div class="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="hsl(213,98%,65%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
              <div><p class="text-sm font-semibold text-white/90">실시간 1:1 지원</p><p class="text-xs text-white/45 mt-0.5">궁금한 점은 채팅으로 바로 해결됩니다.</p></div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 flex items-center justify-center bg-background px-5 py-16 lg:py-24">
        <div class="w-full max-w-[480px]">
          <div class="lg:hidden mb-8">
            <NuxtLink to="/" class="inline-flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="10" fill="#1A7CFD"/><path d="M10 10h12v4H14v8h-4V10z" fill="#fff"/></svg>
              <span class="text-xl font-bold text-[#1A7CFD]">플레이온 홈</span>
            </NuxtLink>
          </div>
          <div v-if="loginView === 'login'">
            <h2 class="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">로그인</h2>
            <p class="text-sm text-muted-foreground mb-8">플레이온 계정으로 로그인하세요.</p>
            <form class="flex flex-col gap-5" @submit.prevent="handleLogin">
              <div class="flex flex-col gap-1.5"><Label class="text-xs font-medium">이메일 <span class="text-destructive">*</span></Label><Input v-model="loginEmail" type="email" placeholder="owner@example.com" class="h-11" autocomplete="username" required /></div>
              <div class="flex flex-col gap-1.5"><Label class="text-xs font-medium">비밀번호 <span class="text-destructive">*</span></Label><Input v-model="loginPassword" type="password" placeholder="비밀번호 입력" class="h-11" autocomplete="current-password" required /></div>
              <Alert v-if="loginError" variant="destructive"><p class="text-sm">{{ loginError }}</p></Alert>
              <Button type="submit" size="lg" class="w-full h-12 text-base font-semibold" :disabled="isLoggingIn">{{ isLoggingIn ? '로그인 중...' : '로그인' }}</Button>
            </form>
            <div class="flex justify-center gap-4 mt-6 text-sm">
              <button class="text-muted-foreground hover:text-primary transition-colors" @click="loginView = 'findId'">아이디 찾기</button>
              <span class="text-border">|</span>
              <button class="text-muted-foreground hover:text-primary transition-colors" @click="loginView = 'resetPw'">비밀번호 찾기</button>
            </div>
          </div>
          <div v-else-if="loginView === 'findId'">
            <h2 class="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">아이디 찾기</h2>
            <p class="text-sm text-muted-foreground mb-8">가입 시 등록한 전화번호를 입력해주세요.</p>
            <form class="flex flex-col gap-5" @submit.prevent="handleFindId">
              <div class="flex flex-col gap-1.5"><Label class="text-xs font-medium">전화번호 <span class="text-destructive">*</span></Label><Input v-model="findPhone" type="tel" placeholder="01012345678" class="h-11" required /></div>
              <Alert v-if="findIdResult" :variant="findIdError ? 'destructive' : 'default'"><p class="text-sm">{{ findIdResult }}</p></Alert>
              <Button type="submit" size="lg" class="w-full h-12 text-base font-semibold" :disabled="isFinding">{{ isFinding ? '조회 중...' : '아이디 찾기' }}</Button>
            </form>
            <button class="w-full text-sm text-muted-foreground hover:text-primary mt-6 text-center" @click="loginView = 'login'">← 로그인으로 돌아가기</button>
          </div>
          <div v-else-if="loginView === 'resetPw'">
            <h2 class="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">비밀번호 찾기</h2>
            <p class="text-sm text-muted-foreground mb-8">가입한 이메일로 재설정 링크를 보내드립니다.</p>
            <form class="flex flex-col gap-5" @submit.prevent="handleResetPassword">
              <div class="flex flex-col gap-1.5"><Label class="text-xs font-medium">이메일 <span class="text-destructive">*</span></Label><Input v-model="resetEmail" type="email" placeholder="owner@example.com" class="h-11" autocomplete="email" required /></div>
              <Alert v-if="resetResult" :variant="resetError ? 'destructive' : 'default'"><p class="text-sm">{{ resetResult }}</p></Alert>
              <Button type="submit" size="lg" class="w-full h-12 text-base font-semibold" :disabled="isResetting">{{ isResetting ? '발송 중...' : '재설정 링크 발송' }}</Button>
            </form>
            <button class="w-full text-sm text-muted-foreground hover:text-primary mt-6 text-center" @click="loginView = 'login'">← 로그인으로 돌아가기</button>
          </div>
          <p class="text-center text-sm text-muted-foreground mt-8">아직 계정이 없으신가요? <NuxtLink to="/signup" class="text-primary font-medium hover:underline">무료이용 시작하기</NuxtLink></p>
        </div>
      </div>
    </div>

    <!-- 에러 -->
    <div v-else-if="loadError" class="min-h-[60vh] flex items-center justify-center px-6">
      <div class="text-center max-w-[400px]">
        <div class="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-5"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="hsl(0,84%,60%)"/></svg></div>
        <p class="text-xl font-bold text-foreground mb-2">오류가 발생했습니다</p>
        <p class="text-sm text-muted-foreground mb-6">{{ loadError }}</p>
        <Button variant="outline" @click="loadData">다시 시도</Button>
      </div>
    </div>

    <!-- 매장 없음 -->
    <div v-else-if="!store" class="min-h-[60vh] flex items-center justify-center px-6">
      <div class="text-center max-w-[400px]">
        <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" fill="hsl(213,98%,55%)"/></svg></div>
        <p class="text-xl font-bold text-foreground mb-2">연결된 매장이 없습니다</p>
        <p class="text-sm text-muted-foreground mb-6">매장을 등록하고 플레이온을 시작하세요.</p>
        <NuxtLink to="/signup"><Button size="lg" class="h-12 text-base font-semibold">매장 등록하기</Button></NuxtLink>
      </div>
    </div>

    <!-- ━━━ 대시보드 ━━━ -->
    <div v-else class="min-h-[calc(100vh-var(--header-height))] flex flex-col lg:flex-row pt-[var(--header-height)]">
      <!-- 좌측 다크 사이드바 -->
      <div class="relative lg:w-[320px] xl:w-[340px] shrink-0 bg-[#0F1B2D] text-white overflow-hidden lg:sticky lg:top-[var(--header-height)] lg:h-[calc(100vh-var(--header-height))]">
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute -top-16 -right-16 w-[200px] h-[200px] rounded-full border border-white/[0.06]" />
          <div class="absolute -bottom-10 -left-10 w-[180px] h-[180px] rounded-full border border-white/[0.05]" />
          <div class="absolute inset-0" style="background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 20px 20px;" />
        </div>
        <div class="relative z-10 flex flex-col h-full px-7 py-8">
          <!-- 프로필 -->
          <div class="flex items-center gap-3.5 mb-8">
            <div class="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-white font-bold text-base shrink-0">
              {{ store.name?.charAt(0) || 'P' }}
            </div>
            <div class="min-w-0">
              <h3 class="text-base font-bold text-white truncate">{{ store.name }}</h3>
              <p class="text-[11px] text-white/35 truncate mt-0.5">{{ store.email }}</p>
            </div>
          </div>

          <!-- 스탯 미니 카드 -->
          <div class="grid grid-cols-2 gap-2 mb-8">
            <div class="rounded-xl bg-white/[0.06] p-3">
              <p class="text-[10px] text-white/30 uppercase tracking-wider mb-1">플랜</p>
              <p class="text-sm font-bold text-white">{{ tierLabel(store.tier) }}</p>
              <p class="text-[10px] text-white/25 mt-0.5">{{ billingCycleLabel() }} 결제</p>
            </div>
            <div class="rounded-xl bg-white/[0.06] p-3">
              <p class="text-[10px] text-white/30 uppercase tracking-wider mb-1">상태</p>
              <p class="text-sm font-bold text-white">{{ statusLabel(store.subscription_status) }}</p>
            </div>
          </div>

          <!-- 메뉴 -->
          <nav class="flex flex-col gap-1 flex-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="cn(
                'flex items-center gap-3 w-full text-left py-2.5 px-3.5 rounded-xl text-[13px] font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:bg-white/[0.05] hover:text-white/70'
              )"
              @click="activeTab = tab.id"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path :d="tab.icon" :stroke="activeTab === tab.id ? 'hsl(213,98%,65%)' : 'currentColor'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              {{ tab.label }}
            </button>
          </nav>

          <!-- 하단 로그아웃 -->
          <div class="border-t border-white/[0.08] pt-4 mt-4">
            <button class="flex items-center gap-3 w-full text-left py-2.5 px-3.5 rounded-xl text-[13px] font-medium text-white/30 hover:bg-white/[0.05] hover:text-white/60 transition-all" @click="handleLogout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              로그아웃
            </button>
          </div>
        </div>
      </div>

      <!-- 우측 콘텐츠 -->
      <div class="flex-1 bg-[#f7f8fa] px-6 lg:px-10 py-8 lg:py-10 overflow-y-auto">
        <div class="max-w-content mx-auto">
          <!-- 플랜 관리 -->
          <template v-if="activeTab === 'manage'">
            <div class="mb-8">
              <h2 class="text-xl font-bold text-[#0F1B2D] mb-1">플랜 관리</h2>
              <p class="text-sm text-[#0F1B2D]/40">현재 구독 중인 플랜 정보와 요금을 확인하세요.</p>
            </div>

            <!-- 결제 주기 전환 -->
            <div class="bg-white rounded-2xl shadow-sm p-5 md:p-6 mb-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p class="text-sm font-semibold text-[#0F1B2D]">결제 주기</p>
                <p class="text-xs text-[#0F1B2D]/35 mt-0.5">연간 결제 시 10% 할인이 적용됩니다.</p>
              </div>
              <div class="flex items-center gap-3 bg-[#f8f9fb] rounded-full p-1">
                <button
                  :class="cn(
                    'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
                    !isAnnualBilling ? 'bg-[#0F1B2D] text-white shadow-sm' : 'text-[#0F1B2D]/40 hover:text-[#0F1B2D]/60'
                  )"
                  :disabled="isCycleChanging"
                  @click="requestCycleChange('monthly')"
                >월간</button>
                <button
                  :class="cn(
                    'px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5',
                    isAnnualBilling ? 'bg-[#0F1B2D] text-white shadow-sm' : 'text-[#0F1B2D]/40 hover:text-[#0F1B2D]/60'
                  )"
                  :disabled="isCycleChanging"
                  @click="requestCycleChange('annual')"
                >연간 <span v-if="!isAnnualBilling" class="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">10%↓</span></button>
              </div>
            </div>

            <!-- 메인 플랜 카드 -->
            <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
              <div class="bg-gradient-to-r from-[#1A7CFD] to-[#4da3ff] p-6 md:p-8">
                <div class="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p class="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">현재 플랜</p>
                    <p class="text-3xl font-bold text-white">{{ tierLabel(store.tier) }}</p>
                    <p class="text-lg text-white/60 mt-1">{{ tierAmount(store.tier) }} <span class="text-sm text-white/30">/ {{ isAnnualBilling ? '년' : '월' }}</span></p>
                  </div>
                  <div class="flex gap-2">
                    <button class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white text-[#0F1B2D] hover:bg-white/90 transition-colors shadow-sm" @click="showPlanChange = true">플랜 변경</button>
                    <button v-if="store.hasBillingKey" class="px-5 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors" @click="handleCancelSubscription">해지</button>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 divide-x divide-[#f0f1f3]">
                <div class="p-5 md:p-6">
                  <div class="flex items-center gap-2.5 mb-2">
                    <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="hsl(213,98%,55%)" stroke-width="2" fill="none"/><path d="M16 2v4M8 2v4M3 10h18" stroke="hsl(213,98%,55%)" stroke-width="2" stroke-linecap="round"/></svg>
                    </div>
                    <p class="text-xs text-[#0F1B2D]/40 font-medium">{{ store.subscription_status === 'trialing' ? '무료이용 종료일' : '다음 결제일' }}</p>
                  </div>
                  <p class="text-lg font-bold text-[#0F1B2D] pl-[42px]">{{ store.subscription_due_date || '-' }}</p>
                </div>
                <div class="p-5 md:p-6">
                  <div class="flex items-center gap-2.5 mb-2">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="store.subscription_status === 'active' || store.subscription_status === 'trialing' ? 'bg-[#e8f5e9]' : 'bg-[#fff3e0]'">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" :stroke="store.subscription_status === 'active' || store.subscription_status === 'trialing' ? '#2e7d32' : '#e65100'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 4L12 14.01l-3-3" :stroke="store.subscription_status === 'active' || store.subscription_status === 'trialing' ? '#2e7d32' : '#e65100'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                    <p class="text-xs text-[#0F1B2D]/40 font-medium">구독 상태</p>
                  </div>
                  <p class="text-lg font-bold pl-[42px]" :class="statusValueColor(store.subscription_status)">{{ statusLabel(store.subscription_status) }}</p>
                </div>
              </div>
            </div>
          </template>

          <!-- 결제 안내 -->
          <template v-else-if="activeTab === 'payment'">
            <div class="mb-8">
              <h2 class="text-xl font-bold text-[#0F1B2D] mb-1">결제 안내</h2>
              <p class="text-sm text-[#0F1B2D]/40">결제 현황과 입금 정보를 확인하세요.</p>
            </div>

            <!-- 연체 알림 -->
            <div v-if="store.subscription_status === 'past_due' || store.subscription_status === 'restricted'" class="bg-[#fff3e0] rounded-2xl p-5 md:p-6 mb-4 flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-[#e65100]/10 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" stroke="#e65100" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <div>
                <p class="text-sm font-bold text-[#e65100]">미납 요금이 있습니다</p>
                <p class="text-xs text-[#e65100]/70 mt-1 leading-relaxed">구독료가 미납 상태입니다. 아래 계좌로 입금해 주세요. 미납이 지속되면 서비스 이용이 제한될 수 있습니다.</p>
              </div>
            </div>

            <!-- 다음 결제 예정 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div class="bg-white rounded-2xl shadow-sm p-5 md:p-6">
                <div class="flex items-center gap-2.5 mb-3">
                  <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="hsl(213,98%,55%)" stroke-width="2" fill="none"/><path d="M16 2v4M8 2v4M3 10h18" stroke="hsl(213,98%,55%)" stroke-width="2" stroke-linecap="round"/></svg>
                  </div>
                  <p class="text-xs text-[#0F1B2D]/40 font-medium">{{ store.subscription_status === 'trialing' ? '무료이용 종료일' : '다음 결제일' }}</p>
                </div>
                <p class="text-2xl font-bold text-[#0F1B2D] pl-[42px]">{{ store.subscription_due_date || '-' }}</p>
                <p v-if="store.subscription_status === 'trialing'" class="text-xs text-primary/60 pl-[42px] mt-1">무료이용 종료 전에 입금하시면 중단 없이 이용 가능합니다.</p>
              </div>
              <div class="bg-white rounded-2xl shadow-sm p-5 md:p-6">
                <div class="flex items-center gap-2.5 mb-3">
                  <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="hsl(213,98%,55%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </div>
                  <p class="text-xs text-[#0F1B2D]/40 font-medium">결제 예정 금액</p>
                </div>
                <p class="text-2xl font-bold text-primary pl-[42px]">{{ tierAmount(store.tier) }}</p>
                <p class="text-xs text-[#0F1B2D]/30 pl-[42px] mt-1">{{ tierLabel(store.tier) }} 플랜 · {{ billingCycleLabel() }} 정기결제</p>
              </div>
            </div>

            <!-- 입금 계좌 정보 -->
            <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div class="px-6 md:px-8 pt-6 md:pt-8 flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#0F1B2D] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M2 10h20M22 6H2v12h20V6z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div>
                  <p class="text-sm font-bold text-[#0F1B2D]">입금 계좌 정보</p>
                  <p class="text-xs text-[#0F1B2D]/35">무통장입금 · 입금 확인 후 구독이 활성화됩니다.</p>
                </div>
              </div>
              <div class="p-6 md:p-8">
                <div class="rounded-xl overflow-hidden" style="border: 1px solid #eef0f2;">
                  <div class="flex justify-between items-center px-5 py-4" style="border-bottom: 1px solid #eef0f2;">
                    <span class="text-sm text-[#0F1B2D]/40">입금 은행</span>
                    <span class="text-sm font-bold text-[#0F1B2D]">카카오뱅크</span>
                  </div>
                  <div class="flex justify-between items-center px-5 py-4 bg-[#f8f9fb]" style="border-bottom: 1px solid #eef0f2;">
                    <span class="text-sm text-[#0F1B2D]/40">계좌번호</span>
                    <span class="text-sm font-bold text-[#0F1B2D]">3333-14-1078266</span>
                  </div>
                  <div class="flex justify-between items-center px-5 py-4" style="border-bottom: 1px solid #eef0f2;">
                    <span class="text-sm text-[#0F1B2D]/40">예금주</span>
                    <span class="text-sm font-bold text-[#0F1B2D]">박소영 (러츠)</span>
                  </div>
                  <div class="flex justify-between items-center px-5 py-4 bg-[#f8f9fb]">
                    <span class="text-sm text-[#0F1B2D]/40">입금자명</span>
                    <span class="text-sm font-bold text-[#0F1B2D]">{{ store.ownerName || '-' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- 개인정보 -->
          <template v-else-if="activeTab === 'profile'">
            <div class="mb-8">
              <h2 class="text-xl font-bold text-[#0F1B2D] mb-1">개인정보</h2>
              <p class="text-sm text-[#0F1B2D]/40">매장 및 계정 정보를 확인하세요.</p>
            </div>

            <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
              <div class="grid grid-cols-1 sm:grid-cols-2">
                <div class="p-5 md:p-6" style="border-bottom: 1px solid #f0f1f3; border-right: 1px solid #f0f1f3;">
                  <div class="flex items-center gap-2.5 mb-3">
                    <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" fill="hsl(213,98%,55%)"/></svg>
                    </div>
                    <p class="text-xs text-[#0F1B2D]/35 font-medium">매장명</p>
                  </div>
                  <p class="text-base font-bold text-[#0F1B2D] pl-[42px]">{{ store.name || '-' }}</p>
                </div>
                <div class="p-5 md:p-6" style="border-bottom: 1px solid #f0f1f3;">
                  <div class="flex items-center gap-2.5 mb-3">
                    <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="hsl(213,98%,55%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
                    </div>
                    <p class="text-xs text-[#0F1B2D]/35 font-medium">대표자명</p>
                  </div>
                  <p class="text-base font-bold text-[#0F1B2D] pl-[42px]">{{ store.ownerName || '-' }}</p>
                </div>
                <div class="p-5 md:p-6" style="border-right: 1px solid #f0f1f3;">
                  <div class="flex items-center gap-2.5 mb-3">
                    <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="hsl(213,98%,55%)"/></svg>
                    </div>
                    <p class="text-xs text-[#0F1B2D]/35 font-medium">이메일</p>
                  </div>
                  <p class="text-base font-bold text-[#0F1B2D] pl-[42px]">{{ store.email || '-' }}</p>
                </div>
                <div class="p-5 md:p-6">
                  <div class="flex items-center gap-2.5 mb-3">
                    <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="hsl(213,98%,55%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
                    </div>
                    <p class="text-xs text-[#0F1B2D]/35 font-medium">연락처</p>
                  </div>
                  <p class="text-base font-bold text-[#0F1B2D] pl-[42px]">{{ formatPhone(store.ownerPhone) || '-' }}</p>
                </div>
              </div>
            </div>

            <!-- 계정 관리 -->
            <div class="bg-white rounded-2xl shadow-sm p-6 md:p-8 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p class="text-sm font-semibold text-[#0F1B2D]">계정 관리</p>
                <p class="text-xs text-[#0F1B2D]/35 mt-0.5">비밀번호 변경 또는 회원 탈퇴</p>
              </div>
              <div class="flex gap-2">
                <button class="px-4 py-2 rounded-lg text-sm font-semibold bg-[#0F1B2D] text-white hover:bg-[#0F1B2D]/90 transition-colors" @click="showChangePassword = true">비밀번호 변경</button>
                <button class="px-4 py-2 rounded-lg text-sm font-medium text-[#0F1B2D]/20 hover:text-destructive hover:bg-destructive/5 transition-colors" @click="showWithdraw = true">회원 탈퇴</button>
              </div>
            </div>
          </template>

          <!-- 결제 이력 -->
          <template v-else-if="activeTab === 'history'">
            <div class="mb-8">
              <h2 class="text-xl font-bold text-[#0F1B2D] mb-1">결제 이력</h2>
              <p class="text-sm text-[#0F1B2D]/40">지금까지의 결제 내역을 확인하세요.</p>
            </div>

            <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div v-if="payments.length === 0" class="flex flex-col items-center justify-center py-20">
                <div class="w-14 h-14 rounded-2xl bg-[#f0f1f3] flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 8v4l3 3M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <p class="text-sm text-[#0F1B2D]/30">결제 이력이 없습니다.</p>
              </div>
              <div v-else class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-[#f8f9fb]">
                      <th class="text-left px-6 py-3.5 text-[11px] font-semibold text-[#0F1B2D]/35 uppercase tracking-wider">결제일</th>
                      <th class="text-left px-6 py-3.5 text-[11px] font-semibold text-[#0F1B2D]/35 uppercase tracking-wider">플랜</th>
                      <th class="text-left px-6 py-3.5 text-[11px] font-semibold text-[#0F1B2D]/35 uppercase tracking-wider">금액</th>
                      <th class="text-left px-6 py-3.5 text-[11px] font-semibold text-[#0F1B2D]/35 uppercase tracking-wider">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(p, i) in payments" :key="p.id" :class="i % 2 === 1 ? 'bg-[#fafbfc]' : ''" class="hover:bg-primary/[0.02] transition-colors" style="border-bottom: 1px solid #f0f1f3;">
                      <td class="px-6 py-4 text-[#0F1B2D]/50">{{ p.payment_date || '-' }}</td>
                      <td class="px-6 py-4 text-[#0F1B2D]/50">{{ tierLabel(p.tier) }}</td>
                      <td class="px-6 py-4 font-bold text-[#0F1B2D] font-mono">{{ p.amount.toLocaleString() }}원</td>
                      <td class="px-6 py-4">
                        <span :class="cn('text-[11px] font-semibold px-2.5 py-1 rounded-full', p.payment_status === 'paid' ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#fff3e0] text-[#e65100]')">{{ paymentStatusLabel(p.payment_status) }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 모달: 비밀번호 변경 -->
    <Dialog :open="showChangePassword" @update:open="showChangePassword = $event">
      <DialogContent class="sm:max-w-[420px]">
        <DialogHeader><DialogTitle class="text-xl">비밀번호 변경</DialogTitle></DialogHeader>
        <form class="flex flex-col gap-5" @submit.prevent="handleChangePassword">
          <input type="text" :value="store?.email" autocomplete="username" class="sr-only" tabindex="-1" aria-hidden="true" />
          <div class="flex flex-col gap-1.5"><Label class="text-xs font-medium">새 비밀번호 <span class="text-destructive">*</span></Label><Input v-model="newPassword" type="password" placeholder="8자 이상" class="h-11" minlength="8" autocomplete="new-password" required /></div>
          <div class="flex flex-col gap-1.5"><Label class="text-xs font-medium">새 비밀번호 확인 <span class="text-destructive">*</span></Label><Input v-model="confirmPassword" type="password" placeholder="비밀번호 재입력" class="h-11" minlength="8" autocomplete="new-password" required /></div>
          <Alert v-if="passwordError" variant="destructive"><p class="text-sm">{{ passwordError }}</p></Alert>
          <div v-if="passwordSuccess" class="text-sm text-center p-2 bg-muted text-foreground rounded-lg">{{ passwordSuccess }}</div>
          <Button type="submit" size="lg" class="w-full h-12 text-base font-semibold" :disabled="isChangingPassword">{{ isChangingPassword ? '변경 중...' : '비밀번호 변경' }}</Button>
        </form>
      </DialogContent>
    </Dialog>

    <!-- 모달: 회원 탈퇴 -->
    <Dialog :open="showWithdraw" @update:open="showWithdraw = $event">
      <DialogContent class="sm:max-w-[420px] text-center">
        <div class="flex flex-col items-center gap-4">
          <div class="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="hsl(0,84%,60%)"/></svg></div>
          <DialogHeader class="text-center"><DialogTitle class="text-xl text-center">정말 탈퇴하시겠습니까?</DialogTitle></DialogHeader>
          <ul class="text-left bg-destructive/5 border border-destructive/10 rounded-xl p-5 pl-10 w-full flex flex-col gap-2 text-sm text-muted-foreground list-disc">
            <li>매장 정보와 구독이 모두 삭제됩니다.</li>
            <li>결제 이력 및 회원 데이터는 복구할 수 없습니다.</li>
            <li>진행 중인 구독이 있는 경우 즉시 해지됩니다.</li>
          </ul>
          <Alert v-if="withdrawError" variant="destructive" class="w-full"><p class="text-sm">{{ withdrawError }}</p></Alert>
          <div class="flex gap-3 w-full">
            <Button variant="outline" size="lg" class="flex-1 h-12" @click="showWithdraw = false">취소</Button>
            <Button variant="destructive" size="lg" class="flex-1 h-12" :disabled="isWithdrawing" @click="handleWithdraw">{{ isWithdrawing ? '처리 중...' : '탈퇴하기' }}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <!-- 모달: 결제 주기 변경 -->
    <Dialog :open="showCycleConfirm" @update:open="showCycleConfirm = $event">
      <DialogContent class="sm:max-w-[400px]">
        <div class="flex flex-col items-center gap-4 text-center">
          <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M23 4v6h-6M1 20v-6h6" stroke="hsl(213,98%,55%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke="hsl(213,98%,55%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <DialogHeader class="text-center">
            <DialogTitle class="text-lg text-center">결제 주기 변경</DialogTitle>
          </DialogHeader>
          <p class="text-sm text-[#0F1B2D]/50 leading-relaxed">
            결제 주기를 <strong class="text-[#0F1B2D]">{{ pendingCycle === 'annual' ? '연간' : '월간' }}</strong>으로 변경하시겠습니까?<br />
            <span v-if="pendingCycle === 'annual'" class="text-primary">연간 결제 시 10% 할인이 적용됩니다.</span>
            <span v-else>다음 결제일부터 월간 요금이 적용됩니다.</span>
          </p>
          <div class="flex gap-3 w-full mt-2">
            <Button variant="outline" size="lg" class="flex-1 h-12" @click="showCycleConfirm = false">취소</Button>
            <Button size="lg" class="flex-1 h-12 text-base font-semibold" :disabled="isCycleChanging" @click="confirmCycleChange">
              {{ isCycleChanging ? '변경 중...' : '변경하기' }}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <!-- 모달: 플랜 변경 -->
    <Dialog :open="showPlanChange" @update:open="val => { if (!val) closePlanChange() }">
      <DialogContent class="sm:max-w-[480px]">
        <DialogHeader><DialogTitle class="text-xl">플랜 변경</DialogTitle></DialogHeader>
        <template v-if="planChangeResult">
          <div class="text-center">
            <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="hsl(213,98%,55%)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <p class="text-base text-foreground font-medium leading-relaxed">{{ planChangeResult }}</p>
            <div v-if="planChangeDiffAmount > 0" class="mt-4 grid grid-cols-2 gap-3 text-left">
              <div class="rounded-xl bg-[#f8f9fb] p-3"><p class="text-[11px] text-[#0F1B2D]/30 uppercase tracking-wider mb-1">입금 은행</p><p class="text-sm font-bold">카카오뱅크</p></div>
              <div class="rounded-xl bg-[#f8f9fb] p-3"><p class="text-[11px] text-[#0F1B2D]/30 uppercase tracking-wider mb-1">계좌번호</p><p class="text-sm font-bold">3333-14-1078266</p></div>
              <div class="rounded-xl bg-[#f8f9fb] p-3"><p class="text-[11px] text-[#0F1B2D]/30 uppercase tracking-wider mb-1">예금주</p><p class="text-sm font-bold">박소영 (러츠)</p></div>
              <div class="rounded-xl bg-[#f8f9fb] p-3"><p class="text-[11px] text-[#0F1B2D]/30 uppercase tracking-wider mb-1">입금 금액</p><p class="text-sm font-bold text-primary">{{ planChangeDiffAmount.toLocaleString() }}원</p></div>
            </div>
            <Button size="lg" class="w-full h-12 mt-6 text-base font-semibold" @click="closePlanChange">확인</Button>
          </div>
        </template>
        <template v-else>
          <p class="text-sm text-[#0F1B2D]/40 mb-4">현재: <strong class="text-[#0F1B2D]">{{ tierLabel(store.tier) }}</strong> ({{ tierAmount(store.tier) }})</p>
          <div class="flex flex-col gap-3 mb-5">
            <div
              v-for="t in availableTiers"
              :key="t.id"
              :style="{ border: selectedNewTier === t.id ? '2px solid hsl(213,98%,55%)' : '1px solid #f0f1f3', backgroundColor: selectedNewTier === t.id ? 'hsl(213,98%,97%)' : '#fff' }"
              class="flex justify-between items-center p-4 px-5 rounded-xl cursor-pointer transition-all"
              @click="selectedNewTier = t.id"
            >
              <div><p class="text-sm font-bold text-[#0F1B2D]">{{ t.name }}</p><p class="text-xs text-[#0F1B2D]/40 mt-0.5">{{ t.priceLabel }}</p></div>
              <span :class="cn('text-[11px] font-semibold px-2.5 py-1 rounded-full', t.amount > currentTierAmount ? 'bg-primary/10 text-primary' : 'bg-[#f0f1f3] text-[#0F1B2D]/30')">{{ t.amount > currentTierAmount ? '업그레이드' : '다운그레이드' }}</span>
            </div>
          </div>
          <Alert v-if="planChangeError" variant="destructive"><p class="text-sm">{{ planChangeError }}</p></Alert>
          <Button size="lg" class="w-full h-12 text-base font-semibold" :disabled="!selectedNewTier || isChangingPlan" @click="handlePlanChange">{{ isChangingPlan ? '처리 중...' : '플랜 변경 요청' }}</Button>
        </template>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Badge } from '~/components/ui/badge'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Alert } from '~/components/ui/alert'

definePageMeta({ layout: false })
useHead({ title: '마이페이지 - 플레이온' })
const supabase = useSupabase()

const user = ref<{ id: string } | null>(null)
const store = ref<any>(null)
const payments = ref<any[]>([])
const isLoading = ref(true)
const loadError = ref('')
const activeTab = ref('manage')
const loginView = ref<'login' | 'findId' | 'resetPw'>('login')
const loginEmail = ref('')
const loginPassword = ref('')
const loginError = ref('')
const isLoggingIn = ref(false)
const findPhone = ref('')
const findIdResult = ref('')
const findIdError = ref(false)
const isFinding = ref(false)
const resetEmail = ref('')
const resetResult = ref('')
const resetError = ref(false)
const isResetting = ref(false)
const showChangePassword = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')
const passwordError = ref('')
const passwordSuccess = ref('')
const isChangingPassword = ref(false)
const showWithdraw = ref(false)
const isWithdrawing = ref(false)
const withdrawError = ref('')
const isCycleChanging = ref(false)
const showCycleConfirm = ref(false)
const pendingCycle = ref<'monthly' | 'annual' | null>(null)
const showPlanChange = ref(false)
const selectedNewTier = ref('')
const isChangingPlan = ref(false)
const planChangeError = ref('')
const planChangeResult = ref('')
const planChangeDiffAmount = ref(0)

const tabs = [
  { id: 'manage', label: '플랜 관리', icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3' },
  { id: 'payment', label: '결제 안내', icon: 'M2 10h20M22 6H2v12h20V6z' },
  { id: 'profile', label: '개인정보', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  { id: 'history', label: '결제 이력', icon: 'M12 8v4l3 3M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0' },
]

const tierMonthlyMap: Record<string, number> = { basic: 33000, standard: 55000, pro: 99000 }
const ANNUAL_DISCOUNT = 0.10
const storeBillingCycle = computed(() => store.value?.billingCycle || 'monthly')
const isAnnualBilling = computed(() => storeBillingCycle.value === 'annual')

const currentTierAmount = computed(() => {
  const monthly = tierMonthlyMap[store.value?.tier] || 33000
  if (isAnnualBilling.value) return Math.round(monthly * 12 * (1 - ANNUAL_DISCOUNT) / 100) * 100
  return monthly
})
const availableTiers = computed(() => {
  const current = store.value?.tier
  const cycle = storeBillingCycle.value
  const suffix = cycle === 'annual' ? '년' : '월'
  return [
    { id: 'basic', name: '베이직', monthly: 33000 },
    { id: 'standard', name: '스탠다드', monthly: 55000 },
    { id: 'pro', name: '프로', monthly: 99000 },
  ].map(t => {
    const amount = cycle === 'annual'
      ? Math.round(t.monthly * 12 * (1 - ANNUAL_DISCOUNT) / 100) * 100
      : t.monthly
    return { ...t, amount, priceLabel: `${suffix} ${amount.toLocaleString()}원` }
  }).filter(t => t.id !== current)
})

function tierLabel(t: string) { return ({ basic: '베이직', standard: '스탠다드', pro: '프로' } as Record<string, string>)[t] || t }
function tierAmount(t: string) {
  const monthly = tierMonthlyMap[t] || 0
  if (isAnnualBilling.value) {
    const annual = Math.round(monthly * 12 * (1 - ANNUAL_DISCOUNT) / 100) * 100
    return annual.toLocaleString() + '원'
  }
  return monthly.toLocaleString() + '원'
}
function billingCycleLabel() { return isAnnualBilling.value ? '연간' : '월간' }
function statusLabel(s: string) { return ({ trialing: '무료 이용 중', active: '정상', past_due: '미납', restricted: '기능 제한', suspended: '정지', cancelled: '해지' } as Record<string, string>)[s] || s }
function formatPhone(p: string) { if (!p) return ''; const d = p.replace(/[^0-9]/g, ''); if (d.length === 11) return `${d.slice(0,3)}-${d.slice(3,7)}-${d.slice(7)}`; return p }
function statusValueColor(s: string) { return s === 'active' || s === 'trialing' ? 'text-[#0F1B2D]' : 'text-destructive' }
function paymentStatusLabel(s: string) { return ({ paid: '완료', unpaid: '미결제', refunded: '환불' } as Record<string, string>)[s] || s }

// 세션 캐시 — 매번 getSession 호출 방지
let cachedSession: any = null

async function getSession() {
  if (cachedSession) return cachedSession
  const session = await getSession()
  cachedSession = session
  return session
}

async function loadData() {
  isLoading.value = true; loadError.value = ''
  try {
    const session = await getSession()
    if (!session?.user) { user.value = null; return }
    user.value = session.user
    const res = await $fetch('/api/payment/subscription', { headers: { Authorization: `Bearer ${session.access_token}` } })
    store.value = res.store; payments.value = res.payments || []
  } catch (err: any) { loadError.value = err?.data?.message || err?.message || '데이터를 불러오지 못했습니다.' }
  finally { isLoading.value = false }
}

// auth 상태 변경 시 캐시 갱신
supabase.auth.onAuthStateChange((_event, session) => {
  cachedSession = session
})

async function handleLogin() {
  if (isLoggingIn.value) return; isLoggingIn.value = true; loginError.value = ''
  try { const { error } = await supabase.auth.signInWithPassword({ email: loginEmail.value, password: loginPassword.value }); if (error) throw error; await loadData() }
  catch (err: any) { loginError.value = (err.message || '').includes('Invalid login credentials') ? '이메일 또는 비밀번호가 올바르지 않습니다.' : '로그인에 실패했습니다.' }
  finally { isLoggingIn.value = false }
}

async function handleFindId() {
  if (isFinding.value) return; isFinding.value = true; findIdResult.value = ''; findIdError.value = false
  try {
    const { data, error } = await supabase.from('profiles').select('id').eq('phone', findPhone.value.replace(/[^0-9]/g, '')).limit(1).maybeSingle()
    if (error) throw error
    if (data) { const { data: a } = await supabase.auth.admin?.getUserById?.(data.id) || {}; findIdResult.value = a?.user?.email ? `가입된 이메일: ${a.user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3')}` : '관리자에게 문의해주세요.' }
    else { findIdError.value = true; findIdResult.value = '해당 전화번호로 가입된 계정을 찾을 수 없습니다.' }
  } catch { findIdError.value = true; findIdResult.value = '조회 중 오류가 발생했습니다.' } finally { isFinding.value = false }
}

async function handleResetPassword() {
  if (isResetting.value) return; isResetting.value = true; resetResult.value = ''; resetError.value = false
  try { const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.value, { redirectTo: `${window.location.origin}/my` }); if (error) throw error; resetResult.value = '재설정 링크가 이메일로 발송되었습니다.' }
  catch { resetError.value = true; resetResult.value = '발송에 실패했습니다.' } finally { isResetting.value = false }
}

function requestCycleChange(cycle: 'monthly' | 'annual') {
  if (isCycleChanging.value || storeBillingCycle.value === cycle) return
  pendingCycle.value = cycle
  showCycleConfirm.value = true
}

async function confirmCycleChange() {
  if (!pendingCycle.value) return
  showCycleConfirm.value = false
  isCycleChanging.value = true
  try {
    const session = await getSession()
    if (!session?.access_token) throw new Error('세션 만료')
    await $fetch('/api/payment/billing-cycle', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: { storeId: store.value.id, billingCycle: pendingCycle.value },
    })
    store.value.billingCycle = pendingCycle.value
  } catch (err: any) {
    alert(err.data?.message || err.message || '변경에 실패했습니다.')
  } finally {
    isCycleChanging.value = false
    pendingCycle.value = null
  }
}

async function handleLogout() { await supabase.auth.signOut(); cachedSession = null; user.value = null; store.value = null; payments.value = [] }

async function handleCancelSubscription() {
  if (!store.value || !confirm(store.value.subscription_status === 'trialing' ? '무료이용을 취소하시겠습니까?' : '구독을 해지하시겠습니까?')) return
  try { const session = await getSession(); await $fetch('/api/payment/billing', { method: 'POST', headers: { Authorization: `Bearer ${session!.access_token}` }, body: { action: 'delete', storeId: store.value.id } }); store.value.subscription_status = 'cancelled' }
  catch (err: any) { alert(err.data?.message || err.message || '실패') }
}

function closePlanChange() { const had = !!planChangeResult.value; showPlanChange.value = false; selectedNewTier.value = ''; planChangeError.value = ''; planChangeResult.value = ''; planChangeDiffAmount.value = 0; if (had) loadData() }

async function handlePlanChange() {
  if (isChangingPlan.value || !selectedNewTier.value) return; isChangingPlan.value = true; planChangeError.value = ''
  try {
    const session = await getSession()
    const res = await $fetch<{ success: boolean; message: string; diffAmount: number; immediate: boolean }>('/api/payment/plan-change', { method: 'POST', headers: { Authorization: `Bearer ${session!.access_token}` }, body: { storeId: store.value.id, toTier: selectedNewTier.value } })
    planChangeResult.value = res.message; planChangeDiffAmount.value = res.diffAmount > 0 ? res.diffAmount : 0; if (res.immediate) store.value.tier = selectedNewTier.value
  } catch (err: any) { planChangeError.value = err.data?.message || err.message || '실패' } finally { isChangingPlan.value = false }
}

async function handleChangePassword() {
  if (isChangingPassword.value) return; passwordError.value = ''; passwordSuccess.value = ''
  if (newPassword.value.length < 8) { passwordError.value = '8자 이상 입력해주세요.'; return }
  if (newPassword.value !== confirmPassword.value) { passwordError.value = '비밀번호가 일치하지 않습니다.'; return }
  isChangingPassword.value = true
  try { const { error } = await supabase.auth.updateUser({ password: newPassword.value }); if (error) throw error; passwordSuccess.value = '변경되었습니다.'; newPassword.value = ''; confirmPassword.value = ''; setTimeout(() => { showChangePassword.value = false; passwordSuccess.value = '' }, 1500) }
  catch (err: any) { passwordError.value = err.message || '실패' } finally { isChangingPassword.value = false }
}

async function handleWithdraw() {
  if (isWithdrawing.value) return; isWithdrawing.value = true; withdrawError.value = ''
  try { const session = await getSession(); await $fetch('/api/payment/billing', { method: 'POST', headers: { Authorization: `Bearer ${session!.access_token}` }, body: { action: 'delete', storeId: store.value.id } }); await supabase.auth.signOut(); user.value = null; store.value = null; payments.value = []; showWithdraw.value = false }
  catch (err: any) { withdrawError.value = err.data?.message || err.message || '실패' } finally { isWithdrawing.value = false }
}

onMounted(loadData)
</script>
