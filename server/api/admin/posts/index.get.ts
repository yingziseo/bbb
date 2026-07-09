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

  const where: string[] = []
  const params: string[] = []

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

  const rows = getDb()
    .prepare(`
      SELECT *
      FROM posts
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY COALESCE(scheduled_publish_at, published_at, created_at) DESC, id DESC
    `)
    .all(...params)

  return { items: rows.map(mapPost) }
})
