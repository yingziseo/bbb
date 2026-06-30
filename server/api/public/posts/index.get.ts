import { getDb } from '../../../utils/db'
import { mapPost } from '../../../utils/serializers'

export default defineEventHandler(() => {
  const rows = getDb()
    .prepare(`
      SELECT *
      FROM posts
      WHERE status = 'published'
      ORDER BY COALESCE(published_at, created_at) DESC, id DESC
    `)
    .all()

  return { items: rows.map(mapPost) }
})
