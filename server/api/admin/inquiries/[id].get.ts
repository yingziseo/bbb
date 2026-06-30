import { createError, getRouterParam } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { getDb, touchNow } from '../../../utils/db'
import { mapInquiry } from '../../../utils/serializers'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const db = getDb()
  const current = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(id) as any
  if (!current) throw createError({ statusCode: 404, statusMessage: 'Inquiry not found' })

  if (!current.read_at) {
    db.prepare('UPDATE inquiries SET read_at = ?, updated_at = ? WHERE id = ?').run(touchNow(), touchNow(), id)
  }

  const row = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(id)
  return { item: mapInquiry(row) }
})
