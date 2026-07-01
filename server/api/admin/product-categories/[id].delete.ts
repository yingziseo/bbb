import { createError, getRouterParam } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { getDb } from '../../../utils/db'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const db = getDb()
  const category = db.prepare('SELECT id, slug FROM product_categories WHERE id = ?').get(id) as { id: number; slug: string } | undefined
  if (!category) throw createError({ statusCode: 404, statusMessage: '分类不存在' })

  const count = db.prepare('SELECT COUNT(*) AS count FROM products WHERE category_id = ?').get(id) as { count: number }
  if (count.count > 0) {
    throw createError({ statusCode: 409, statusMessage: '该分类下还有产品，不能删除' })
  }

  db.prepare('DELETE FROM product_categories WHERE id = ?').run(id)
  db.prepare('DELETE FROM seo_entries WHERE entry_key = ?').run(`category:${category.slug}`)
  return { ok: true }
})
