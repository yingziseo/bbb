import { createError, getRouterParam } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { getDb } from '../../../utils/db'
import { productListSelect } from '../../../utils/product-catalog'
import { mapProduct } from '../../../utils/serializers'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const row = getDb().prepare(`${productListSelect} WHERE p.id = ?`).get(id)
  if (!row) throw createError({ statusCode: 404, statusMessage: '产品不存在' })
  return { item: mapProduct(row) }
})
