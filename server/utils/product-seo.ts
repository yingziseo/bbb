import { company } from '../../app/data/site'
import { getDb, touchNow } from './db'

export const upsertProductSeo = (product: {
  slug: string
  name: string
  shortDesc: string
  image?: string
  material?: string
  categoryName?: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  canonical?: string
}) => {
  const db = getDb()
  const timestamp = touchNow()
  const key = `product:${product.slug}`
  const existing = db.prepare('SELECT id FROM seo_entries WHERE entry_key = ?').get(key) as { id: number } | undefined
  const title = product.seoTitle || `${product.name} | ${company.name}`
  const description = product.seoDescription || product.shortDesc
  const keywords = product.seoKeywords || [product.name, product.categoryName, product.material].filter(Boolean).join(', ')
  const canonical = product.canonical || ''

  if (existing) {
    db.prepare(`
      UPDATE seo_entries
      SET name = ?, path = ?, title = ?, description = ?, keywords = ?,
          canonical = ?, og_title = ?, og_description = ?, og_image = ?, updated_at = ?
      WHERE entry_key = ?
    `).run(
      `产品详情：${product.name}`,
      `/products/${product.slug}`,
      title,
      description,
      keywords,
      canonical,
      title,
      description,
      product.image || '',
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
    VALUES (?, 'product', ?, ?, ?, ?, ?, ?, ?, 'index,follow', ?, ?, ?, ?, ?)
  `).run(
    key,
    product.slug,
    `产品详情：${product.name}`,
    `/products/${product.slug}`,
    title,
    description,
    keywords,
    canonical,
    title,
    description,
    product.image || '',
    timestamp,
    timestamp,
  )
}

export const moveProductSeoKey = (oldSlug: string, nextSlug: string) => {
  if (oldSlug === nextSlug) return
  getDb()
    .prepare('UPDATE seo_entries SET entry_key = ?, entity_slug = ?, path = ?, updated_at = ? WHERE entry_key = ?')
    .run(`product:${nextSlug}`, nextSlug, `/products/${nextSlug}`, touchNow(), `product:${oldSlug}`)
}

export const upsertCategorySeo = (category: {
  slug: string
  name: string
  description?: string
  image?: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  canonical?: string
}) => {
  const db = getDb()
  const timestamp = touchNow()
  const key = `category:${category.slug}`
  const existing = db.prepare('SELECT id FROM seo_entries WHERE entry_key = ?').get(key) as { id: number } | undefined
  const title = category.seoTitle || `${category.name} | Products | ${company.name}`
  const description = category.seoDescription || category.description || `Browse ${category.name} products from ${company.name}.`
  const keywords = category.seoKeywords || `${category.name}, food packaging products`
  const canonical = category.canonical || ''

  if (existing) {
    db.prepare(`
      UPDATE seo_entries
      SET name = ?, path = ?, title = ?, description = ?, keywords = ?,
          canonical = ?, og_title = ?, og_description = ?, og_image = ?, updated_at = ?
      WHERE entry_key = ?
    `).run(
      `产品分类：${category.name}`,
      `/products/category/${category.slug}`,
      title,
      description,
      keywords,
      canonical,
      title,
      description,
      category.image || '',
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
    VALUES (?, 'category', ?, ?, ?, ?, ?, ?, ?, 'index,follow', ?, ?, ?, ?, ?)
  `).run(
    key,
    category.slug,
    `产品分类：${category.name}`,
    `/products/category/${category.slug}`,
    title,
    description,
    keywords,
    canonical,
    title,
    description,
    category.image || '',
    timestamp,
    timestamp,
  )
}

export const moveCategorySeoKey = (oldSlug: string, nextSlug: string) => {
  if (oldSlug === nextSlug) return
  getDb()
    .prepare('UPDATE seo_entries SET entry_key = ?, entity_slug = ?, path = ?, updated_at = ? WHERE entry_key = ?')
    .run(`category:${nextSlug}`, nextSlug, `/products/category/${nextSlug}`, touchNow(), `category:${oldSlug}`)
}
