import { createError, getRouterParam, readBody } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { asString } from '../../../utils/content'
import { asInteger, generatedSlug, normalizeEnabled } from '../../../utils/product-catalog'
import { getDb, touchNow } from '../../../utils/db'
import { mapProductCategory } from '../../../utils/serializers'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const name = asString(body?.name)
  const slug = generatedSlug('category', body?.slug || name)

  if (!id || !name || !slug) throw createError({ statusCode: 400, statusMessage: '分类名称和 Slug 必填' })

  const db = getDb()
  const current = db.prepare('SELECT * FROM product_categories WHERE id = ?').get(id)
  if (!current) throw createError({ statusCode: 404, statusMessage: '分类不存在' })

  const conflict = db.prepare('SELECT id FROM product_categories WHERE slug = ? AND id <> ?').get(slug, id)
  if (conflict) throw createError({ statusCode: 409, statusMessage: '分类 Slug 已存在' })

  db.prepare(`
    UPDATE product_categories
    SET slug = ?, name = ?, description = ?, image = ?, sort_order = ?, enabled = ?, updated_at = ?
    WHERE id = ?
  `).run(
    slug,
    name,
    asString(body?.description),
    asString(body?.image),
    asInteger(body?.sortOrder),
    normalizeEnabled(body?.enabled),
    touchNow(),
    id,
  )

  const row = db.prepare('SELECT * FROM product_categories WHERE id = ?').get(id)
  return { item: mapProductCategory(row) }
})
