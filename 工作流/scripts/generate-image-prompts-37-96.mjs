import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { contentPlan37To96 as plan } from './content-plan-37-96.mjs'

const root = '/root/bbb'
const jsonPath = join(root, '工作流/图片prompt-37-96.json')
const markdownPath = join(root, '工作流/图片prompt-37-96.md')

const referencePaths = {
  'cling-film': '/root/bbb/public/uploads/product-commercial-cling-film-roll.webp',
  'food-containers': '/root/bbb/public/uploads/product-custom-disposable-food-containers.webp',
}

const businessPrompt = {
  'cling-film': {
    subject: 'commercial food cling film rolls, clear transparent film, plain cores, neutral cutter boxes or QC packaging only when relevant',
    reference: 'Use the reference image only for realistic commercial roll proportions, core shapes, and product variety. Remove all source branding and readable package text.',
    avoid: 'pallet stretch film, black industrial film, aluminum foil, household decorative packaging',
  },
  'food-containers': {
    subject: 'clear or translucent disposable food container bases and matched lids in round, rectangular, compartment, or deli formats as relevant',
    reference: 'Use the reference image only for realistic thin-wall food container geometry, clear material, matched lids, and product proportions. Do not reproduce source branding.',
    avoid: 'ceramic tableware, permanent glass storage, luxury restaurant plating, unrelated paper cups',
  },
}

const buildPrompt = ({ item, kind, theme }) => {
  const business = businessPrompt[item.business]
  const assetType = kind === 'cover'
    ? 'English B2B blog cover image, landscape 16:9'
    : 'English B2B blog body image, landscape 16:9'
  const composition = kind === 'cover'
    ? 'wide editorial product composition with the main product and buyer task immediately clear; balanced negative space; all critical objects inside safe crop margins'
    : 'wide explanatory product photograph focused on one inspection, comparison, calculation, packing, warehouse, or food-service action; clear visual hierarchy'

  return `Use case: product-mockup
Asset type: ${assetType}
Input image: product reference only; ${business.reference}
Primary request: ${theme}
Subject: ${business.subject}
Scene/backdrop: believable packaging QC bench, sample room, clean factory, warehouse receiving area, commercial kitchen, retail display, or buyer planning desk according to the request
Style/medium: photorealistic natural B2B product photography, technically credible, practical rather than promotional, realistic plastic and transparent-film textures
Composition/framing: ${composition}
Lighting/mood: clean neutral daylight or realistic task lighting, quiet professional working atmosphere, no dramatic cinema lighting
Color palette: white, clear material, light gray, stainless steel, carton brown, restrained red or green operational accents; avoid a one-color blue or purple cast
Constraints: show the requested product, test, comparison, workflow, or evidence clearly; use physically plausible product geometry and tools; any documents, labels, cartons, screens, rulers, forms, or reports must be blank, blurred, or too small to read
Avoid: readable words, letters, numbers, logos, brand names, certification marks, fake test results, fake report seals, watermark, cartoon style, glossy CGI, excessive blur, clutter, ${business.avoid}`
}

const assets = plan.flatMap((item) => {
  const cover = {
    number: item.number,
    business: item.business,
    slug: item.slug,
    kind: 'cover',
    index: 'cover',
    filename: `${item.slug}-cover.png`,
    referencePath: referencePaths[item.business],
    theme: item.coverTheme,
  }
  cover.prompt = buildPrompt({ item, kind: cover.kind, theme: cover.theme })

  const body = item.bodyImageThemes.map((theme, index) => {
    const asset = {
      number: item.number,
      business: item.business,
      slug: item.slug,
      kind: 'body',
      index: String(index + 1).padStart(2, '0'),
      filename: `${item.slug}-${String(index + 1).padStart(2, '0')}.png`,
      referencePath: referencePaths[item.business],
      theme,
    }
    asset.prompt = buildPrompt({ item, kind: asset.kind, theme: asset.theme })
    return asset
  })

  return [cover, ...body]
})

const markdownRows = assets.map((asset) => (
  `| ${asset.number} | ${asset.kind} | ${asset.index} | \`${asset.filename}\` | ${asset.theme.replaceAll('|', '\\|')} |`
)).join('\n')

const markdown = `# YIYUAN 37-96 图片提示词与文件清单

- 文章：60 篇。
- 资产：${assets.length} 张；封面 ${assets.filter((asset) => asset.kind === 'cover').length} 张；正文 ${assets.filter((asset) => asset.kind === 'body').length} 张。
- 比例：16:9 横版；最终统一转换为 1200 × 675 WebP。
- 保鲜膜视觉参考：\`public/uploads/product-commercial-cling-film-roll.webp\`。
- 餐盒视觉参考：\`public/uploads/product-custom-disposable-food-containers.webp\`。
- 参考图只用于产品形态、材质和比例；不复刻品牌和可读文字。
- 所有表单、报告、标签、箱唛、屏幕和图表保持空白、模糊或不可读；不得生成假认证或假检测结论。
- 允许出现人物、正面人物和正常工作场景；人物或人脸本身不作为拒绝或重生成理由。

| 文章 | 类型 | 序号 | 文件名 | 画面主题 |
| ---: | --- | --- | --- | --- |
${markdownRows}
`

writeFileSync(jsonPath, `${JSON.stringify(assets, null, 2)}\n`)
writeFileSync(markdownPath, markdown)

console.log(JSON.stringify({
  jsonPath,
  markdownPath,
  articles: plan.length,
  assets: assets.length,
  covers: assets.filter((asset) => asset.kind === 'cover').length,
  body: assets.filter((asset) => asset.kind === 'body').length,
}, null, 2))
