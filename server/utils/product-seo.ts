import { company } from '../../app/data/site'
import { getDb, touchNow } from './db'

export const upsertProductSeo = (product: {
  slug: string
  name: string
  shortDesc: string
  image?: string
  material?: string
  categoryName?: string
}) => {
  const db = getDb()
  const timestamp = touchNow()
  const key = `product:${product.slug}`
  const existing = db.prepare('SELECT id FROM seo_entries WHERE entry_key = ?').get(key) as { id: number } | undefined
  const title = `${product.name} | ${company.name}`
  const description = product.shortDesc
  const keywords = [product.name, product.categoryName, product.material].filter(Boolean).join(', ')

  if (existing) {
    db.prepare(`
      UPDATE seo_entries
      SET name = ?, path = ?, title = ?, description = ?, keywords = ?,
          og_title = ?, og_description = ?, og_image = ?, updated_at = ?
      WHERE entry_key = ?
    `).run(
      `产品详情：${product.name}`,
      `/products/${product.slug}`,
      title,
      description,
      keywords,
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
    VALUES (?, 'product', ?, ?, ?, ?, ?, ?, '', 'index,follow', ?, ?, ?, ?, ?)
  `).run(
    key,
    product.slug,
    `产品详情：${product.name}`,
    `/products/${product.slug}`,
    title,
    description,
    keywords,
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
