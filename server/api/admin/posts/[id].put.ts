import { createError, getRouterParam, readBody } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { asString, sanitizePostHtml, slugify } from '../../../utils/content'
import { getDb, touchNow } from '../../../utils/db'
import { movePostSeoKey, upsertPostSeo } from '../../../utils/post-seo'
import { mapPost } from '../../../utils/serializers'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const title = asString(body?.title)
  const slug = slugify(asString(body?.slug) || title)
  const excerpt = asString(body?.excerpt)
  const contentHtml = sanitizePostHtml(asString(body?.contentHtml))
  const status = asString(body?.status, 'draft') === 'published' ? 'published' : 'draft'

  if (!title || !slug || !excerpt || !contentHtml) {
    throw createError({ statusCode: 400, statusMessage: '标题、Slug、摘要和正文必填' })
  }

  const db = getDb()
  const current = db.prepare('SELECT * FROM posts WHERE id = ?').get(id) as any
  if (!current) throw createError({ statusCode: 404, statusMessage: 'Article not found' })

  const conflict = db.prepare('SELECT id FROM posts WHERE slug = ? AND id <> ?').get(slug, id)
  if (conflict) throw createError({ statusCode: 409, statusMessage: 'Slug 已存在' })

  const timestamp = touchNow()
  const publishedAt =
    status === 'published'
      ? asString(body?.publishedAt) || current.published_at || timestamp
      : asString(body?.publishedAt)

  db.prepare(`
    UPDATE posts
    SET slug = ?, title = ?, excerpt = ?, cover_image = ?, content_html = ?, status = ?,
        published_at = ?, seo_title = ?, seo_description = ?, seo_keywords = ?,
        canonical = ?, updated_at = ?
    WHERE id = ?
  `).run(
    slug,
    title,
    excerpt,
    asString(body?.coverImage),
    contentHtml,
    status,
    publishedAt,
    asString(body?.seoTitle),
    asString(body?.seoDescription),
    asString(body?.seoKeywords),
    asString(body?.canonical),
    timestamp,
    id,
  )

  movePostSeoKey(current.slug, slug)
  upsertPostSeo({
    slug,
    title,
    excerpt,
    coverImage: asString(body?.coverImage),
    seoTitle: asString(body?.seoTitle),
    seoDescription: asString(body?.seoDescription),
    seoKeywords: asString(body?.seoKeywords),
    canonical: asString(body?.canonical),
  })

  const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(id)
  return { item: mapPost(row) }
})
