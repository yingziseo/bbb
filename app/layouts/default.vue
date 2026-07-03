<script setup lang="ts">
const company = await useSiteSettings()
const faviconPath = computed(() => {
  const path = company.faviconPath || '/favicon-96x96.png'
  return path.toLowerCase().endsWith('.png') ? path : '/favicon-96x96.png'
})

useHead(() => ({
  link: [
    {
      key: 'favicon',
      rel: 'icon',
      type: 'image/png',
      sizes: '96x96',
      href: faviconPath.value,
    },
    {
      key: 'apple-touch-icon',
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-icon.png',
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
