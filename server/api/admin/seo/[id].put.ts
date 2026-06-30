import { createError, getRouterParam, readBody } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { asString } from '../../../utils/content'
import { getDb, touchNow } from '../../../utils/db'
import { mapSeo } from '../../../utils/serializers'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const title = asString(body?.title)
  const description = asString(body?.description)

  if (!title || !description) {
    throw createError({ statusCode: 400, statusMessage: 'Title 和 Description 必填' })
  }

  const db = getDb()
  db.prepare(`
    UPDATE seo_entries
    SET title = ?, description = ?, keywords = ?, canonical = ?, robots = ?,
        og_title = ?, og_description = ?, og_image = ?, updated_at = ?
    WHERE id = ?
  `).run(
    title,
    description,
    asString(body?.keywords),
    asString(body?.canonical),
    asString(body?.robots, 'index,follow') || 'index,follow',
    asString(body?.ogTitle) || title,
    asString(body?.ogDescription) || description,
    asString(body?.ogImage),
    touchNow(),
    id,
  )

  const row = db.prepare('SELECT * FROM seo_entries WHERE id = ?').get(id)
  if (!row) throw createError({ statusCode: 404, statusMessage: 'SEO entry not found' })

  return { item: mapSeo(row) }
})
