<script setup lang="ts">
const company = await useSiteSettings()

useHead(() => ({
  link: [
    {
      rel: 'icon',
      href: company.faviconPath || '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: company.logoPath || '/site-logo.png',
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
