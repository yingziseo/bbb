import { getQuery } from 'h3'
import { getDb } from '../../../utils/db'
import { mapPostSummary } from '../../../utils/serializers'

const DEFAULT_PAGE_SIZE = 9
const MAX_PAGE_SIZE = 24

const toPositiveInt = (value: unknown, fallback: number) => {
  const parsed = Number.parseInt(String(value || ''), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const page = toPositiveInt(query.page, 1)
  const pageSize = Math.min(toPositiveInt(query.pageSize, DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE)
  const offset = (page - 1) * pageSize
  const total = (
    getDb()
      .prepare("SELECT COUNT(*) AS count FROM posts WHERE status = 'published'")
      .get() as { count: number }
  ).count
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const rows = getDb()
    .prepare(`
      SELECT
        id,
        slug,
        title,
        excerpt,
        cover_image,
        status,
        published_at,
        seo_title,
        seo_description,
        seo_keywords,
        canonical,
        created_at,
        updated_at
      FROM posts
      WHERE status = 'published'
      ORDER BY COALESCE(published_at, created_at) DESC, id DESC
      LIMIT ? OFFSET ?
    `)
    .all(pageSize, offset)

  return {
    items: rows.map(mapPostSummary),
    total,
    page,
    pageSize,
    totalPages,
  }
})
