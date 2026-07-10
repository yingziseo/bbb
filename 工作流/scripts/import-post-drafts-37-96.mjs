import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import sanitizeHtml from 'sanitize-html'
import { contentMetadata37To96 as articles } from './content-metadata-37-96.mjs'

const root = '/root/bbb'
const dbPath = process.env.SQLITE_PATH || join(root, 'data/yiyuan.db')
const articleDir = join(root, '工作流/文章/两个月60篇-37-96')
const publicImageDir = join(root, 'public/images/blog')
const apply = process.argv.includes('--apply')

const now = () => new Date().toISOString()
const stripTags = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
const shorten = (value, max) => (
  value.length <= max
    ? value
    : `${value.slice(0, max - 1).replace(/\s+\S*$/, '').replace(/[.,;:!?]+$/, '')}.`
)
const escapeHtml = (value) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

const deterministicScheduleIso = ({ plannedDate, slug }) => {
  let hash = 2166136261
  for (const char of slug) {
    hash ^= char.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  const daytimeMinutes = 9 * 60 + (Math.abs(hash) % 511)
  const hour = Math.floor(daytimeMinutes / 60)
  const minute = daytimeMinutes % 60
  const [year, month, day] = plannedDate.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day, hour - 8, minute, 0)).toISOString()
}

const figureHtml = ({ slug, index, alt }) => {
  const caption = shorten(alt.trim().replace(/\.$/, ''), 120)
  const normalizedCaption = caption.charAt(0).toUpperCase() + caption.slice(1)
  return `<figure class="yy-figure">
  <img src="/images/blog/${slug}-${index}.webp" alt="${escapeHtml(alt)}" width="1200" height="675" loading="lazy" decoding="async">
  <figcaption>${escapeHtml(normalizedCaption)}.</figcaption>
</figure>`
}

const replaceImagePlans = (sourceHtml, article) => {
  const seen = []
  const contentHtml = sourceHtml.replace(
    /<!--\s*Image plan\s+(\d+)-(0[1-3]):[\s\S]*?Suggested alt:\s*"([^"]+)"\s*-->/g,
    (_match, number, index, alt) => {
      if (Number(number) !== article.number) {
        throw new Error(`Article ${article.number}: mismatched image-plan number ${number}`)
      }
      seen.push(index)
      return figureHtml({ slug: article.slug, index, alt })
    },
  )

  const expectedIndexes = Array.from(
    { length: article.bodyImageCount },
    (_, index) => String(index + 1).padStart(2, '0'),
  )
  if (JSON.stringify(seen) !== JSON.stringify(expectedIndexes)) {
    throw new Error(
      `Article ${article.number}: expected image plans ${expectedIndexes.join(',')}, found ${seen.join(',')}`,
    )
  }
  return contentHtml
}

const sanitizePostHtml = (html) => sanitizeHtml(html, {
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    'img', 'h1', 'h2', 'h3', 'h4', 'figure', 'figcaption', 'span', 'section',
    'div', 'details', 'summary', 'iframe', 'video', 'source', 'table', 'thead',
    'tbody', 'tr', 'th', 'td',
  ],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
    iframe: ['src', 'width', 'height', 'title', 'allow', 'allowfullscreen', 'frameborder', 'loading', 'referrerpolicy'],
    video: ['src', 'controls', 'width', 'height', 'poster', 'preload'],
    source: ['src', 'type'],
    '*': ['class', 'style'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'player.vimeo.com'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, true),
    img: sanitizeHtml.simpleTransform('img', { loading: 'lazy', decoding: 'async' }, true),
  },
})

if (articles.length !== 60) throw new Error(`Expected 60 articles, found ${articles.length}`)

const prepared = articles.map((article, index) => {
  if (article.number !== index + 37) throw new Error(`Unexpected article number ${article.number}`)
  const sourcePath = join(articleDir, `${article.number}.html`)
  if (!existsSync(sourcePath)) throw new Error(`Missing article source: ${sourcePath}`)

  const imageNames = [
    `${article.slug}-cover.webp`,
    ...Array.from(
      { length: article.bodyImageCount },
      (_, bodyIndex) => `${article.slug}-${String(bodyIndex + 1).padStart(2, '0')}.webp`,
    ),
  ]
  imageNames.forEach((filename) => {
    if (!existsSync(join(publicImageDir, filename))) throw new Error(`Missing public image: ${filename}`)
  })

  const sourceHtml = readFileSync(sourcePath, 'utf8')
  if (/<h1\b/i.test(sourceHtml)) throw new Error(`Article ${article.number}: H1 is not allowed`)
  const replacedHtml = replaceImagePlans(sourceHtml, article)
  const contentHtml = sanitizePostHtml(replacedHtml)
  const firstParagraph = sourceHtml.match(/<p>([\s\S]*?)<\/p>/)?.[1] || ''
  const excerpt = shorten(stripTags(firstParagraph), 190)

  return {
    ...article,
    excerpt,
    contentHtml,
    coverImage: `/images/blog/${article.slug}-cover.webp`,
    canonical: `/blog/${article.slug}`,
    scheduledPublishAt: deterministicScheduleIso(article),
  }
})

const scheduleDates = prepared.map((article) => article.scheduledPublishAt.slice(0, 10))
if (new Set(scheduleDates).size !== prepared.length) throw new Error('Duplicate scheduled UTC dates detected')

const db = new DatabaseSync(dbPath, { readOnly: !apply })
const placeholders = prepared.map(() => '?').join(',')
const slugs = prepared.map((article) => article.slug)
const existingPosts = db.prepare(`SELECT slug FROM posts WHERE slug IN (${placeholders})`).all(...slugs)
const existingSeo = db.prepare(`SELECT entity_slug FROM seo_entries WHERE entry_key IN (${placeholders})`)
  .all(...slugs.map((slug) => `post:${slug}`))

if (existingPosts.length || existingSeo.length) {
  throw new Error(JSON.stringify({
    message: 'Batch contains slugs that already exist; refusing to overwrite',
    posts: existingPosts,
    seo: existingSeo,
  }))
}

const previousLastSchedule = db.prepare(`
  SELECT scheduled_publish_at
  FROM posts
  WHERE scheduled_publish_at IS NOT NULL AND scheduled_publish_at <> ''
  ORDER BY scheduled_publish_at DESC
  LIMIT 1
`).get()?.scheduled_publish_at || ''

if (previousLastSchedule && previousLastSchedule >= prepared[0].scheduledPublishAt) {
  throw new Error(`Schedule overlap: existing ${previousLastSchedule}, new ${prepared[0].scheduledPublishAt}`)
}

if (apply) {
  const timestamp = now()
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
    for (const article of prepared) {
      insertPost.run(
        article.slug, article.title, article.excerpt, article.coverImage,
        article.contentHtml, article.scheduledPublishAt, article.seoTitle,
        article.seoDescription, article.seoKeywords, article.canonical,
        timestamp, timestamp,
      )
      insertSeo.run(
        `post:${article.slug}`, article.slug, `博客文章：${article.title}`,
        `/blog/${article.slug}`, article.seoTitle, article.seoDescription,
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
  prepared: prepared.length,
  bodyImages: prepared.reduce((sum, article) => sum + article.bodyImageCount, 0),
  previousLastSchedule,
  firstSchedule: prepared[0].scheduledPublishAt,
  lastSchedule: prepared.at(-1).scheduledPublishAt,
  firstSlug: prepared[0].slug,
  lastSlug: prepared.at(-1).slug,
}, null, 2))
