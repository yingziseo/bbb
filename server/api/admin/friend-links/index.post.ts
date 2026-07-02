import { createError, readBody } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { asBoolean, asString } from '../../../utils/content'
import { getDb, touchNow } from '../../../utils/db'
import { mapFriendLink } from '../../../utils/serializers'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)
  const name = asString(body?.name)
  const url = asString(body?.url)

  if (!name || !url) {
    throw createError({ statusCode: 400, statusMessage: 'Name and URL are required' })
  }

  const timestamp = touchNow()
  const db = getDb()
  const result = db
    .prepare(`
      INSERT INTO friend_links (
        name, url, description, enabled, sort_order, new_window, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      name,
      url,
      asString(body?.description),
      asBoolean(body?.enabled, true) ? 1 : 0,
      Number(body?.sortOrder || 0),
      asBoolean(body?.newWindow, true) ? 1 : 0,
      timestamp,
      timestamp,
    )

  const row = db.prepare('SELECT * FROM friend_links WHERE id = ?').get(result.lastInsertRowid)
  return { item: mapFriendLink(row) }
})
