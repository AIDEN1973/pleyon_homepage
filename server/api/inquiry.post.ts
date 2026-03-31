export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  // 입력 검증
  const { storeName, contactName, phone, message } = body
  if (!storeName || !contactName || !phone || !message) {
    throw createError({ statusCode: 400, message: '필수 항목을 모두 입력해주세요.' })
  }

  const phoneClean = phone.replace(/[^0-9]/g, '')
  if (!/^01[016789]\d{7,8}$/.test(phoneClean)) {
    throw createError({ statusCode: 400, message: '올바른 연락처를 입력해주세요.' })
  }

  // Supabase에 저장
  const supabase = useSupabaseServer()
  const { error: dbError } = await supabase
    .from('homepage_inquiries')
    .insert({
      store_name: storeName,
      contact_name: contactName,
      phone: phoneClean,
      message,
    })

  if (dbError) {
    console.error('[문의 저장 실패]', dbError)
    throw createError({ statusCode: 500, message: '문의 저장에 실패했습니다. 잠시 후 다시 시도해주세요.' })
  }

  // SMS 알림 발송 (관리자에게) — 실패해도 문의 저장은 성공
  try {
    const relayUrl = config.aligoRelayUrl || 'http://54.180.41.76:3000/send-sms'
    const notifyPhone = config.notifyPhone

    if (notifyPhone && config.aligoApiKey) {
      const smsMessage = `[플레이온 홈페이지 문의]\n매장: ${storeName}\n담당자: ${contactName}\n연락처: ${phoneClean}\n내용: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`

      await $fetch(relayUrl, {
        method: 'POST',
        body: {
          apiKey: config.aligoApiKey,
          userId: config.aligoUserId,
          sender: config.aligoSender,
          receiver: notifyPhone,
          msg: smsMessage,
          title: '플레이온 홈페이지 문의',
          testmode: false,
        },
      })
    }
  } catch (smsError) {
    console.error('[SMS 알림 실패]', smsError)
  }

  return { success: true, message: '문의가 접수되었습니다. 빠른 시일 내 연락드리겠습니다.' }
})
