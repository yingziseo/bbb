import { createError, getRouterParam } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { getDb } from '../../../utils/db'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const db = getDb()
  const current = db.prepare('SELECT id FROM friend_links WHERE id = ?').get(id)
  if (!current) throw createError({ statusCode: 404, statusMessage: 'Friend link not found' })

  db.prepare('DELETE FROM friend_links WHERE id = ?').run(id)
  return { ok: true }
})
