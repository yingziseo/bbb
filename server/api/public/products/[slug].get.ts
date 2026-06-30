import { createError, getRouterParam } from 'h3'
import { getDb } from '../../../utils/db'
import { productListSelect } from '../../../utils/product-catalog'
import { mapProduct } from '../../../utils/serializers'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  const row = getDb()
    .prepare(`
      ${productListSelect}
      WHERE p.slug = ? AND p.status = 'published' AND c.enabled = 1
    `)
    .get(slug)

  if (!row) throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  return { item: mapProduct(row) }
})
