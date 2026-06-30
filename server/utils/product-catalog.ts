import { asBoolean, asString, slugify } from './content'

export const productListSelect = `
  SELECT
    p.*,
    c.slug AS category_slug,
    c.name AS category_name
  FROM products p
  JOIN product_categories c ON c.id = p.category_id
`

export const generatedSlug = (prefix: string, value: unknown) => {
  const slug = slugify(asString(value))
  return slug || `${prefix}-${Date.now()}`
}

export const asInteger = (value: unknown, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback
}

export const normalizeStatus = (value: unknown) => (asString(value, 'published') === 'draft' ? 'draft' : 'published')

export const normalizeEnabled = (value: unknown) => (asBoolean(value, true) ? 1 : 0)

export const normalizeCustom = (value: unknown) => (asBoolean(value, true) ? 1 : 0)

export const normalizeSpecRows = (value: unknown) => {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => ({
      label: asString((item as any)?.label),
      value: asString((item as any)?.value),
    }))
    .filter((item) => item.label || item.value)
}

export const normalizeSizeOptions = (value: unknown) => {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => ({
      label: asString((item as any)?.label),
      value: asString((item as any)?.value),
      packaging: asString((item as any)?.packaging),
    }))
    .filter((item) => item.label || item.value || item.packaging)
}

export const normalizeApplications = (value: unknown) => {
  if (!Array.isArray(value)) return []
  return value.map((item) => asString(item)).filter(Boolean)
}
