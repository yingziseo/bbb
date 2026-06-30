import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  modules: ['@element-plus/nuxt', '@nuxt/image'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  elementPlus: {
    /** Element Plus options */
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'YIYUAN NEW MATERIALS | China Export Quality Factory',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Cling film, fresh wrap, and packaging materials for OEM and export orders.',
        },
        { name: 'theme-color', content: '#0f2a4a' },
      ],
    },
  },
})
