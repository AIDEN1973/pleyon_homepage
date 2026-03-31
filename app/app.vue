<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
onMounted(() => {
  if (window.ChannelIOInitialized) return

  const ch: ((...args: unknown[]) => void) & { q?: unknown[]; c?: (...args: unknown[]) => void } = function (...args: unknown[]) {
    ch.c?.(...args)
  }
  ch.q = []
  ch.c = function (...args: unknown[]) {
    ch.q!.push(args)
  }
  window.ChannelIO = ch

  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = true
  script.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js'
  const firstScript = document.getElementsByTagName('script')[0]
  firstScript.parentNode?.insertBefore(script, firstScript)

  window.ChannelIO('boot', {
    pluginKey: '3b721177-631a-4d10-b90f-fa9cc5223c03',
  })

  window.ChannelIOInitialized = true
})

declare global {
  interface Window {
    ChannelIO?: (...args: unknown[]) => void
    ChannelIOInitialized?: boolean
  }
}
</script>
