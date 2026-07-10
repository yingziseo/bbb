import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { contentPlan37To96 as plan } from './content-plan-37-96.mjs'

const root = '/root/bbb'
const articleDir = join(root, '工作流/文章/两个月60篇-37-96')
const catalogPath = '/downloads/yiyuan-food-container-cling-film-product-catalog.pdf'
const reportPath = '/downloads/yiyuan-cling-film-test-report-ccf-000071.pdf'

const focusByNumber = {
  37: 'roll thickness, width, and production approval',
  38: 'base-lid codes and warehouse matching',
  39: 'roll length and net film quantity',
  40: 'tamper-evident and standard closure options',
  41: 'core, roll, dispenser, and cutter-box fit',
  42: 'vented and closed hot-food lids',
  43: 'winding condition and damaged roll edges',
  44: 'rim, flange, and matched-lid geometry',
  45: 'unwind behavior, blocking, and tack checks',
  46: 'filled stack and top-load trials',
  47: 'food-wrap roll specifications and RFQ identity',
  48: 'nested container packs and line separation',
  49: 'perforated and continuous food-wrap formats',
  50: 'compartment layouts and menu portions',
  51: 'cutter systems and working box prototypes',
  52: 'hinged and separate-lid operating costs',
  53: 'retail cutter-box construction',
  54: 'clear-lid appearance and packing protection',
  55: 'master cartons and final roll packing',
  56: 'PET container samples and cold-handling evidence',
  57: 'kilogram, roll, and meter quotation inputs',
  58: 'PP/PET material options and hot-fill project questions',
  59: 'landed-cost inputs for finished cling film rolls',
  60: 'food container structures for fried-food trials',
  61: 'jumbo rolls, custom widths, and conversion planning',
  62: 'matched containers and lids for soup and curry',
  63: 'finished-roll dimensions and custom specifications',
  64: 'clear cold-food containers and labeling',
  65: 'shipment inspection and product document matching',
  66: 'PP/PET container options for frozen-meal validation',
  67: 'receiving inspection of finished rolls and cartons',
  68: 'clear containers, closure, and bakery presentation',
  69: 'export roll packing and ocean-freight evidence',
  70: 'container range and central-kitchen line trials',
  71: 'roll formats, carton identification, and storage',
  72: 'container formats for institutional meal trials',
  73: 'sensory complaint evidence and material identity',
  74: 'base, lid, and carton landed-cost inputs',
  75: 'wrapped-pack clarity and film handling',
  76: 'component pack quantities and set ratios',
  77: 'film choice across tray surfaces and moisture',
  79: 'cling film scope in food shelf-life projects',
  81: 'PE/PVC material identity and plasticizer document scope',
  83: 'product-use-market document requests',
  85: 'formula, core, box, and carton change control',
  87: 'sample identity and bulk-production approval',
  89: 'complaint samples, labels, and lot evidence',
  91: 'distributor roll widths, lengths, and pack formats',
  93: 'private-label roll and packaging approvals',
  95: 'trial-order quality and reorder decisions',
}

