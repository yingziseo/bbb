import { setHeader } from 'h3'
import { getDb } from '../utils/db'
import { toAbsoluteSiteUrl } from '../utils/site-settings'

const BLOG_PAGE_SIZE = 9

type SitemapRow = {
  path: string
  updated_at: string
}

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const normalizeSitemapPath = (value: string) => {
  const path = value.startsWith('/') ? value : `/${value}`
  if (path === '/') return path
  return path.replace(/\/+$/, '')
}

export default defineEventHandler((event) => {
  const rows = getDb()
    .prepare(`
      SELECT
        s.path,
        CASE
          WHEN s.page_type = 'product' AND p.updated_at IS NOT NULL AND p.updated_at > s.updated_at THEN p.updated_at
          WHEN s.page_type = 'category' AND c.updated_at IS NOT NULL AND c.updated_at > s.updated_at THEN c.updated_at
          WHEN s.page_type = 'post' AND po.updated_at IS NOT NULL AND po.updated_at > s.updated_at THEN po.updated_at
          ELSE s.updated_at
        END AS updated_at
      FROM seo_entries s
      LEFT JOIN products p ON s.page_type = 'product' AND s.entity_slug = p.slug
      LEFT JOIN product_categories c ON s.page_type = 'category' AND s.entity_slug = c.slug
      LEFT JOIN posts po ON s.page_type = 'post' AND s.entity_slug = po.slug
      WHERE s.robots NOT LIKE '%noindex%'
        AND (
          s.page_type = 'page'
          OR (s.page_type = 'product' AND p.status = 'published')
          OR (s.page_type = 'category' AND c.enabled = 1)
          OR (s.page_type = 'post' AND po.status = 'published')
        )
      ORDER BY s.path ASC
    `)
    .all() as SitemapRow[]

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
      const loc = escapeXml(toAbsoluteSiteUrl(normalizeSitemapPath(row.path), event))
      return `  <url><loc>${loc}</loc><lastmod>${row.updated_at.slice(0, 10)}</lastmod></url>`
    })
    .join('\n')

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
})
