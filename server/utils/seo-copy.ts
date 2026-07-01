import { company } from '../../app/data/site'

export const seoBrand = 'YIYUAN'
export const seoCompanyName = company.name

const cleanText = (value = '') => value.replace(/\s+/g, ' ').trim()

export const makeProductSeoTitle = (product: {
  name: string
  categoryName?: string
}) => {
  const name = cleanText(product.name)
  const category = cleanText(product.categoryName || '').toLowerCase()
  const haystack = `${name} ${category}`.toLowerCase()

  if (/(cling|wrap|film)/.test(haystack)) {
    return `${name} Manufacturer | Wholesale Food Wrap Film | ${seoBrand}`
  }

  if (/(cup)/.test(haystack)) {
    return `${name} Manufacturer | Custom Food Packaging | ${seoBrand}`
  }

  if (/(printed|custom)/.test(haystack)) {
    return `${name} Supplier | Custom Printed Food Boxes | ${seoBrand}`
  }

  if (/(container|box|clamshell|meal|bento|deli)/.test(haystack)) {
    return `${name} Manufacturer | Disposable Food Containers | ${seoBrand}`
  }

  return `${name} Manufacturer in China | ${seoBrand}`
}

export const makeProductSeoDescription = (product: {
  name: string
  shortDesc?: string
}) => {
  const name = cleanText(product.name)
  const shortDesc = cleanText(product.shortDesc || '')
  const intro = `Wholesale ${name} from ${seoBrand}, a China food packaging factory.`
  const detail = shortDesc ? ` ${shortDesc}` : ''
  return `${intro}${detail} OEM sizes, private-label packaging and bulk export quotes available.`
}

export const makeProductSeoKeywords = (product: {
  name: string
  categoryName?: string
  material?: string
}) =>
  [
    product.name,
    product.categoryName,
    product.material,
    'wholesale food packaging',
    'OEM packaging factory',
    'China packaging supplier',
  ]
    .map((item) => cleanText(item || ''))
    .filter(Boolean)
    .join(', ')

export const makeCategorySeoTitle = (category: {
  name: string
  slug?: string
}) => {
  const name = cleanText(category.name)
  const haystack = `${name} ${category.slug || ''}`.toLowerCase()

  if (/(cling|wrap|film)/.test(haystack)) {
    return `Cling Film Manufacturer in China | Food Wrap OEM | ${seoBrand}`
  }

  if (/(meal|box|container|disposable)/.test(haystack)) {
    return `Disposable Food Containers Factory in China | ${seoBrand}`
  }

  return `${name} Manufacturer in China | Wholesale & OEM | ${seoBrand}`
}

export const makeCategorySeoDescription = (category: {
  name: string
  description?: string
}) => {
  const name = cleanText(category.name)
  const description = cleanText(category.description || '')
  const suffix = 'Importers, wholesale, OEM/ODM, private-label packaging and export quotes available.'
  return description ? `${description} ${suffix}` : `Shop ${name} from ${seoBrand}, a China food packaging factory. ${suffix}`
}

export const makeCategorySeoKeywords = (category: {
  name: string
  slug?: string
}) => {
  const haystack = `${category.name} ${category.slug || ''}`.toLowerCase()
  const base = /(cling|wrap|film)/.test(haystack)
    ? ['cling film manufacturer', 'food wrap wholesale', 'fresh wrap supplier']
    : ['disposable food containers', 'food container factory', 'meal box manufacturer']

  return [category.name, ...base, 'OEM ODM food packaging', 'China packaging factory']
    .map((item) => cleanText(item))
    .filter(Boolean)
    .join(', ')
}
