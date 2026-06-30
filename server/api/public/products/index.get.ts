import { getQuery } from 'h3'
import { asString } from '../../../utils/content'
import { getDb } from '../../../utils/db'
import { productListSelect } from '../../../utils/product-catalog'
import { mapProduct, mapProductCategory } from '../../../utils/serializers'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const category = asString(query.category)

  const categories = getDb()
    .prepare(`
      SELECT c.*, COUNT(p.id) AS product_count
      FROM product_categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.status = 'published'
      WHERE c.enabled = 1
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.id ASC
    `)
    .all()
    .map((row: any) => ({
      ...mapProductCategory(row),
      productCount: row.product_count || 0,
    }))

  const where = ["p.status = 'published'", 'c.enabled = 1']
  const params: string[] = []

  if (category && category !== 'all') {
    where.push('c.slug = ?')
    params.push(category)
  }

  const products = getDb()
    .prepare(`
      ${productListSelect}
      WHERE ${where.join(' AND ')}
      ORDER BY c.sort_order ASC, p.sort_order ASC, p.id DESC
    `)
    .all(...params)
    .map(mapProduct)

  return { categories, items: products }
})
