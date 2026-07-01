<script setup lang="ts">
const route = useRoute()
const isAdminRoute = computed(() => route.path === '/like' || route.path.startsWith('/like/'))
const isAdminLogin = computed(() => route.path === '/like/login')
const layoutName = computed(() => {
  if (isAdminLogin.value) return 'blank'
  if (isAdminRoute.value) return 'admin'
  return 'default'
})
</script>

<template>
  <NuxtLayout :name="layoutName">
    <NuxtPage />
  </NuxtLayout>
</template>
