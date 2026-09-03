import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'
import sanitizeHtml from 'sanitize-html'
import { batch } from './content-plan.mjs'
import { contentMetadata as articles } from './content-metadata.mjs'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(scriptDir, '..', '..', '..', '..')
const dbPath = process.env.SQLITE_PATH || join(projectRoot, 'data/yiyuan.db')
const articleDir = join(projectRoot, batch.articleDir)
const imageDir = join(projectRoot, 'public/images/blog')
const apply = process.argv.includes('--apply')
const publishTimeChina = '10:00'
const expectedOldDraftSlugs = [
  'private-label-cling-film-launch-timeline',
  'cling-film-trial-order-scorecard-reorder-decision',
]

const stripTags = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
const shorten = (value, max) => (
  value.length <= max
    ? value
    : `${value.slice(0, max - 1).replace(/\s+\S*$/, '').replace(/[.,;:!?]+$/, '')}.`
)

const sanitizePostHtml = (html) => sanitizeHtml(html, {
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    'h2', 'h3', 'h4', 'span', 'section', 'div', 'details', 'summary',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    a: ['href', 'name', 'target', 'rel'],
    '*': ['class', 'style'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, true),
  },
})

const chinaScheduleToUtc = (publishDate) => {
  const parsed = new Date(`${publishDate}T${publishTimeChina}:00+08:00`)
  if (Number.isNaN(parsed.getTime())) throw new Error(`Invalid publish date: ${publishDate}`)
  return parsed.toISOString()
}

if (articles.length !== 30) throw new Error(`Expected 30 articles, found ${articles.length}`)

const prepared = articles.map((article, index) => {
  if (article.number !== index + 97) throw new Error(`Unexpected article number ${article.number}`)
  const expectedDate = new Date(Date.UTC(2026, 8, 4 + index)).toISOString().slice(0, 10)
  if (article.publishDate !== expectedDate) {
    throw new Error(`Article ${article.number}: expected ${expectedDate}, found ${article.publishDate}`)
  }

  const sourcePath = join(articleDir, `${article.number}.html`)
  const coverFilename = `${article.slug}-cover.webp`
  const coverPath = join(imageDir, coverFilename)
  if (!existsSync(sourcePath)) throw new Error(`Missing article source: ${sourcePath}`)
  if (!existsSync(coverPath)) throw new Error(`Missing cover: ${coverPath}`)

  const sourceHtml = readFileSync(sourcePath, 'utf8')
  if (/<h1\b/i.test(sourceHtml)) throw new Error(`Article ${article.number}: H1 is not allowed`)
  if (/<(?:img|picture|figure)\b/i.test(sourceHtml)) {
    throw new Error(`Article ${article.number}: body images are not allowed in this batch`)
  }
  const firstParagraph = sourceHtml.match(/<p>([\s\S]*?)<\/p>/)?.[1] || ''
  const canonical = `/blog/${article.slug}`
  const scheduledPublishAt = chinaScheduleToUtc(article.publishDate)
  if (!scheduledPublishAt.endsWith('T02:00:00.000Z')) {
    throw new Error(`Article ${article.number}: timezone conversion failed: ${scheduledPublishAt}`)
  }

  return {
    ...article,
    excerpt: shorten(stripTags(firstParagraph), 190),
    contentHtml: sanitizePostHtml(sourceHtml),
    coverImage: `/images/blog/${coverFilename}`,
    canonical,
    scheduledPublishAt,
  }
})

if (new Set(prepared.map((article) => article.scheduledPublishAt)).size !== prepared.length) {
  throw new Error('Duplicate scheduled timestamps detected')
}

const db = new DatabaseSync(dbPath, { readOnly: !apply })
db.exec('PRAGMA foreign_keys = ON')

const schedulerSettings = Object.fromEntries(db.prepare(`
  SELECT key, value FROM site_settings
  WHERE key IN ('postSchedulerEnabled', 'postSchedulerStartTime', 'postSchedulerEndTime', 'postSchedulerDailyLimit')
`).all().map((row) => [row.key, row.value]))

if (schedulerSettings.postSchedulerEnabled !== 'true') throw new Error('Post scheduler is not enabled')
if (schedulerSettings.postSchedulerDailyLimit !== '1') throw new Error('Post scheduler daily limit is not 1')
if (publishTimeChina < schedulerSettings.postSchedulerStartTime || publishTimeChina > schedulerSettings.postSchedulerEndTime) {
  throw new Error(`10:00 China time is outside scheduler window ${schedulerSettings.postSchedulerStartTime}-${schedulerSettings.postSchedulerEndTime}`)
}

