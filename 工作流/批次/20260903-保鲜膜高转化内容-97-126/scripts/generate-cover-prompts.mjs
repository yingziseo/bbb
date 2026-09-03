import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { contentPlan } from './content-plan.mjs'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const batchDir = join(scriptDir, '..')

const compositions = [
  'top-down procurement flat lay with the two roll widths clearly distinguishable by physical scale',
  'low three-quarter product view with the three roll diameters receding from foreground to background',
  'close quality-control view with the film edge and measuring instrument as the focal point',
  'balanced side-by-side comparison with one format on each half of the frame',
  'wide split workflow scene showing manual handling and equipment use without a dividing graphic',
  'machine-side close-up focused on roll mounting, core clearance, and web path',
  'clean supermarket preparation station photographed at counter height',
  'wide storeroom-to-kitchen context with the rolls organized as working supplies',
  'warm bakery workbench scene viewed from a high three-quarter angle',
  'deep-perspective central kitchen line with film supplies placed at successive workstations',
  'two distinct packaging processes in one wide editorial scene, separated by natural workspace distance',
  'wide industrial comparison with cool ambient light and a clear foreground-to-background process contrast',
  'precise overhead technical flat lay with tools aligned around one transparent film sample',
  'top-down usage-estimation scene centered on a real food pan and a measured film cut',
  'exploded-component product layout with each physical packaging component separated in space',
  'two-path product choice scene with a standard roll foreground and custom packaging material behind it',
  'order-preparation tabletop photographed diagonally, with samples and courier carton forming a clear sequence',
  'observational audit scene from behind the auditor, with equipment and record checks visible but generic',
  'controlled customs-inspection flat lay with material and dimension evidence as the visual focus',
  'engineering macro view of roll geometry, core, and caliper on a matte work surface',
  'laboratory-style sample planning scene with neutral glassware and film specimens, not a certificate display',
  'warehouse packing comparison using two realistic carton group sizes in a shallow-depth scene',
  'modular mixed-SKU layout viewed from above, grouped by roll width and packaging components',
  'shipping quotation desk at a three-quarter angle with cartons and a small container model in the background',
  'wide freight-terminal comparison using natural lanes for shared and dedicated cargo handling',
  'miniature loading-planning scene with two container sizes and cartons shown in accurate perspective',
  'symmetrical warehouse comparison of palletized and floor-loaded cartons inside a loading bay',
  'view into an open container with visually separated carton groups arranged by loading sequence',
  'document-review close-up with four physically distinct blank folders around one traceable film sample',
  'controlled-use test scene arranged from cold to room-temperature conditions across the frame',
]

if (contentPlan.length !== compositions.length) {
  throw new Error(`Expected ${contentPlan.length} compositions, found ${compositions.length}`)
}

const items = contentPlan.map((article, index) => ({
  number: article.number,
  slug: article.slug,
  title: article.title,
  coverPath: `/images/blog/${article.slug}-cover.webp`,
  prompt: [
    'Use case: product-mockup',
    'Asset type: B2B food-packaging blog cover, landscape 16:9',
    `Primary request: ${article.coverTheme}`,
    'Scene/backdrop: clean, credible commercial food-service, procurement, laboratory, or logistics setting appropriate to the subject',
    'Subject: unbranded clear food cling film rolls and only the practical tools or packaging elements required by the topic',
    'Style/medium: realistic editorial product photography with natural material texture; informative rather than promotional',
    `Composition/framing: ${compositions[index]}; safe central crop and no designed text area`,
    'Lighting/mood: neutral daylight or soft industrial lighting, restrained contrast, trustworthy and practical',
    'Color palette: clear film, white, stainless steel, kraft carton, and muted blue-gray accents',
    'Constraints: physically plausible rolls and equipment; generic illustrative scene, not a documentary claim about a named factory; no people facing camera; no readable text or numbers; no logos, brands, watermarks, labels, QR codes, flags, signatures, certification marks, seals, or fake test reports',
    'Avoid: glossy advertising look, impossible transparent geometry, floating objects, excessive props, decorative charts, UI overlays, split-screen borders, duplicated tools, distorted hands',
  ].join('\n'),
}))

writeFileSync(join(batchDir, '图片prompt.json'), `${JSON.stringify(items, null, 2)}\n`)

const markdown = [
  '# 封面图片提示词（97–126）',
  '',
  '- 每篇仅 1 张封面，共 30 张。',
  '- 最终文件：1200 × 675 WebP。',
  '- 不含正文配图、文字、Logo、水印、证书章或虚构检测报告。',
  '- 生成图仅作主题示意，不作为宜沅工厂、设备或认证的事实证据。',
  '',
  ...items.flatMap((item) => [
    `## ${item.number}. ${item.title}`,
    '',
    `- 文件：\`${item.coverPath}\``,
    '',
    '```text',
    item.prompt,
    '```',
    '',
  ]),
].join('\n')

writeFileSync(join(batchDir, '图片prompt.md'), `${markdown.replace(/\n+$/, '')}\n`)

console.log(JSON.stringify({ generated: items.length, first: items[0].coverPath, last: items.at(-1).coverPath }, null, 2))
