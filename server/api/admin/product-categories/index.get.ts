import { requireAdmin } from '../../../utils/auth'
import { getDb } from '../../../utils/db'
import { mapProductCategory } from '../../../utils/serializers'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const rows = getDb()
    .prepare(`
      SELECT c.*, COUNT(p.id) AS product_count
      FROM product_categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.id ASC
    `)
    .all()

  return {
    items: rows.map((row: any) => ({
      ...mapProductCategory(row),
      productCount: row.product_count || 0,
    })),
  }
})
