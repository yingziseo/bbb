import { createError, getRouterParam } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { getDb } from '../../../utils/db'
import { mapSeo } from '../../../utils/serializers'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const row = getDb().prepare('SELECT * FROM seo_entries WHERE id = ?').get(id)
  if (!row) throw createError({ statusCode: 404, statusMessage: 'SEO entry not found' })
  return { item: mapSeo(row) }
})
