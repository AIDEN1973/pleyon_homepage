<template>
  <div>
    <section class="bg-[#1A7CFD] py-20 pb-12 text-center">
      <div class="max-w-content mx-auto px-6">
        <h1 class="font-display text-4xl md:text-5xl font-semibold text-white mb-3">개인정보처리방침</h1>
        <p class="text-sm text-white/80">시행일: 2026년 3월 25일</p>
      </div>
    </section>

    <section class="py-24 md:py-32">
      <div class="max-w-narrow mx-auto px-6">
        <article class="text-base text-muted-foreground leading-relaxed">
          <h2 class="text-xl font-bold text-foreground mt-0 mb-4">1. 개인정보의 수집 및 이용 목적</h2>
          <p class="mb-4">주식회사 플레이온(이하 "회사")은 다음의 목적을 위하여 개인정보를 수집·이용합니다.</p>
          <ol class="list-decimal pl-6 mb-4 flex flex-col gap-2">
            <li>서비스 제공 및 계약 이행: 매장 운영 솔루션 제공, 결제 처리, 고객 관리</li>
            <li>회원 관리: 본인 확인, 서비스 이용 관리, 고지사항 전달</li>
            <li>문의 응대: 도입 문의 접수, 상담, 결과 회신</li>
            <li>마케팅 및 광고: 이벤트 안내, 서비스 관련 정보 제공 (동의 시)</li>
          </ol>

          <h2 class="text-xl font-bold text-foreground mt-10 mb-4">2. 수집하는 개인정보 항목</h2>
          <h3 class="text-base font-semibold text-foreground mt-4 mb-2">홈페이지 문의 시</h3>
          <ul class="list-disc pl-6 mb-4 flex flex-col gap-2">
            <li>필수: 매장명, 담당자명, 연락처, 문의내용</li>
          </ul>
          <h3 class="text-base font-semibold text-foreground mt-4 mb-2">서비스 이용 시</h3>
          <ul class="list-disc pl-6 mb-4 flex flex-col gap-2">
            <li>필수: 사업자 정보, 대표자명, 연락처, 이메일</li>
            <li>매장 고객 정보: 이름, 전화번호, 포인트/이용권 정보</li>
          </ul>

          <h2 class="text-xl font-bold text-foreground mt-10 mb-4">3. 개인정보의 보유 및 이용 기간</h2>
          <ol class="list-decimal pl-6 mb-4 flex flex-col gap-2">
            <li>서비스 이용 기간 동안 보유하며, 해지 시 지체 없이 파기합니다.</li>
            <li>단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.
              <ul class="list-disc pl-6 mt-2 flex flex-col gap-2">
                <li>전자상거래 등에서의 소비자 보호에 관한 법률: 계약 또는 청약 철회 기록 5년</li>
                <li>대금결제 및 재화 등의 공급 기록 5년</li>
                <li>소비자 불만 또는 분쟁 처리 기록 3년</li>
              </ul>
            </li>
          </ol>

          <h2 class="text-xl font-bold text-foreground mt-10 mb-4">4. 개인정보의 제3자 제공</h2>
          <p class="mb-4">
            회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
            다만, 다음의 경우에는 예외로 합니다.
          </p>
          <ol class="list-decimal pl-6 mb-4 flex flex-col gap-2">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령의 규정에 의한 경우</li>
          </ol>

          <h2 class="text-xl font-bold text-foreground mt-10 mb-4">5. 개인정보 처리의 위탁</h2>
          <p class="mb-4">회사는 서비스 제공을 위해 다음과 같이 개인정보 처리를 위탁하고 있습니다.</p>
          <Table class="my-4 text-sm">
            <TableHeader>
              <TableRow>
                <TableHead>수탁업체</TableHead>
                <TableHead>위탁 업무</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Supabase</TableCell>
                <TableCell>데이터베이스 호스팅 및 인증 서비스</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>알리고</TableCell>
                <TableCell>SMS/알림톡 발송 대행</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Vercel</TableCell>
                <TableCell>웹 서비스 호스팅</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <h2 class="text-xl font-bold text-foreground mt-10 mb-4">6. 이용자의 권리</h2>
          <p class="mb-4">이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
          <ol class="list-decimal pl-6 mb-4 flex flex-col gap-2">
            <li>개인정보 열람 요구</li>
            <li>오류 등이 있을 경우 정정 요구</li>
            <li>삭제 요구</li>
            <li>처리 정지 요구</li>
          </ol>

          <h2 class="text-xl font-bold text-foreground mt-10 mb-4">7. 개인정보의 안전성 확보 조치</h2>
          <p class="mb-4">회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
          <ol class="list-decimal pl-6 mb-4 flex flex-col gap-2">
            <li>개인정보의 암호화</li>
            <li>해킹 등에 대비한 기술적 대책</li>
            <li>개인정보에 대한 접근 제한</li>
            <li>개인정보 취급 직원의 최소화 및 교육</li>
          </ol>

          <h2 class="text-xl font-bold text-foreground mt-10 mb-4">8. 개인정보 보호책임자</h2>
          <ul class="list-disc pl-6 mb-4 flex flex-col gap-2">
            <li>성명: OOO</li>
            <li>직위: 대표이사</li>
            <li>연락처: 문의하기 페이지를 통해 접수</li>
          </ul>

          <h2 class="text-xl font-bold text-foreground mt-10 mb-4">9. 변경 사항 고지</h2>
          <p class="mb-4">
            이 개인정보처리방침은 법령, 정책 또는 보안 기술의 변경에 따라 수정될 수 있으며,
            변경 시 최소 7일 전 서비스 내 공지사항을 통해 고지합니다.
          </p>

          <Separator class="mt-12 mb-0" />
          <p class="pt-6 text-sm text-muted-foreground">
            본 개인정보처리방침은 2026년 3월 25일부터 시행합니다.
          </p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Separator } from '~/components/ui/separator'

useHead({ title: '개인정보처리방침 - 플레이온' })
useSeoMeta({ description: '플레이온 개인정보 처리방침' })
</script>