const oldDrafts = db.prepare(`
  SELECT id, slug, title, scheduled_publish_at
  FROM posts
  WHERE status = 'draft'
  ORDER BY id
`).all()
const actualOldSlugs = oldDrafts.map((row) => row.slug).sort()
const expectedOldSlugs = [...expectedOldDraftSlugs].sort()
if (JSON.stringify(actualOldSlugs) !== JSON.stringify(expectedOldSlugs)) {
  throw new Error(JSON.stringify({
    message: 'Draft set changed; refusing destructive replacement',
    expectedOldSlugs,
    actualOldSlugs,
  }))
}

const slugs = prepared.map((article) => article.slug)
const placeholders = slugs.map(() => '?').join(',')
const existingPosts = db.prepare(`SELECT slug FROM posts WHERE slug IN (${placeholders})`).all(...slugs)
const entryKeys = slugs.map((slug) => `post:${slug}`)
const existingSeo = db.prepare(`SELECT entry_key FROM seo_entries WHERE entry_key IN (${placeholders})`).all(...entryKeys)
if (existingPosts.length || existingSeo.length) {
  throw new Error(JSON.stringify({
    message: 'New batch contains existing slugs; refusing to overwrite',
    posts: existingPosts,
    seo: existingSeo,
  }))
}

if (apply) {
  const timestamp = new Date().toISOString()
  const deleteOldSeo = db.prepare(`DELETE FROM seo_entries WHERE entry_key = ? AND entity_slug = ? AND path = ?`)
  const deleteOldPost = db.prepare(`DELETE FROM posts WHERE id = ? AND slug = ? AND status = 'draft'`)
  const insertPost = db.prepare(`
    INSERT INTO posts (
      slug, title, excerpt, cover_image, content_html, status, published_at,
      scheduled_publish_at, published_by_scheduler_at, seo_title, seo_description,
      seo_keywords, canonical, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, 'draft', '', ?, '', ?, ?, ?, ?, ?, ?)
  `)
  const insertSeo = db.prepare(`
    INSERT INTO seo_entries (
      entry_key, page_type, entity_slug, name, path, title, description, keywords,
      canonical, robots, og_title, og_description, og_image, created_at, updated_at
    ) VALUES (?, 'post', ?, ?, ?, ?, ?, ?, ?, 'index,follow', ?, ?, ?, ?, ?)
  `)

  db.exec('BEGIN IMMEDIATE')
  try {
    for (const draft of oldDrafts) {
      const seoResult = deleteOldSeo.run(`post:${draft.slug}`, draft.slug, `/blog/${draft.slug}`)
      if (seoResult.changes !== 1) throw new Error(`Expected one SEO row for old draft ${draft.slug}`)
      const postResult = deleteOldPost.run(draft.id, draft.slug)
      if (postResult.changes !== 1) throw new Error(`Expected one post row for old draft ${draft.slug}`)
    }

    for (const article of prepared) {
      insertPost.run(
        article.slug, article.title, article.excerpt, article.coverImage,
        article.contentHtml, article.scheduledPublishAt, article.seoTitle,
        article.seoDescription, article.seoKeywords, article.canonical,
        timestamp, timestamp,
      )
      insertSeo.run(
        `post:${article.slug}`, article.slug, `博客文章：${article.title}`,
        article.canonical, article.seoTitle, article.seoDescription,
        article.seoKeywords, article.canonical, article.seoTitle,
        article.seoDescription, article.coverImage, timestamp, timestamp,
      )
    }
    db.exec('COMMIT')
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}

console.log(JSON.stringify({
  mode: apply ? 'apply' : 'dry-run',
  database: dbPath,
  oldDraftsToDelete: oldDrafts,
  newDraftsToInsert: prepared.length,
  publishTimezone: 'Asia/Shanghai',
  publishTimeChina,
  schedulerSettings,
  first: {
    number: prepared[0].number,
    title: prepared[0].title,
    china: `${prepared[0].publishDate} ${publishTimeChina}`,
    utc: prepared[0].scheduledPublishAt,
  },
  last: {
    number: prepared.at(-1).number,
    title: prepared.at(-1).title,
    china: `${prepared.at(-1).publishDate} ${publishTimeChina}`,
    utc: prepared.at(-1).scheduledPublishAt,
  },
}, null, 2))
