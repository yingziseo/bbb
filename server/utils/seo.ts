import type { H3Event } from 'h3'
import { getDb } from './db'
import { mapSeo } from './serializers'
import { getSiteSettings, toAbsoluteSiteUrl } from './site-settings'
import { getBuyerGuide } from '../../app/data/buyer-guides'

const absoluteUrl = (path = '', event?: H3Event) => {
  return toAbsoluteSiteUrl(path, event)
}

export const getSeoByKey = (key: string) => {
  const row = getDb().prepare('SELECT * FROM seo_entries WHERE entry_key = ?').get(key)
  return row ? mapSeo(row) : null
}

export const buildStructuredData = (seo: ReturnType<typeof mapSeo>, event?: H3Event) => {
  const settings = getSiteSettings()
  const url = absoluteUrl(seo.canonical || seo.path, event)
  const logo = absoluteUrl(settings.logoPath || '/site-logo.png', event)

  if (seo.pageType === 'product' && seo.entitySlug) {
    const product = getDb()
      .prepare(`
        SELECT p.name, p.short_desc, p.image, p.material, c.name AS category_name
        FROM products p
        JOIN product_categories c ON c.id = p.category_id
        WHERE p.slug = ?
      `)
      .get(seo.entitySlug) as
      | {
          name: string
          short_desc: string
          image: string
          material: string
          category_name: string
        }
      | undefined
    if (!product) return null

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: seo.description || product.short_desc,
      image: absoluteUrl(seo.ogImage || product.image, event),
      category: product.category_name,
      material: product.material,
      brand: {
        '@type': 'Brand',
        name: settings.displayName,
      },
      url,
    }
  }

  if (seo.pageType === 'post' && seo.entitySlug) {
    const row = getDb()
      .prepare('SELECT title, excerpt, cover_image, published_at, updated_at FROM posts WHERE slug = ?')
      .get(seo.entitySlug) as any
    if (!row) return null

    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: row.title,
      description: row.excerpt,
      image: absoluteUrl(row.cover_image || seo.ogImage, event),
      datePublished: row.published_at,
      dateModified: row.updated_at,
      author: {
        '@type': 'Organization',
        name: settings.displayName,
      },
      publisher: {
        '@type': 'Organization',
        name: settings.displayName,
        logo: logo
          ? {
              '@type': 'ImageObject',
              url: logo,
            }
          : undefined,
      },
      url,
    }
  }

  if (seo.pageType === 'buyer-guide' && seo.entitySlug) {
    const guide = getBuyerGuide(seo.entitySlug)
    if (!guide) return null

    const article = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guide.title,
      description: seo.description || guide.description,
      image: absoluteUrl(seo.ogImage || guide.coverImage, event),
      datePublished: seo.createdAt,
      dateModified: seo.updatedAt,
      author: {
        '@type': 'Organization',
        name: settings.displayName,
        url: absoluteUrl('/about', event),
      },
      publisher: {
        '@type': 'Organization',
        name: settings.displayName,
        logo: logo ? { '@type': 'ImageObject', url: logo } : undefined,
      },
      mainEntityOfPage: url,
      url,
    }

    return [
      article,
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/', event) },
          { '@type': 'ListItem', position: 2, name: 'Products', item: absoluteUrl('/products', event) },
          { '@type': 'ListItem', position: 3, name: guide.title, item: url },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: guide.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ]
  }

  if (seo.key === 'page:home' || seo.path === '/') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: settings.name,
      alternateName: settings.displayName,
      url,
      logo,
      email: settings.email,
      telephone: settings.phone,
      address: settings.address,
    }
  }

  return null
}
