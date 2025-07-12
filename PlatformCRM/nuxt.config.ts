// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  components: true,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css',  'swiper/css',
    'swiper/css/pagination',],
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  devServer: {
    https: false,
    port: 3000,
    host: '0.0.0.0'
  },
  app: {
    head: {
      title: 'OpenCRM',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {  name: 'description', content: 'CRM pour agences digitales' }
      ],
      link: [
        {      
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css',
        }
      ]
    }
  }
})