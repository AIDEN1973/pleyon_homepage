# CLAUDE.md - 플레이온 홈페이지

## 프로젝트 개요
- 플레이온(Pleyon) 레고카페 통합 운영 솔루션 홈페이지
- Nuxt 4 + Vue 3 + TypeScript
- 배포: Vercel (SSR)
- DB/Auth: Supabase

## 기술 스택
- 런타임: Nuxt 4 (compatibilityVersion: 4), Nitro, Vite
- 스타일: Tailwind CSS + shadcn-vue (CSS 변수 기반)
- UI 컴포넌트: shadcn-vue (app/components/ui/)
- 모듈: @nuxtjs/tailwindcss, @nuxt/image, @vueuse/nuxt
- 폰트: Pretendard Variable, SUIT Variable, Elice DX Neolli, Archivo (CDN)

## 디렉토리 구조
```
app/
  pages/           # 라우트 (index, pricing, contact, terms, privacy, program, signup, my)
  components/
    common/        # AppHeader, AppFooter
    landing/       # HeroSection, TrustMetrics, FeatureSection, TestimonialSection, FaqSection, CtaSection
    program/       # ProgramHero, TechShowcase, CoreAutomation, CoreAI, ProgramFeatures, ProgramFaq
    ui/            # shadcn-vue 컴포넌트 (수동 import)
  layouts/         # default.vue
  assets/css/
    tailwind.css   # Tailwind 디렉티브 + HSL CSS 변수 (SSOT)
    tokens.css     # 레거시 (레이아웃 변수만 잔존, 마이그레이션 후 삭제 예정)
    global.css     # 레거시 리셋/레이아웃 (마이그레이션 후 삭제 예정)
  composables/     # useInquiry, useSupabase
  lib/             # utils.ts (cn() 함수)
server/            # API 라우트
public/            # 정적 파일
```

## 코드 컨벤션

### CSS
- 디자인 값은 `tailwind.css`의 HSL CSS 변수 + Tailwind 유틸리티 클래스 사용
- `tailwind.css`가 SSOT — 색상/간격 변경 시 여기만 수정
- `tokens.css` 직접 참조 금지 — Tailwind 유틸리티 또는 `tailwind.css` HSL 변수 사용
- `<style scoped>` 사용하지 않음 — Tailwind 유틸리티 클래스로 대체
- 조건부 클래스: `cn()` 유틸 사용 (`import { cn } from '~/lib/utils'`)
- duration 값: arbitrary value(`duration-[600ms]`) 대신 Tailwind 내장 유틸(`duration-600`) 사용
- 디자인 참조: portone.io 스타일 (다크 히어로 + 블루 액센트 + 클린 화이트 섹션)

### 컴포넌트
- shadcn-vue 컴포넌트는 수동 import: `import { Button } from '~/components/ui/button'`
- 설치된 shadcn 컴포넌트: accordion, alert, avatar, badge, button, card, carousel, checkbox, dialog, input, label, radio-group, separator, sheet, switch, table, tabs, textarea, tooltip
- `pathPrefix: false` 설정 — 하위 폴더명 없이 컴포넌트명 그대로 사용 (예: `<HeroSection />`)
- 글로벌 레이아웃: `app.vue` → `NuxtLayout` → `NuxtPage`

### 언어
- UI 텍스트: 한국어
- 코드/주석: 한국어 허용
- 브랜드명: "플레이온", 업종명: "레고카페"

## 명령어
- `npm run dev` — 개발 서버
- `npm run build` — 프로덕션 빌드
- `npm run generate` — 정적 생성
- `npm run preview` — 빌드 미리보기
