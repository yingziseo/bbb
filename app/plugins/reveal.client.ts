export default defineNuxtPlugin((nuxtApp) => {
  if (!('IntersectionObserver' in window)) return

  let observer: IntersectionObserver | null = null

  const isAdminRoute = () => window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')

  const setupReveal = () => {
    if (isAdminRoute()) {
      observer?.disconnect()
      document.querySelectorAll<HTMLElement>('.reveal-item').forEach((element) => {
        element.classList.remove('reveal-item', 'is-visible')
        element.removeAttribute('data-reveal-bound')
        element.style.removeProperty('--reveal-delay')
      })
      return
    }

    observer?.disconnect()
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        })
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.12,
      },
    )

    const elements = document.querySelectorAll<HTMLElement>(
      [
        'main section',
        '.reveal-on-scroll',
        '.group.flex.flex-col.border',
        '.group.mb-12',
      ].join(','),
    )

    elements.forEach((element, index) => {
      if (element.dataset.revealBound === 'true') return

      element.dataset.revealBound = 'true'
      element.classList.add('reveal-item')
      element.style.setProperty('--reveal-delay', `${Math.min((index % 6) * 45, 180)}ms`)
      observer?.observe(element)
    })
  }

  const scheduleReveal = () => {
    window.requestAnimationFrame(setupReveal)
  }

  nuxtApp.hook('app:mounted', scheduleReveal)
  nuxtApp.hook('page:finish', scheduleReveal)
})