const reportParagraphs = {
  37: `<p>For supplier-specific context, compare the target with YIYUAN's customer-maintained <a href="/products/commercial-cling-film-roll">commercial cling film roll specifications</a> and <a href="${catalogPath}">supplier product catalog PDF</a>. The available <a href="${reportPath}">PE cling film inspection report PDF</a>, report no. 202502010694, identifies one 400 mm x 0.013 mm submitted sample; its listed tests do not establish a production thickness tolerance, so dimensional acceptance still needs the method above.</p>`,
  65: `<p>Supplier records can be checked against YIYUAN's customer-maintained <a href="/products/commercial-cling-film-roll">commercial cling film roll page</a> and <a href="${catalogPath}">product catalog PDF</a>. The <a href="${reportPath}">PE cling film inspection report PDF</a>, report no. 202502010694, is an example of a sample-specific document for a 400 mm x 0.013 mm submitted sample; the report states that results apply only to the provided sample and must not be treated as shipment-wide certification.</p>`,
  73: `<p>For the current supplier range, use the customer-maintained <a href="/products/commercial-cling-film-roll">commercial cling film roll page</a> and <a href="${catalogPath}">product catalog PDF</a> to identify the ordered material and format. YIYUAN's <a href="${reportPath}">PE cling film inspection report PDF</a>, report no. 202502010694, includes sensory items for one 400 mm x 0.013 mm submitted PE sample; it can inform document review but cannot determine the cause or safety of another complaint sample.</p>`,
  81: `<p>YIYUAN's customer-maintained <a href="/products/commercial-cling-film-roll">commercial roll page</a> lists PE or PVC as order-specific material options, while the <a href="${catalogPath}">supplier product catalog PDF</a> provides range information. The public <a href="${reportPath}">inspection report PDF</a>, report no. 202502010694, covers a 400 mm x 0.013 mm submitted PE sample, not PVC; it is therefore evidence for why a buyer must match material and sample identity, not evidence for a PVC formulation.</p>`,
  83: `<p>The current product references are YIYUAN's customer-maintained <a href="/products/commercial-cling-film-roll">commercial cling film roll page</a> and <a href="${catalogPath}">supplier product catalog PDF</a>. The available <a href="${reportPath}">PE sample inspection report PDF</a>, report no. 202502010694, concerns one 400 mm x 0.013 mm submitted sample under Chinese test references; it is neither a U.S. authorization nor an EU declaration and cannot replace either market workflow.</p>`,
  87: `<p>For a concrete scope example, compare YIYUAN's customer-maintained <a href="/products/commercial-cling-film-roll">commercial roll specification range</a>, the <a href="${catalogPath}">supplier product catalog PDF</a>, and the <a href="${reportPath}">PE cling film inspection report PDF</a>. Report no. 202502010694 identifies one 400 mm x 0.013 mm submitted sample and states that its results apply only to that sample, which is why a bulk agreement still needs its own lot, sampling, and tolerance controls.</p>`,
}

const legacyTemplateFor = (item) => {
  const focus = focusByNumber[item.number]
  const productPath = item.business === 'cling-film'
    ? '/products/commercial-cling-film-roll'
    : '/products/custom-disposable-food-containers'
  const productName = item.business === 'cling-film'
    ? 'commercial cling film roll page'
    : 'custom disposable food container page'

  const templates = [
    `<p>For supplier-specific context on ${focus}, use YIYUAN's customer-maintained <a href="${productPath}">${productName}</a> together with the <a href="${catalogPath}">supplier product catalog PDF</a>. The catalog describes range-level options; the purchase specification and approved sample still control the ordered SKU.</p>`,
    `<p>When preparing an order around ${focus}, start with YIYUAN's customer-maintained <a href="${productPath}">${productName}</a>. The <a href="${catalogPath}">product catalog PDF</a> helps frame available ranges, but it is supplier product information rather than independent certification or a batch test.</p>`,
    `<p>Available supplier information for ${focus} should be read at two levels: the customer-maintained <a href="${productPath}">${productName}</a> for the current offer and the <a href="${catalogPath}">product catalog PDF</a> for range context. Confirm final material, dimensions, packing, and documents in the order file.</p>`,
    `<p>To turn ${focus} into an RFQ, compare the requirement with YIYUAN's customer-maintained <a href="${productPath}">${productName}</a> and <a href="${catalogPath}">product catalog PDF</a>. Neither source replaces order-specific drawings, samples, use trials, or destination-market review.</p>`,
    `<p>YIYUAN's customer-maintained <a href="${productPath}">${productName}</a> is the primary supplier reference for ${focus}. Use the <a href="${catalogPath}">supplier product catalog PDF</a> as supporting range information, without treating its marketing statements as third-party test or certification evidence.</p>`,
  ]

  return templates[item.number % templates.length]
}

