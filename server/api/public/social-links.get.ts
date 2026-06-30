import { getDb } from '../../utils/db'
import { mapSocialLink } from '../../utils/serializers'

export default defineEventHandler(() => {
  const rows = getDb()
    .prepare('SELECT * FROM social_links WHERE enabled = 1 ORDER BY sort_order ASC, id ASC')
    .all()

  return { items: rows.map(mapSocialLink) }
})
