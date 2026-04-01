export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',

  future: {
    compatibilityVersion: 4,
  },

  ssr: true,

  nitro: {
    preset: 'vercel',
  },

  runtimeConfig: {
    supabaseServiceRoleKey: '',
    aligoRelayUrl: '',
    aligoApiKey: '',
    aligoUserId: '',
    aligoSender: '',
    notifyPhone: '',
    portoneApiSecret: '',
    portoneWebhookSecret: '',
    public: {
      supabaseUrl: '',
      supabaseAnonKey: '',
      siteUrl: 'https://home.pleyon.co.kr',
      appUrl: 'https://www.pleyon.co.kr',
      portoneStoreId: '',
      portoneChannelKey: '',
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@vueuse/nuxt',
  ],

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.ts',
  },

  components: [
    { path: '~/components', pathPrefix: false, ignore: ['ui/**'] },
  ],

  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'author', content: '플레이온' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:site_name', content: '플레이온' },
        { property: 'og:locale', content: 'ko_KR' },
        { name: 'naver-site-verification', content: '' },
        { name: 'google-site-verification', content: '' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://cdn.jsdelivr.net', crossorigin: '' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://font.elice.io' },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css',
        },
        {
          rel: 'stylesheet',
          href: 'https://font.elice.io/css?family=Elice+DX+Neolli',
        },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/gh/fonts-archive/GmarketSans/GmarketSans.css',
        },
      ],
    },
  },

  css: ['~/assets/css/global.css'],

  vite: {
    optimizeDeps: {
      include: [
        'lucide-vue-next',
        'clsx',
        'tailwind-merge',
        'class-variance-authority',
        'reka-ui',
      ],
    },
  },

  image: {
    quality: 80,
  },
})
