import { createError, getRouterParam } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { getDb } from '../../../utils/db'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const db = getDb()
  const row = db.prepare('SELECT slug FROM posts WHERE id = ?').get(id) as { slug: string } | undefined
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Article not found' })

  db.prepare('DELETE FROM posts WHERE id = ?').run(id)
  db.prepare('DELETE FROM seo_entries WHERE entry_key = ?').run(`post:${row.slug}`)

  return { ok: true }
})
