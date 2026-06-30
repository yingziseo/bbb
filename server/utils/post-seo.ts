import { company } from '../../app/data/site'
import { getDb, touchNow } from './db'

export const upsertPostSeo = (post: {
  slug: string
  title: string
  excerpt: string
  coverImage?: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  canonical?: string
}) => {
  const db = getDb()
  const timestamp = touchNow()
  const key = `post:${post.slug}`
  const existing = db.prepare('SELECT id FROM seo_entries WHERE entry_key = ?').get(key) as { id: number } | undefined
  const title = post.seoTitle || `${post.title} | ${company.name}`
  const description = post.seoDescription || post.excerpt

  if (existing) {
    db.prepare(`
      UPDATE seo_entries
      SET name = ?, path = ?, title = ?, description = ?, keywords = ?, canonical = ?,
          og_title = ?, og_description = ?, og_image = ?, updated_at = ?
      WHERE entry_key = ?
    `).run(
      `博客文章：${post.title}`,
      `/blog/${post.slug}`,
      title,
      description,
      post.seoKeywords || '',
      post.canonical || '',
      title,
      description,
      post.coverImage || '',
      timestamp,
      key,
    )
    return
  }

  db.prepare(`
    INSERT INTO seo_entries (
      entry_key, page_type, entity_slug, name, path, title, description, keywords,
      canonical, robots, og_title, og_description, og_image, created_at, updated_at
    )
    VALUES (?, 'post', ?, ?, ?, ?, ?, ?, ?, 'index,follow', ?, ?, ?, ?, ?)
  `).run(
    key,
    post.slug,
    `博客文章：${post.title}`,
    `/blog/${post.slug}`,
    title,
    description,
    post.seoKeywords || '',
    post.canonical || '',
    title,
    description,
    post.coverImage || '',
    timestamp,
    timestamp,
  )
}

export const movePostSeoKey = (oldSlug: string, nextSlug: string) => {
  if (oldSlug === nextSlug) return
  getDb()
    .prepare('UPDATE seo_entries SET entry_key = ?, entity_slug = ?, path = ?, updated_at = ? WHERE entry_key = ?')
    .run(`post:${nextSlug}`, nextSlug, `/blog/${nextSlug}`, touchNow(), `post:${oldSlug}`)
}
