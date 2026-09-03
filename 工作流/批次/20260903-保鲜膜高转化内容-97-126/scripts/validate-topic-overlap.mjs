import { DatabaseSync } from 'node:sqlite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { batch, contentPlan } from './content-plan.mjs'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(scriptDir, '..', '..', '..', '..')
const dbPath = process.env.SQLITE_PATH || resolve(projectRoot, 'data/yiyuan.db')
const siteUrl = process.env.SITE_URL || 'https://yiyuanpack.com'

const normalize = (value) => String(value || '')
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()

const genericTokens = new Set([
  'a', 'an', 'and', 'before', 'buyer', 'buyers', 'buying', 'check', 'checklist',
  'choose', 'choosing', 'cling', 'commercial', 'film', 'food', 'for', 'from',
  'guide', 'how', 'import', 'importers', 'of', 'order', 'plastic', 'roll', 'rolls',
  'supplier', 'the', 'to', 'vs', 'what', 'with', 'wrap', 'wrapping', 'yiyuan',
])

const tokens = (value) => new Set(normalize(value).split(' ').filter((token) => token && !genericTokens.has(token)))
const jaccard = (left, right) => {
  const a = tokens(left)
  const b = tokens(right)
  if (!a.size || !b.size) return 0
  const intersection = [...a].filter((token) => b.has(token)).length
  return intersection / new Set([...a, ...b]).size
}

const unique = (values) => values.length === new Set(values).size
const addDays = (date, days) => {
  const parsed = new Date(`${date}T00:00:00Z`)
  parsed.setUTCDate(parsed.getUTCDate() + days)
  return parsed.toISOString().slice(0, 10)
}

const db = new DatabaseSync(dbPath, { readOnly: true })
const existing = db.prepare(`
  SELECT id, slug, title, excerpt, status, seo_title, seo_keywords,
         scheduled_publish_at, content_html
  FROM posts
  ORDER BY id
`).all()
db.close()

const liveItems = []
let liveTotal = 0
let totalPages = 1
for (let page = 1; page <= totalPages; page += 1) {
  const response = await fetch(`${siteUrl}/api/public/posts?page=${page}&pageSize=24`)
  if (!response.ok) throw new Error(`Live posts API failed: ${response.status} page ${page}`)
  const payload = await response.json()
  liveTotal = payload.total
  totalPages = payload.totalPages
  liveItems.push(...payload.items)
}

const errors = []
const warnings = []
const published = existing.filter((item) => item.status === 'published')
const liveSlugs = new Set(liveItems.map((item) => item.slug))
const publishedSlugs = new Set(published.map((item) => item.slug))

if (liveTotal !== liveItems.length) errors.push(`live total ${liveTotal} != fetched ${liveItems.length}`)
if (published.length !== liveItems.length) errors.push(`database published ${published.length} != live ${liveItems.length}`)
for (const slug of liveSlugs) if (!publishedSlugs.has(slug)) errors.push(`live-only slug: ${slug}`)
for (const slug of publishedSlugs) if (!liveSlugs.has(slug)) errors.push(`database-only published slug: ${slug}`)

const plannedFields = {
  numbers: contentPlan.map((item) => item.number),
  dates: contentPlan.map((item) => item.publishDate),
  slugs: contentPlan.map((item) => normalize(item.slug)),
  titles: contentPlan.map((item) => normalize(item.title)),
  keywords: contentPlan.map((item) => normalize(item.primaryKeyword)),
  tasks: contentPlan.map((item) => normalize(item.searchTask)),
}

for (const [field, values] of Object.entries(plannedFields)) {
  if (!unique(values)) errors.push(`duplicate planned ${field}`)
}

contentPlan.forEach((item, index) => {
  if (item.number !== 97 + index) errors.push(`${item.number}: article number is not contiguous`)
  if (item.publishDate !== addDays(batch.scheduleStart, index)) errors.push(`${item.number}: publish date is not contiguous`)
  if (item.business !== 'cling-film') errors.push(`${item.number}: non-cling-film business ${item.business}`)
  if (item.bodyImageCount !== 0 || item.bodyImageThemes.length !== 0) errors.push(`${item.number}: cover-only batch contains body image plan`)
  if (!item.nearestExistingPost || !existing.some((row) => row.slug === item.nearestExistingPost)) {
    errors.push(`${item.number}: nearest existing post is missing: ${item.nearestExistingPost}`)
  }
  if (item.differentiation.length < 60 || /different angle|more detail|more comprehensive/i.test(item.differentiation)) {
    errors.push(`${item.number}: differentiation is not specific enough`)
  }
})

const existingSlugs = new Set(existing.map((item) => normalize(item.slug)))
const existingTitles = new Set(existing.map((item) => normalize(item.title)))
const existingKeywords = new Set(existing.flatMap((item) => String(item.seo_keywords || '').split(',').map(normalize).filter(Boolean)))

for (const item of contentPlan) {
  if (existingSlugs.has(normalize(item.slug))) errors.push(`${item.number}: slug already exists: ${item.slug}`)
  if (existingTitles.has(normalize(item.title))) errors.push(`${item.number}: title already exists: ${item.title}`)
  if (existingKeywords.has(normalize(item.primaryKeyword))) errors.push(`${item.number}: primary keyword already exists: ${item.primaryKeyword}`)
}

const nearestRows = contentPlan.map((item) => {
  const candidateText = [item.title, item.primaryKeyword, ...item.longTailKeywords, item.searchTask, item.funnelStage].join(' ')
  const comparisons = existing.map((row) => {
    const headings = [...String(row.content_html || '').matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)]
      .map((match) => match[1].replace(/<[^>]+>/g, ' '))
      .join(' ')
    const existingText = [row.title, row.seo_title, row.seo_keywords, row.excerpt, headings].join(' ')
    return { slug: row.slug, score: jaccard(candidateText, existingText) }
  }).sort((a, b) => b.score - a.score)

  const lexicalNearest = comparisons[0]
  if (lexicalNearest.score >= 0.5) {
    warnings.push(`${item.number}: high lexical overlap ${lexicalNearest.score.toFixed(3)} with ${lexicalNearest.slug}; manual intent gate required`)
  }
  return {
    number: item.number,
    plannedNearest: item.nearestExistingPost,
    lexicalNearest: lexicalNearest.slug,
    score: Number(lexicalNearest.score.toFixed(3)),
  }
})

console.log(JSON.stringify({
  batchId: batch.batchId,
  databaseArticles: existing.length,
  databasePublished: published.length,
  livePublished: liveItems.length,
  planned: contentPlan.length,
  dateRange: [contentPlan[0].publishDate, contentPlan.at(-1).publishDate],
  errors,
  warnings,
  nearestRows,
}, null, 2))

if (errors.length) process.exitCode = 1