const templateFor = (item, decoupleLabels = true) => {
  const focus = focusByNumber[item.number]
  const productPath = item.business === 'cling-film'
    ? '/products/commercial-cling-film-roll'
    : '/products/custom-disposable-food-containers'
  const productLabels = item.business === 'cling-film'
    ? [
        'current commercial film range',
        'customer-authored roll specification page',
        'primary cling film product record',
        'commercial roll offer',
        'verified supplier roll page',
        'current cling film product page',
        'customer-maintained film range',
        'commercial wrap specification page',
        'primary roll product page',
        'current food-wrap range',
      ]
    : [
        'current custom container range',
        'customer-authored container specification page',
        'primary food container product record',
        'custom container offer',
        'verified supplier container page',
        'current disposable container page',
        'customer-maintained container range',
        'food container specification page',
        'primary container product page',
        'current takeaway container range',
      ]
  const catalogLabels = [
    'six-page product specification catalog',
    'downloadable supplier catalog',
    'product range PDF',
    'catalog specification PDF',
    'YIYUAN product catalog',
    'supplier-issued catalog',
    'downloadable product specification PDF',
    'range and customization catalog',
    'food packaging product catalog',
    'current supplier catalog PDF',
  ]
  const templateIndex = item.number % 10
  const labelIndex = decoupleLabels
    ? Math.floor((item.number - 37) / 6) % 10
    : templateIndex
  const catalogIndex = decoupleLabels ? (labelIndex + 3) % 10 : templateIndex
  const productLink = `<a href="${productPath}">${productLabels[labelIndex]}</a>`
  const catalogLink = `<a href="${catalogPath}">${catalogLabels[catalogIndex]}</a>`
  const templates = [
    `<p>The order file for ${focus} can start with YIYUAN's ${productLink}. Use the ${catalogLink} to see adjacent size and packing options, then return to the signed specification for the exact SKU.</p>`,
    `<p>YIYUAN describes its supplier-side scope for ${focus} on the ${productLink}; its ${catalogLink} adds broader range context. Both are first-party product information, so independent claims and batch results still need their own evidence.</p>`,
    `<p>For ${focus}, the relevant YIYUAN reference is the ${productLink}. The ${catalogLink} helps buyers prepare questions, but final dimensions, materials, use conditions, and packing belong in the purchase record.</p>`,
    `<p>Before requesting samples for ${focus}, check the ${productLink} and mark the applicable range in the ${catalogLink}. Treat the PDF as a sourcing document, not a laboratory report or destination-market approval.</p>`,
    `<p>The ${productLink} is YIYUAN's customer-maintained source for ${focus}. Its supporting ${catalogLink} can narrow an RFQ, while drawings, sample results, and order documents provide the final acceptance evidence.</p>`,
    `<p>Supplier information relevant to ${focus} appears on YIYUAN's ${productLink}. Cross-check the proposed format in the ${catalogLink}, but do not carry catalog marketing language into claims without separate support.</p>`,
    `<p>Use YIYUAN's ${productLink} to anchor the discussion of ${focus}. The ${catalogLink} shows the wider commercial range; neither source replaces product-specific testing, document review, or an approved production sample.</p>`,
    `<p>When quoting ${focus}, identify the format from the ${productLink} and attach the selected fields from the ${catalogLink}. Confirm any changed material, size, lid or core, carton, and market document before production.</p>`,
    `<p>The first-party references for ${focus} are YIYUAN's ${productLink} and its ${catalogLink}. They establish supplier context only, so the buyer's controlled specification must resolve every order-specific value.</p>`,
    `<p>Keep ${focus} tied to the ${productLink}, which is the customer-maintained YIYUAN product source. The ${catalogLink} is useful for range comparison, not as proof of certification, universal performance, or shipment conformity.</p>`,
  ]

  return templates[templateIndex]
}

let updated = 0

for (const item of plan) {
  const path = join(articleDir, `${item.number}.html`)
  let html = readFileSync(path, 'utf8')
  const productPath = item.business === 'cling-film'
    ? '/products/commercial-cling-film-roll'
    : '/products/custom-disposable-food-containers'

  html = html
    .replaceAll('href="/products/pvc-fresh-wrap"', `href="${productPath}"`)
    .replaceAll('href="/products/category/cling-film"', `href="${productPath}"`)

  const hasCore = html.includes(`href="${productPath}"`)
  const hasCatalog = html.includes(`href="${catalogPath}"`)
  const plannedReport = Object.hasOwn(reportParagraphs, item.number)
  const hasReport = html.includes(`href="${reportPath}"`)

  if (focusByNumber[item.number] && !plannedReport) {
    const legacyParagraph = legacyTemplateFor(item)
    if (html.includes(legacyParagraph)) {
      html = html.replace(legacyParagraph, templateFor(item))
      updated += 1
    }
    const coupledParagraph = templateFor(item, false)
    if (html.includes(coupledParagraph)) {
      html = html.replace(coupledParagraph, templateFor(item))
      updated += 1
    }
  }

  if ((!hasCore || !hasCatalog || (plannedReport && !hasReport)) && focusByNumber[item.number]) {
    const paragraph = reportParagraphs[item.number] ?? templateFor(item)
    if (!html.includes('<section class="yy-cta">')) {
      throw new Error(`Article ${item.number} has no CTA insertion point`)
    }
    html = html.replace('<section class="yy-cta">', `${paragraph}\n\n<section class="yy-cta">`)
    updated += 1
  }

  writeFileSync(path, html)
}

console.log(JSON.stringify({ updated, planned: plan.length }, null, 2))
