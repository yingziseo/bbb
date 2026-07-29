<script setup lang="ts">
const company = await useSiteSettings()
const { htmlLang } = useLocale()
const faviconPath = computed(() => {
  const path = company.faviconPath || '/favicon.ico'
  return path.toLowerCase().endsWith('.ico') ? path : '/favicon.ico'
})

useHead(() => ({
  htmlAttrs: {
    lang: htmlLang.value,
  },
  link: [
    {
      key: 'favicon',
      rel: 'icon',
      type: 'image/x-icon',
      href: faviconPath.value,
    },
  ],
}))
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white">
    <SiteHeader />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />
    <WhatsAppFab />
  </div>
</template>
