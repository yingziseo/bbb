import { getQuery } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { asString } from '../../../utils/content'
import { getDb } from '../../../utils/db'
import { productListSelect } from '../../../utils/product-catalog'
import { mapProduct } from '../../../utils/serializers'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const query = getQuery(event)
  const search = asString(query.q)
  const status = asString(query.status)
  const categoryId = Number(query.categoryId || 0)

  const where: string[] = []
  const params: Array<string | number> = []

  if (search) {
    where.push('(p.name LIKE ? OR p.slug LIKE ? OR p.material LIKE ?)')
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }

  if (status && ['draft', 'published'].includes(status)) {
    where.push('p.status = ?')
    params.push(status)
  }

  if (categoryId) {
    where.push('p.category_id = ?')
    params.push(categoryId)
  }

  const rows = getDb()
    .prepare(`
      ${productListSelect}
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY p.sort_order ASC, p.id DESC
    `)
    .all(...params)

  return { items: rows.map(mapProduct) }
})
