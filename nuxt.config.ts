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
      siteUrl: 'https://pleyon.co.kr',
      appUrl: 'https://www.pleyon.co.kr/login',
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
