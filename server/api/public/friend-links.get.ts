import { getDb } from '../../utils/db'
import { mapFriendLink } from '../../utils/serializers'

export default defineEventHandler(() => {
  const rows = getDb()
    .prepare(`
      SELECT *
      FROM friend_links
      WHERE enabled = 1 AND TRIM(url) != ''
      ORDER BY sort_order ASC, id ASC
    `)
    .all()

  return { items: rows.map(mapFriendLink) }
})
