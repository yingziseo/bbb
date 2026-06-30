import { createError, getRouterParam, readBody } from 'h3'
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
import { moveProductSeoKey, upsertProductSeo } from '../../../utils/product-seo'
import { mapProduct } from '../../../utils/serializers'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const name = asString(body?.name)
  const slug = generatedSlug('product', body?.slug || name)
  const categoryId = Number(body?.categoryId || 0)
  const shortDesc = asString(body?.shortDesc)

  if (!id || !name || !slug || !categoryId || !shortDesc) {
    throw createError({ statusCode: 400, statusMessage: '产品名称、Slug、分类和简短描述必填' })
  }

  const db = getDb()
  const current = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any
  if (!current) throw createError({ statusCode: 404, statusMessage: '产品不存在' })

  const category = db.prepare('SELECT id, name FROM product_categories WHERE id = ?').get(categoryId) as
    | { id: number; name: string }
    | undefined
  if (!category) throw createError({ statusCode: 400, statusMessage: '请选择有效产品分类' })

  const conflict = db.prepare('SELECT id FROM products WHERE slug = ? AND id <> ?').get(slug, id)
  if (conflict) throw createError({ statusCode: 409, statusMessage: '产品 Slug 已存在' })

  const specs = normalizeSpecRows(body?.specs)
  const sizeOptions = normalizeSizeOptions(body?.sizeOptions)
  const applications = normalizeApplications(body?.applications)

  db.prepare(`
    UPDATE products
    SET category_id = ?, slug = ?, name = ?, short_desc = ?, image = ?, material = ?,
        moq = ?, custom = ?, packaging = ?, specs_json = ?, size_options_json = ?,
        applications_json = ?, sort_order = ?, status = ?, updated_at = ?
    WHERE id = ?
  `).run(
    categoryId,
    slug,
    name,
    shortDesc,
    asString(body?.image),
    asString(body?.material),
    asString(body?.moq),
    normalizeCustom(body?.custom),
    asString(body?.packaging),
    JSON.stringify(specs),
    JSON.stringify(sizeOptions),
    JSON.stringify(applications),
    asInteger(body?.sortOrder),
    normalizeStatus(body?.status),
    touchNow(),
    id,
  )

  moveProductSeoKey(current.slug, slug)
  const row = db.prepare(`${productListSelect} WHERE p.id = ?`).get(id)
  const item = mapProduct(row)
  upsertProductSeo({
    slug: item.slug,
    name: item.name,
    shortDesc: item.shortDesc,
    image: item.image,
    material: item.material,
    categoryName: category.name,
  })

  return { item }
})
