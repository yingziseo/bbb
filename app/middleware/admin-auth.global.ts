export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/manage/account/login') {
    return navigateTo('/like/login', { redirectCode: 301 })
  }

  if (to.path === '/like/index.html') {
    return navigateTo('/like', { redirectCode: 301 })
  }

  const isAdminPath = to.path === '/like' || to.path.startsWith('/like/')
  if (!isAdminPath || to.path === '/like/login') return

  try {
    const result = await $fetch<{ user: { id: number; username: string } | null }>('/api/admin/auth/me', {
      headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined,
    })
    if (!result.user) throw new Error('Unauthorized')
  } catch {
    return navigateTo(`/like/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
