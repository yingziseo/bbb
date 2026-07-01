import { setHeader } from 'h3'
import { getSiteOrigin } from '../utils/site-settings'

export default defineEventHandler((event) => {
  const base = getSiteOrigin(event)
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /like',
    'Disallow: /admin',
    base ? `Sitemap: ${base}/sitemap.xml` : '',
  ]
    .filter(Boolean)
    .join('\n')
})
