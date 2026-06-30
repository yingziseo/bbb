import { requireAdmin } from '../../../utils/auth'
import { getDb } from '../../../utils/db'
import { mapSeo } from '../../../utils/serializers'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const rows = getDb()
    .prepare(`
      SELECT *
      FROM seo_entries
      ORDER BY
        CASE page_type
          WHEN 'page' THEN 1
          WHEN 'product' THEN 2
          WHEN 'post' THEN 3
          ELSE 4
        END,
        path ASC
    `)
    .all()

  return { items: rows.map(mapSeo) }
})
