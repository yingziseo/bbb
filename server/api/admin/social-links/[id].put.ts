import { createError, getRouterParam, readBody } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { asBoolean, asString } from '../../../utils/content'
import { getDb, touchNow } from '../../../utils/db'
import { mapSocialLink } from '../../../utils/serializers'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const db = getDb()
  const current = db.prepare('SELECT id FROM social_links WHERE id = ?').get(id)
  if (!current) throw createError({ statusCode: 404, statusMessage: 'Social link not found' })

  db.prepare(`
    UPDATE social_links
    SET url = ?, enabled = ?, sort_order = ?, new_window = ?, updated_at = ?
    WHERE id = ?
  `).run(
    asString(body?.url),
    asBoolean(body?.enabled, true) ? 1 : 0,
    Number(body?.sortOrder || 0),
    asBoolean(body?.newWindow, true) ? 1 : 0,
    touchNow(),
    id,
  )

  const row = db.prepare('SELECT * FROM social_links WHERE id = ?').get(id)
  return { item: mapSocialLink(row) }
})
