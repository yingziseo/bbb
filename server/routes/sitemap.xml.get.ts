import { setHeader } from 'h3'
import { getDb } from '../utils/db'
import { toAbsoluteSiteUrl } from '../utils/site-settings'

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export default defineEventHandler((event) => {
  const rows = getDb()
    .prepare(`
      SELECT path, updated_at
      FROM seo_entries
      WHERE robots NOT LIKE '%noindex%'
      ORDER BY path ASC
    `)
    .all() as Array<{ path: string; updated_at: string }>

  const urls = rows
    .map((row) => {
      const loc = escapeXml(toAbsoluteSiteUrl(row.path, event))
      return `  <url><loc>${loc}</loc><lastmod>${row.updated_at.slice(0, 10)}</lastmod></url>`
    })
    .join('\n')

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
})
