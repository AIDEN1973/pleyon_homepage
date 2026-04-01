// 결제 관련 공통 유틸리티

export const TIER_MONTHLY: Record<string, number> = {
  basic: 33000,
  standard: 55000,
  pro: 99000,
}

export const ANNUAL_DISCOUNT = 0.10

// 결제 주기에 따른 금액 계산
export function calcAmount(tier: string, cycle: string = 'monthly'): number {
  const monthly = TIER_MONTHLY[tier] || 33000
  if (cycle === 'annual') return Math.round(monthly * 12 * (1 - ANNUAL_DISCOUNT) / 100) * 100
  return monthly
}

// 다음 결제일/기간 종료일 계산
export function calcNextDate(dateStr: string, cycle: string = 'monthly'): string {
  const d = new Date(dateStr)
  if (cycle === 'annual') d.setFullYear(d.getFullYear() + 1)
  else d.setMonth(d.getMonth() + 1)
  return d.toISOString().split('T')[0]
}
