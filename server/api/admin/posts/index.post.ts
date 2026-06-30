import { createError, readBody } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { asString, sanitizePostHtml, slugify } from '../../../utils/content'
import { getDb, touchNow } from '../../../utils/db'
import { mapPost } from '../../../utils/serializers'
import { upsertPostSeo } from '../../../utils/post-seo'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
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
  const exists = db.prepare('SELECT id FROM posts WHERE slug = ?').get(slug)
  if (exists) throw createError({ statusCode: 409, statusMessage: 'Slug 已存在' })

  const timestamp = touchNow()
  const publishedAt = status === 'published' ? asString(body?.publishedAt) || timestamp : asString(body?.publishedAt)

  const result = db
    .prepare(`
      INSERT INTO posts (
        slug, title, excerpt, cover_image, content_html, status, published_at,
        seo_title, seo_description, seo_keywords, canonical, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
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
      timestamp,
    )

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

  const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid)
  return { item: mapPost(row) }
})
