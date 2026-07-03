import { getRequestURL, sendRedirect } from 'h3'

const SKIP_PREFIXES = ['/_nuxt/', '/api/', '/images/', '/uploads/']

export default defineEventHandler((event) => {
  if (!['GET', 'HEAD'].includes(event.method.toUpperCase())) return

  const url = getRequestURL(event)
  const pathname = url.pathname
  if (pathname === '/' || !pathname.endsWith('/')) return
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return

  const lastSegment = pathname.split('/').filter(Boolean).at(-1) || ''
  if (lastSegment.includes('.')) return

  const canonicalPath = pathname.replace(/\/+$/, '') || '/'
  return sendRedirect(event, `${canonicalPath}${url.search}`, 301)
})
