// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },},
    app: {
      head: {
        title: 'OpenCRM',
        meta: [
          { charset: 'utf-8' },
          { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          {  name: 'description', content: 'CRM pour agences digitales' }
        ],
        link: [
          { rel: 'styleshee', type: 'image/x-icon', href: 'https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.2.0/remixicon.min.css' }
        ]
      }
    }
})