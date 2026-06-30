import { createError, getRouterParam } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { getDb } from '../../../utils/db'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const db = getDb()
  const row = db.prepare('SELECT slug FROM products WHERE id = ?').get(id) as { slug: string } | undefined
  if (!row) throw createError({ statusCode: 404, statusMessage: '产品不存在' })

  db.prepare('DELETE FROM products WHERE id = ?').run(id)
  db.prepare('DELETE FROM seo_entries WHERE entry_key = ?').run(`product:${row.slug}`)

  return { ok: true }
})
