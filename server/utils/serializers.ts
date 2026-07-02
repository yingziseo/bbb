export const toBool = (value: unknown) => value === 1 || value === true

export const mapSeo = (row: any) => ({
  id: row.id,
  key: row.entry_key,
  pageType: row.page_type,
  entitySlug: row.entity_slug,
  name: row.name,
  path: row.path,
  title: row.title,
  description: row.description,
  keywords: row.keywords || '',
  canonical: row.canonical || '',
  robots: row.robots || 'index,follow',
  ogTitle: row.og_title || '',
  ogDescription: row.og_description || '',
  ogImage: row.og_image || '',
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const mapPost = (row: any) => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt,
  coverImage: row.cover_image || '',
  contentHtml: row.content_html,
  status: row.status,
  publishedAt: row.published_at || '',
  seoTitle: row.seo_title || '',
  seoDescription: row.seo_description || '',
  seoKeywords: row.seo_keywords || '',
  canonical: row.canonical || '',
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const mapInquiry = (row: any) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  country: row.country || '',
  message: row.message,
  mailStatus: row.mail_status,
  mailError: row.mail_error || '',
  mailProvider: row.mail_provider || '',
  mailTo: row.mail_to || '',
  mailMessageId: row.mail_message_id || '',
  mailAttempts: row.mail_attempts || 0,
  lastMailAttemptAt: row.last_mail_attempt_at || '',
  nextMailAttemptAt: row.next_mail_attempt_at || '',
  forwardedAt: row.forwarded_at || '',
  readAt: row.read_at || '',
  handledAt: row.handled_at || '',
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const mapSocialLink = (row: any) => ({
  id: row.id,
  platformKey: row.platform_key,
  name: row.name,
  url: row.url || '',
  enabled: toBool(row.enabled),
  sortOrder: row.sort_order,
  newWindow: toBool(row.new_window),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

const parseJsonArray = (value: unknown) => {
  if (!value || typeof value !== 'string') return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const mapProductCategory = (row: any) => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  description: row.description || '',
  image: row.image || '',
  seoTitle: row.seo_title || '',
  seoDescription: row.seo_description || '',
  seoKeywords: row.seo_keywords || '',
  canonical: row.canonical || '',
  sortOrder: row.sort_order || 0,
  enabled: toBool(row.enabled),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const mapProduct = (row: any) => ({
  id: row.id,
  categoryId: row.category_id,
  categorySlug: row.category_slug || '',
  category: row.category_name || '',
  slug: row.slug,
  name: row.name,
  shortDesc: row.short_desc || '',
  image: row.image || '',
  material: row.material || '',
  moq: row.moq || '',
  custom: toBool(row.custom),
  packaging: row.packaging || '',
  seoTitle: row.seo_title || '',
  seoDescription: row.seo_description || '',
  seoKeywords: row.seo_keywords || '',
  canonical: row.canonical || '',
  specs: parseJsonArray(row.specs_json),
  sizeOptions: parseJsonArray(row.size_options_json),
  applications: parseJsonArray(row.applications_json),
  sortOrder: row.sort_order || 0,
  status: row.status || 'published',
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})
