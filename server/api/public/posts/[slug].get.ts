import { createError, getRouterParam } from 'h3'
import { getDb } from '../../../utils/db'
import { mapPost } from '../../../utils/serializers'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  const row = getDb()
    .prepare("SELECT * FROM posts WHERE slug = ? AND status = 'published'")
    .get(slug)

  if (!row) throw createError({ statusCode: 404, statusMessage: 'Article not found' })

  return { item: mapPost(row) }
})
