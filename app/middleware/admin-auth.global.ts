export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/manage/account/login') {
    return navigateTo('/admin/login', { redirectCode: 301 })
  }

  if (to.path === '/admin/index.html') {
    return navigateTo('/admin', { redirectCode: 301 })
  }

  const isAdminPath = to.path === '/admin' || to.path.startsWith('/admin/')
  if (!isAdminPath || to.path === '/admin/login') return

  try {
    const result = await $fetch<{ user: { id: number; username: string } | null }>('/api/admin/auth/me', {
      headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined,
    })
    if (!result.user) throw new Error('Unauthorized')
  } catch {
    return navigateTo(`/admin/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
