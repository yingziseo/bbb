import { requireAdmin } from '../../../utils/auth'
import { getDb } from '../../../utils/db'
import { mapSocialLink } from '../../../utils/serializers'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const rows = getDb().prepare('SELECT * FROM social_links ORDER BY sort_order ASC, id ASC').all()
  return { items: rows.map(mapSocialLink) }
})
