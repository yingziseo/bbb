import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  contentPlan37To96 as plan,
  contentPlan37To96BySlug,
} from './content-plan-37-96.mjs'
import { contentMetadata37To96ByNumber } from './content-metadata-37-96.mjs'

const root = '/root/bbb'
const articleDir = join(root, '工作流/文章/两个月60篇-37-96')
const finalMode = process.argv.includes('--final')
const productCatalogPath = '/downloads/yiyuan-food-container-cling-film-product-catalog.pdf'
const clingFilmReportPath = '/downloads/yiyuan-cling-film-test-report-ccf-000071.pdf'
const coreProductPath = {
  'cling-film': '/products/commercial-cling-film-roll',
  'food-containers': '/products/custom-disposable-food-containers',
}
const reportEvidenceArticles = new Set([37, 65, 73, 81, 83, 87])

const errors = []
const warnings = []
const checked = []

const metadataRows = [...contentMetadata37To96ByNumber.values()]
if (metadataRows.length !== plan.length) {
  errors.push(`metadata: expected ${plan.length} rows, found ${metadataRows.length}`)
}
if (new Set(metadataRows.map((item) => item.seoTitle)).size !== metadataRows.length) {
  errors.push('metadata: duplicate SEO titles')
}
if (new Set(metadataRows.map((item) => item.seoDescription)).size !== metadataRows.length) {
  errors.push('metadata: duplicate SEO descriptions')
}

const fail = (number, message) => errors.push(`${number}: ${message}`)
const warn = (number, message) => warnings.push(`${number}: ${message}`)

const countMatches = (value, pattern) => (value.match(pattern) ?? []).length
const plainText = (html) => html
  .replaceAll(/<!--[^]*?-->/g, ' ')
  .replaceAll(/<[^>]+>/g, ' ')
  .replaceAll(/&[a-zA-Z0-9#]+;/g, ' ')
  .replaceAll(/\s+/g, ' ')
  .trim()

const pairedTags = ['section', 'div', 'ul', 'ol', 'table', 'thead', 'tbody', 'tr']
const genericPatterns = [
  ['H1', /<h1(?:\s|>)/i],
  ['Quick Summary', /quick summary/i],
  ['Short Answer', /short answer/i],
  ['Final Notes', /final notes/i],
  ['representative buyer scenario', /representative buyer scenario/i],
  ['Can YIYUAN', /can yiyuan/i],
  ['script tag', /<script(?:\s|>)/i],
]

for (const item of plan) {
  const path = join(articleDir, `${item.number}.html`)
  if (!existsSync(path)) {
    const message = 'source HTML is missing'
    if (finalMode) fail(item.number, message)
    else warn(item.number, message)
    continue
  }

  const html = readFileSync(path, 'utf8')
  const text = plainText(html)
  const words = text ? text.split(/\s+/).length : 0
  const imagePlans = countMatches(html, /<!--\s*Image plan\s+\d+-\d+:/gi)
  const h2Count = countMatches(html, /<h2(?:\s|>)/gi)

  checked.push({ number: item.number, words, images: imagePlans, h2: h2Count })

  const metadata = contentMetadata37To96ByNumber.get(item.number)
  if (!metadata || metadata.slug !== item.slug) {
    fail(item.number, 'SEO metadata is missing or has a mismatched slug')
  } else {
    if (metadata.seoTitle.length > 60) {
      fail(item.number, `SEO title is ${metadata.seoTitle.length} characters`)
    }
    if (metadata.seoDescription.length < 120 || metadata.seoDescription.length > 160) {
      fail(item.number, `SEO description is ${metadata.seoDescription.length} characters`)
    }
  }

  if (imagePlans !== item.bodyImageCount) {
    fail(item.number, `expected ${item.bodyImageCount} image plans, found ${imagePlans}`)
  }
  if (words < 350) warn(item.number, `only ${words} words; confirm the buyer task is fully answered`)
  if (h2Count < 3) fail(item.number, `only ${h2Count} H2 sections`)

  for (const [label, pattern] of genericPatterns) {
    if (pattern.test(html)) fail(item.number, `contains disallowed ${label}`)
  }

  for (const tag of pairedTags) {
    const opens = countMatches(html, new RegExp(`<${tag}(?:\\s|>)`, 'gi'))
    const closes = countMatches(html, new RegExp(`</${tag}>`, 'gi'))
    if (opens !== closes) fail(item.number, `unbalanced <${tag}> tags (${opens}/${closes})`)
  }

  for (const match of html.matchAll(/href="\/blog\/([^"?#]+)[^"?]*"/g)) {
    const linked = contentPlan37To96BySlug.get(match[1])
    if (linked && linked.number >= item.number) {
      fail(item.number, `forward internal link to planned article ${linked.number}`)
    }
  }

  const productLinks = [...html.matchAll(/href="(\/products\/[^"]+)"/g)].map((match) => match[1])
  const wrongProductLinks = productLinks.filter((link) => link !== coreProductPath[item.business])
  if (wrongProductLinks.length) {
    fail(item.number, `links to unapproved product sources: ${[...new Set(wrongProductLinks)].join(', ')}`)
  }

  const requiredReferenceChecks = [
    [html.includes(`href="${coreProductPath[item.business]}"`), `missing core product link ${coreProductPath[item.business]}`],
    [html.includes(`href="${productCatalogPath}"`), `missing product catalog PDF link ${productCatalogPath}`],
  ]
  for (const [passes, message] of requiredReferenceChecks) {
    if (passes) continue
    if (finalMode) fail(item.number, message)
    else warn(item.number, message)
  }

  const hasClingFilmReport = html.includes(`href="${clingFilmReportPath}"`)
  if (item.business === 'food-containers' && hasClingFilmReport) {
    fail(item.number, 'food-container article cites the PE cling film inspection report')
  }
  if (reportEvidenceArticles.has(item.number) && !hasClingFilmReport) {
    const message = 'missing planned PE cling film inspection report reference'
    if (finalMode) fail(item.number, message)
    else warn(item.number, message)
  }
  if (hasClingFilmReport) {
    if (!/\bPE\b/.test(text)) fail(item.number, 'inspection report citation does not identify PE material')
    if (!/202502010694/.test(text)) fail(item.number, 'inspection report citation does not identify report no. 202502010694')
    if (!/sample/i.test(text)) fail(item.number, 'inspection report citation does not state a sample scope')
  }

  if (item.evidenceRisk === 'high' && !item.sourceUrls?.length) {
    warn(item.number, 'high evidence risk but no official source URLs are recorded in the plan')
  }
}

console.log(JSON.stringify({
  mode: finalMode ? 'final' : 'partial',
  planned: plan.length,
  checked: checked.length,
  errors: errors.length,
  warnings: warnings.length,
  wordRange: checked.length
    ? [Math.min(...checked.map((row) => row.words)), Math.max(...checked.map((row) => row.words))]
    : null,
}, null, 2))

if (errors.length) console.error(`\nErrors:\n${errors.join('\n')}`)
if (warnings.length) console.error(`\nWarnings:\n${warnings.join('\n')}`)

if (errors.length) process.exitCode = 1
