import { requireAdmin } from '../../../utils/auth'
import { getDb } from '../../../utils/db'
import { mapSeo } from '../../../utils/serializers'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const rows = getDb()
    .prepare(`
      SELECT *
      FROM seo_entries
      WHERE page_type = 'page'
      ORDER BY
        path ASC
    `)
    .all()

  return { items: rows.map(mapSeo) }
})
