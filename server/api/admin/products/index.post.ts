import { createError, readBody } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { asString } from '../../../utils/content'
import {
  asInteger,
  generatedSlug,
  normalizeApplications,
  normalizeCustom,
  normalizeSizeOptions,
  normalizeSpecRows,
  normalizeStatus,
  productListSelect,
} from '../../../utils/product-catalog'
import { getDb, touchNow } from '../../../utils/db'
import { upsertProductSeo } from '../../../utils/product-seo'
import { mapProduct } from '../../../utils/serializers'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)
  const name = asString(body?.name)
  const slug = generatedSlug('product', body?.slug || name)
  const categoryId = Number(body?.categoryId || 0)
  const shortDesc = asString(body?.shortDesc)

  if (!name || !slug || !categoryId || !shortDesc) {
    throw createError({ statusCode: 400, statusMessage: '产品名称、Slug、分类和简短描述必填' })
  }

  const db = getDb()
  const category = db.prepare('SELECT id, name FROM product_categories WHERE id = ?').get(categoryId) as
    | { id: number; name: string }
    | undefined
  if (!category) throw createError({ statusCode: 400, statusMessage: '请选择有效产品分类' })

  const exists = db.prepare('SELECT id FROM products WHERE slug = ?').get(slug)
  if (exists) throw createError({ statusCode: 409, statusMessage: '产品 Slug 已存在' })

  const timestamp = touchNow()
  const specs = normalizeSpecRows(body?.specs)
  const sizeOptions = normalizeSizeOptions(body?.sizeOptions)
  const applications = normalizeApplications(body?.applications)

  const result = db
    .prepare(`
      INSERT INTO products (
        category_id, slug, name, short_desc, image, material, moq, custom, packaging,
        seo_title, seo_description, seo_keywords, canonical,
        specs_json, size_options_json, applications_json, sort_order, status, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      categoryId,
      slug,
      name,
      shortDesc,
      asString(body?.image),
      asString(body?.material),
      asString(body?.moq),
      normalizeCustom(body?.custom),
      asString(body?.packaging),
      asString(body?.seoTitle),
      asString(body?.seoDescription),
      asString(body?.seoKeywords),
      asString(body?.canonical),
      JSON.stringify(specs),
      JSON.stringify(sizeOptions),
      JSON.stringify(applications),
      asInteger(body?.sortOrder),
      normalizeStatus(body?.status),
      timestamp,
      timestamp,
    )

  const row = db.prepare(`${productListSelect} WHERE p.id = ?`).get(result.lastInsertRowid)
  const item = mapProduct(row)
  if (item.status === 'published') {
    upsertProductSeo({
      slug: item.slug,
      name: item.name,
      shortDesc: item.shortDesc,
      image: item.image,
      material: item.material,
      categoryName: category.name,
      seoTitle: item.seoTitle,
      seoDescription: item.seoDescription,
      seoKeywords: item.seoKeywords,
      canonical: item.canonical,
    })
  } else {
    db.prepare('DELETE FROM seo_entries WHERE entry_key = ?').run(`product:${item.slug}`)
  }

  return { item }
})
