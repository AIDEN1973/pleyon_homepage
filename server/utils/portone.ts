// 포트원 V2 API 유틸리티

const PORTONE_API_BASE = 'https://api.portone.io'

export function usePortoneServer() {
  const config = useRuntimeConfig()
  const apiSecret = config.portoneApiSecret

  async function request<T>(path: string, options?: { method?: string; body?: unknown }): Promise<T> {
    return await $fetch<T>(`${PORTONE_API_BASE}${path}`, {
      method: (options?.method || 'GET') as 'GET' | 'POST' | 'PUT' | 'DELETE',
      headers: {
        Authorization: `PortOne ${apiSecret}`,
      },
      body: options?.body ?? undefined,
    }) as unknown as T
  }

  // 결제 단건 조회
  async function getPayment(paymentId: string) {
    return await request<PortonePayment>(`/payments/${encodeURIComponent(paymentId)}`)
  }

  // 빌링키 발급 (예약 결제용)
  async function issueBillingKey(billingKeyPaymentMethodId: string) {
    return await request(`/billing-keys/${encodeURIComponent(billingKeyPaymentMethodId)}`)
  }

  // 빌링키로 결제 요청
  async function payWithBillingKey(params: {
    paymentId: string
    billingKey: string
    orderName: string
    amount: number
    currency?: string
    customer?: { name?: string; email?: string; phoneNumber?: string }
  }) {
    return await request<PortonePayment>(`/payments/${encodeURIComponent(params.paymentId)}/billing-key`, {
      method: 'POST',
      body: {
        billingKey: params.billingKey,
        orderName: params.orderName,
        amount: { total: params.amount },
        currency: params.currency || 'KRW',
        customer: params.customer,
      },
    })
  }

  return { request, getPayment, issueBillingKey, payWithBillingKey }
}

// 결제 ID 생성/파싱 유틸 (PG사 oid 40자 제한 준수)
// 형식: p{32hex}{7base36} = 1+32+7 = 40자
// 예: pd5e06819abe843b0ba2de4d38cfd8a8d1q3kf7
export function generatePaymentId(storeId: string): string {
  const hex = storeId.replace(/-/g, '') // UUID 하이픈 제거 → 32자
  const ts7 = Date.now().toString(36).slice(-7) // base36 타임스탬프 끝 7자
  return `p${hex}${ts7}` // 1+32+7 = 40자
}

// 결제 ID에서 storeId(UUID) 복원
export function extractStoreIdFromPaymentId(paymentId: string): string | null {
  if (!paymentId.startsWith('p') || paymentId.length !== 40) return null
  const hex = paymentId.slice(1, 33)
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

// 포트원 결제 응답 타입
export interface PortonePayment {
  id: string
  status: 'PAID' | 'FAILED' | 'CANCELLED' | 'READY' | 'PENDING'
  amount: { total: number; paid: number }
  method?: { type: string; card?: { name: string; number: string } }
  billingKey?: string
  requestedAt?: string
  paidAt?: string
  failedAt?: string
  cancelledAt?: string
}
