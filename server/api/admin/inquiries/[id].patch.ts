import { createError, getRouterParam, readBody } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { asBoolean } from '../../../utils/content'
import { getDb, touchNow } from '../../../utils/db'
import { mapInquiry } from '../../../utils/serializers'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const db = getDb()
  const current = db.prepare('SELECT id FROM inquiries WHERE id = ?').get(id)
  if (!current) throw createError({ statusCode: 404, statusMessage: 'Inquiry not found' })

  const timestamp = touchNow()
  if ('read' in body) {
    db.prepare('UPDATE inquiries SET read_at = ?, updated_at = ? WHERE id = ?').run(
      asBoolean(body.read) ? timestamp : null,
      timestamp,
      id,
    )
  }

  if ('handled' in body) {
    db.prepare('UPDATE inquiries SET handled_at = ?, updated_at = ? WHERE id = ?').run(
      asBoolean(body.handled) ? timestamp : null,
      timestamp,
      id,
    )
  }

  const row = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(id)
  return { item: mapInquiry(row) }
})
