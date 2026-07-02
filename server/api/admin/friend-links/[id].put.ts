import { createError, getRouterParam, readBody } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { asBoolean, asString } from '../../../utils/content'
import { getDb, touchNow } from '../../../utils/db'
import { mapFriendLink } from '../../../utils/serializers'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const name = asString(body?.name)
  const url = asString(body?.url)

  if (!name || !url) {
    throw createError({ statusCode: 400, statusMessage: 'Name and URL are required' })
  }

  const db = getDb()
  const current = db.prepare('SELECT id FROM friend_links WHERE id = ?').get(id)
  if (!current) throw createError({ statusCode: 404, statusMessage: 'Friend link not found' })

  db.prepare(`
    UPDATE friend_links
    SET name = ?, url = ?, description = ?, enabled = ?, sort_order = ?, new_window = ?, updated_at = ?
    WHERE id = ?
  `).run(
    name,
    url,
    asString(body?.description),
    asBoolean(body?.enabled, true) ? 1 : 0,
    Number(body?.sortOrder || 0),
    asBoolean(body?.newWindow, true) ? 1 : 0,
    touchNow(),
    id,
  )

  const row = db.prepare('SELECT * FROM friend_links WHERE id = ?').get(id)
  return { item: mapFriendLink(row) }
})
