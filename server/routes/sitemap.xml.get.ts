import { setHeader } from 'h3'
import { getDb } from '../utils/db'
import { toAbsoluteSiteUrl } from '../utils/site-settings'

const BLOG_PAGE_SIZE = 9

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

  const sitemapRows = [...rows]
  const blogEntry = rows.find((row) => row.path === '/blog')
  const publishedPostCount = (
    getDb()
      .prepare("SELECT COUNT(*) AS count FROM posts WHERE status = 'published'")
      .get() as { count: number }
  ).count
  const blogTotalPages = Math.ceil(publishedPostCount / BLOG_PAGE_SIZE)

  if (blogEntry && blogTotalPages > 1) {
    for (let page = 2; page <= blogTotalPages; page += 1) {
      sitemapRows.push({
        path: `/blog/page/${page}`,
        updated_at: blogEntry.updated_at,
      })
    }
  }

  const urls = sitemapRows
    .map((row) => {
      const loc = escapeXml(toAbsoluteSiteUrl(row.path, event))
      return `  <url><loc>${loc}</loc><lastmod>${row.updated_at.slice(0, 10)}</lastmod></url>`
    })
    .join('\n')

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
})
