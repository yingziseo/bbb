import { createError, getRouterParam } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { getDb } from '../../../utils/db'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const result = getDb().prepare('DELETE FROM inquiries WHERE id = ?').run(id)
  if (!result.changes) throw createError({ statusCode: 404, statusMessage: 'Inquiry not found' })
  return { ok: true }
})
