import { getQuery } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { asString } from '../../../utils/content'
import { getDb } from '../../../utils/db'
import { mapPost } from '../../../utils/serializers'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const query = getQuery(event)
  const search = asString(query.q)
  const status = asString(query.status)
  const requestedPage = Math.max(1, Math.trunc(Number(query.page) || 1))
  const requestedPageSize = Math.max(10, Math.min(100, Math.trunc(Number(query.pageSize) || 20)))

  const where: string[] = []
  const params: Array<string | number> = []

  if (search) {
    where.push('(title LIKE ? OR slug LIKE ?)')
    params.push(`%${search}%`, `%${search}%`)
  }

  if (status === 'scheduled') {
    where.push("status = 'draft' AND scheduled_publish_at IS NOT NULL AND scheduled_publish_at <> ''")
  } else if (status && ['draft', 'published'].includes(status)) {
    where.push('status = ?')
    params.push(status)
  }

  const database = getDb()
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const total = (database
    .prepare(`SELECT COUNT(*) AS count FROM posts ${whereSql}`)
    .get(...params) as { count: number }).count
  const totalPages = Math.max(1, Math.ceil(total / requestedPageSize))
  const page = Math.min(requestedPage, totalPages)
  const offset = (page - 1) * requestedPageSize

  const rows = database
    .prepare(`
      SELECT *
      FROM posts
      ${whereSql}
      ORDER BY COALESCE(scheduled_publish_at, published_at, created_at) DESC, id DESC
      LIMIT ? OFFSET ?
    `)
    .all(...params, requestedPageSize, offset)

  return {
    items: rows.map(mapPost),
    pagination: {
      page,
      pageSize: requestedPageSize,
      total,
      totalPages,
    },
  }
})
