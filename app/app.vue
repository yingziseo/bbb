<script setup lang="ts">
const route = useRoute()
const isAdminRoute = computed(() => route.path === '/admin' || route.path.startsWith('/admin/'))
const isAdminLogin = computed(() => route.path === '/admin/login')
const layoutName = computed(() => {
  if (isAdminLogin.value) return 'blank'
  if (isAdminRoute.value) return 'admin'
  return 'default'
})
</script>

<template>
  <NuxtLayout :name="layoutName">
    <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
  </NuxtLayout>
</template>
