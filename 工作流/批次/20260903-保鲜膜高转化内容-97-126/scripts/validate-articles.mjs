import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { contentPlan, contentPlanBySlug } from './content-plan.mjs'
import { contentMetadata, contentMetadataByNumber } from './content-metadata.mjs'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(scriptDir, '..', '..', '..', '..')
const articleDir = join(projectRoot, '工作流/文章/保鲜膜高转化30篇-97-126')
const allowedDownloads = new Set([
  '/downloads/yiyuan-food-container-cling-film-product-catalog.pdf',
  '/downloads/yiyuan-cling-film-test-report-ccf-000071.pdf',
])

const errors = []
const warnings = []
const checked = []
const fail = (number, message) => errors.push(`${number}: ${message}`)
const warn = (number, message) => warnings.push(`${number}: ${message}`)
const count = (value, pattern) => (value.match(pattern) || []).length
const plain = (html) => html
  .replace(/<!--[^]*?-->/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[^;]+;/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const genericPatterns = [
  ['H1', /<h1(?:\s|>)/i],
  ['body image', /<(?:img|picture|figure)(?:\s|>)/i],
  ['image placeholder', /<!--\s*Image plan/i],
  ['Quick Summary', /quick summary/i],
  ['In conclusion', /in conclusion/i],
  ['ultimate guide', /ultimate guide/i],
  ['delve', /\bdelve\b/i],
  ['navigate', /\bnavigate(?:s|d|ing)?\b/i],
  ['ever-evolving', /ever-evolving/i],
  ['game changer', /game[- ]changer/i],
  ['important to note', /important to note/i],
  ['fake case study', /\b(?:our|yiyuan's) (?:customer|client|factory) (?:found|tested|measured|achieved|reduced|increased)\b/i],
]
const pairedTags = ['section', 'div', 'ul', 'ol', 'table', 'thead', 'tbody', 'tr']
const texts = []

if (contentMetadata.length !== contentPlan.length) {
  errors.push(`metadata count ${contentMetadata.length} != plan count ${contentPlan.length}`)
}

for (const item of contentPlan) {
  const path = join(articleDir, `${item.number}.html`)
  if (!existsSync(path)) {
    fail(item.number, 'source HTML missing')
    continue
  }
  const html = readFileSync(path, 'utf8')
  const text = plain(html)
  const wordCount = (text.match(/[A-Za-z0-9%.-]+/g) || []).length
  const h2Count = count(html, /<h2(?:\s|>)/gi)
  const links = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1])
  const internalLinks = links.filter((href) => href.startsWith('/'))
  const externalLinks = links.filter((href) => /^https?:\/\//.test(href))
  const metadata = contentMetadataByNumber.get(item.number)

  checked.push({ number: item.number, words: wordCount, h2: h2Count, internalLinks: internalLinks.length })
  texts.push({ number: item.number, text: text.toLowerCase() })

  if (!metadata || metadata.slug !== item.slug) fail(item.number, 'metadata missing or slug mismatch')
  if (metadata?.seoTitle.length > 60) fail(item.number, `SEO title is ${metadata.seoTitle.length} characters`)
  if (metadata && (metadata.seoDescription.length < 120 || metadata.seoDescription.length > 160)) {
    fail(item.number, `SEO description is ${metadata.seoDescription.length} characters`)
  }
  if (h2Count < 3) fail(item.number, `only ${h2Count} H2 sections`)
  if (h2Count > 5) warn(item.number, `${h2Count} H2 sections may be over-structured for a short article`)
  if (wordCount > 450) fail(item.number, `${wordCount} words exceeds the concise-content gate`)
  if (!/(<table|<ol|class="yy-checklist"|class="yy-note"|class="yy-panel")/i.test(html)) {
    fail(item.number, 'no executable table, formula, checklist, or copyable form')
  }

  for (const [label, pattern] of genericPatterns) if (pattern.test(html)) fail(item.number, `contains ${label}`)
  for (const tag of pairedTags) {
    const opens = count(html, new RegExp(`<${tag}(?:\\s|>)`, 'gi'))
    const closes = count(html, new RegExp(`</${tag}>`, 'gi'))
    if (opens !== closes) fail(item.number, `unbalanced <${tag}> (${opens}/${closes})`)
  }

  if (internalLinks.length < 2 || internalLinks.length > 4) {
    fail(item.number, `${internalLinks.length} internal links; expected 2-4 useful links`)
  }
  for (const href of internalLinks) {
    if (allowedDownloads.has(href)) continue
    if (!item.allowedInternalLinks.includes(href)) fail(item.number, `unapproved internal link ${href}`)
    const planned = href.match(/^\/blog\/([^/?#]+)/)?.[1]
    const linked = planned ? contentPlanBySlug.get(planned) : null
    if (linked && linked.number >= item.number) fail(item.number, `forward link to planned article ${linked.number}`)
  }
  for (const href of externalLinks) {
    if (!item.sourceUrls.includes(href)) fail(item.number, `external source not recorded in plan: ${href}`)
  }
  for (const href of item.sourceUrls) {
    if (!externalLinks.includes(href)) fail(item.number, `planned official source not cited: ${href}`)
  }

  const citesReport = html.includes('/downloads/yiyuan-cling-film-test-report-ccf-000071.pdf')
  if (citesReport && !/202502010694/.test(text)) fail(item.number, 'report citation missing report number 202502010694')
  if (citesReport && !/400 mm × 0\.013 mm PE/i.test(text)) fail(item.number, 'report citation missing exact PE sample scope')
}

const ngrams = (text, size = 5) => {
  const words = text.match(/[a-z0-9%]+/g) || []
  const result = new Set()
  for (let i = 0; i <= words.length - size; i += 1) result.add(words.slice(i, i + size).join(' '))
  return result
}

const gramRows = texts.map((row) => ({ ...row, grams: ngrams(row.text) }))
let maximumPair = { left: 0, right: 0, score: 0 }
for (let left = 0; left < gramRows.length; left += 1) {
  for (let right = left + 1; right < gramRows.length; right += 1) {
    const a = gramRows[left]
    const b = gramRows[right]
    const intersection = [...a.grams].filter((gram) => b.grams.has(gram)).length
    const union = new Set([...a.grams, ...b.grams]).size
    const score = union ? intersection / union : 0
    if (score > maximumPair.score) maximumPair = { left: a.number, right: b.number, score }
    if (score >= 0.12) errors.push(`${a.number}/${b.number}: 5-gram Jaccard ${score.toFixed(3)} exceeds 0.12`)
  }
}

const sentenceOwners = new Map()
for (const row of texts) {
  for (const sentence of row.text.split(/[.!?]+/).map((value) => value.trim())) {
    if (sentence.split(/\s+/).length < 12) continue
    const owners = sentenceOwners.get(sentence) || new Set()
    owners.add(row.number)
    sentenceOwners.set(sentence, owners)
  }
}
for (const [sentence, owners] of sentenceOwners) {
  if (owners.size > 1) errors.push(`repeated long sentence in ${[...owners].join('/')}: ${sentence}`)
}

console.log(JSON.stringify({
  planned: contentPlan.length,
  checked: checked.length,
  errors,
  warnings,
  wordRange: checked.length ? [Math.min(...checked.map((row) => row.words)), Math.max(...checked.map((row) => row.words))] : null,
  averageWords: checked.length ? Math.round(checked.reduce((sum, row) => sum + row.words, 0) / checked.length) : null,
  maximumFiveGramOverlap: {
    articles: [maximumPair.left, maximumPair.right],
    jaccard: Number(maximumPair.score.toFixed(3)),
  },
  checkedRows: checked,
}, null, 2))

if (errors.length) process.exitCode = 1
