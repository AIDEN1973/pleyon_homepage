interface InquiryForm {
  storeName: string
  contactName: string
  phone: string
  message: string
  agreed: boolean
}

interface InquiryState {
  form: InquiryForm
  isSubmitting: boolean
  isSuccess: boolean
  errorMessage: string
}

export function useInquiry() {
  const state = reactive<InquiryState>({
    form: {
      storeName: '',
      contactName: '',
      phone: '',
      message: '',
      agreed: false,
    },
    isSubmitting: false,
    isSuccess: false,
    errorMessage: '',
  })

  const isFormValid = computed(() => {
    const { storeName, contactName, phone, message, agreed } = state.form
    return (
      storeName.trim().length > 0 &&
      contactName.trim().length > 0 &&
      /^01[016789]\d{7,8}$/.test(phone.replace(/[^0-9]/g, '')) &&
      message.trim().length > 0 &&
      agreed
    )
  })

  async function submit() {
    if (!isFormValid.value || state.isSubmitting) return

    state.isSubmitting = true
    state.errorMessage = ''

    try {
      const res = await $fetch('/api/inquiry', {
        method: 'POST',
        body: {
          storeName: state.form.storeName.trim(),
          contactName: state.form.contactName.trim(),
          phone: state.form.phone.replace(/[^0-9]/g, ''),
          message: state.form.message.trim(),
        },
      })

      if (res.success) {
        state.isSuccess = true
        state.form = { storeName: '', contactName: '', phone: '', message: '', agreed: false }
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } }
      state.errorMessage = error?.data?.message || '문의 접수에 실패했습니다. 잠시 후 다시 시도해주세요.'
    } finally {
      state.isSubmitting = false
    }
  }

  function reset() {
    state.isSuccess = false
    state.errorMessage = ''
  }

  return {
    state,
    isFormValid,
    submit,
    reset,
  }
}
