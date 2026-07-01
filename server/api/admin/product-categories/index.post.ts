import { createError, readBody } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { asString } from '../../../utils/content'
import { asInteger, generatedSlug, normalizeEnabled } from '../../../utils/product-catalog'
import { getDb, touchNow } from '../../../utils/db'
import { mapProductCategory } from '../../../utils/serializers'
import { upsertCategorySeo } from '../../../utils/product-seo'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)
  const name = asString(body?.name)
  const slug = generatedSlug('category', body?.slug || name)

  if (!name || !slug) throw createError({ statusCode: 400, statusMessage: '分类名称和 Slug 必填' })

  const db = getDb()
  const exists = db.prepare('SELECT id FROM product_categories WHERE slug = ?').get(slug)
  if (exists) throw createError({ statusCode: 409, statusMessage: '分类 Slug 已存在' })

  const timestamp = touchNow()
  const result = db
    .prepare(`
      INSERT INTO product_categories (
        slug, name, description, image, seo_title, seo_description, seo_keywords, canonical,
        sort_order, enabled, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      slug,
      name,
      asString(body?.description),
      asString(body?.image),
      asString(body?.seoTitle),
      asString(body?.seoDescription),
      asString(body?.seoKeywords),
      asString(body?.canonical),
      asInteger(body?.sortOrder),
      normalizeEnabled(body?.enabled),
      timestamp,
      timestamp,
    )

  const row = db.prepare('SELECT * FROM product_categories WHERE id = ?').get(result.lastInsertRowid)
  const item = mapProductCategory(row)
  if (item.enabled) {
    upsertCategorySeo({
      slug: item.slug,
      name: item.name,
      description: item.description,
      image: item.image,
      seoTitle: item.seoTitle,
      seoDescription: item.seoDescription,
      seoKeywords: item.seoKeywords,
      canonical: item.canonical,
    })
  } else {
    db.prepare('DELETE FROM seo_entries WHERE entry_key = ?').run(`category:${item.slug}`)
  }

  return { item }
})
