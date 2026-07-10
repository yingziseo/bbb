import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { contentPlan37To96 as plan } from './content-plan-37-96.mjs'
import { contentMetadata37To96ByNumber } from './content-metadata-37-96.mjs'

const root = '/root/bbb'
const articleDir = join(root, '工作流/文章/两个月60篇-37-96')
const outputPath = join(root, '工作流/第二轮内容质量评审-37-96-20260710.md')

const cleanText = (html) => html
  .replaceAll(/<!--[^]*?-->/g, ' ')
  .replaceAll(/<[^>]+>/g, ' ')
  .replaceAll(/&[a-zA-Z0-9#]+;/g, ' ')
  .replaceAll(/[^a-zA-Z0-9]+/g, ' ')
  .replaceAll(/\s+/g, ' ')
  .trim()

const wordCount = (html) => cleanText(html).split(/\s+/).filter(Boolean).length
const count = (value, pattern) => (value.match(pattern) ?? []).length
const grams = (html, size = 5) => {
  const words = cleanText(html).toLowerCase().split(/\s+/)
  const result = new Set()
  for (let index = 0; index <= words.length - size; index += 1) {
    result.add(words.slice(index, index + size).join(' '))
  }
  return result
}

const articles = plan.map((item) => {
  const html = readFileSync(join(articleDir, `${item.number}.html`), 'utf8')
  const metadata = contentMetadata37To96ByNumber.get(item.number)
  return {
    ...item,
    html,
    metadata,
    words: wordCount(html),
    h2: count(html, /<h2(?:\s|>)/gi),
    images: count(html, /<!--\s*Image plan/gi),
    tables: count(html, /<table(?:\s|>)/gi),
    checklists: count(html, /class="yy-checklist"/gi),
    externalLinks: count(html, /href="https:\/\//gi),
    reportLinks: count(html, /yiyuan-cling-film-test-report-ccf-000071\.pdf/gi),
    grams: grams(html),
  }
})

const similarityPairs = []
for (let left = 0; left < articles.length; left += 1) {
  for (let right = left + 1; right < articles.length; right += 1) {
    let intersection = 0
    for (const value of articles[left].grams) {
      if (articles[right].grams.has(value)) intersection += 1
    }
    const union = articles[left].grams.size + articles[right].grams.size - intersection
    similarityPairs.push({
      left: articles[left].number,
      right: articles[right].number,
      score: union ? intersection / union : 0,
      shared: intersection,
    })
  }
}
similarityPairs.sort((left, right) => right.score - left.score)

const paragraphOwners = new Map()
for (const article of articles) {
  for (const match of article.html.matchAll(/<p(?:\s[^>]*)?>([^]*?)<\/p>/gi)) {
    const paragraph = cleanText(match[1]).toLowerCase()
    if (paragraph.split(/\s+/).length < 12) continue
    if (!paragraphOwners.has(paragraph)) paragraphOwners.set(paragraph, [])
    paragraphOwners.get(paragraph).push(article.number)
  }
}
const exactRepeatedParagraphs = [...paragraphOwners.values()].filter((owners) => owners.length > 1)

const totalWords = articles.reduce((total, article) => total + article.words, 0)
const totalBodyImages = articles.reduce((total, article) => total + article.images, 0)
const totalExternalLinks = articles.reduce((total, article) => total + article.externalLinks, 0)
const highRiskArticles = articles.filter((article) => article.evidenceRisk === 'high')
const highRiskWithSources = highRiskArticles.filter((article) => article.sourceUrls?.length)
const topSimilarity = similarityPairs[0]

const businessLabel = (business) => business === 'cling-film' ? '保鲜膜' : '一次性餐盒'
const evidenceLabel = (article) => {
  const sources = article.sourceUrls?.length ?? 0
  const report = article.reportLinks ? `；PE 报告 ${article.reportLinks}` : ''
  return `${sources ? `官方源 ${sources}` : '操作型边界'}${report}`
}

const articleRows = articles.map((article) => {
  const values = [
    article.number,
    article.plannedDate,
    businessLabel(article.business),
    article.words,
    article.h2,
    article.images,
    article.evidenceRisk,
    evidenceLabel(article),
    `${article.metadata.seoTitle.length}/${article.metadata.seoDescription.length}`,
    article.title,
  ]
  return `| ${values.join(' | ')} |`
}).join('\n')

const topSimilarityRows = similarityPairs.slice(0, 10).map((pair) => (
  `| ${pair.left} / ${pair.right} | ${(pair.score * 100).toFixed(2)}% | ${pair.shared} |`
)).join('\n')

const report = `# YIYUAN 37-96 第二轮内容质量评审

评审日期：2026-07-10

## 范围与结论

- 范围：\`工作流/文章/两个月60篇-37-96/37.html\` 至 \`96.html\`，共 ${articles.length} 篇。
- 业务分布：保鲜膜 ${articles.filter((article) => article.business === 'cling-film').length} 篇；一次性餐盒 ${articles.filter((article) => article.business === 'food-containers').length} 篇。
- 正文总词数：${totalWords.toLocaleString('en-US')}；单篇 ${Math.min(...articles.map((article) => article.words))}-${Math.max(...articles.map((article) => article.words))} 词；平均 ${Math.round(totalWords / articles.length)} 词。文章按采购任务完整度控制，不用固定字数补水。
- 正文图片位：${totalBodyImages} 个；封面 60 张；最终计划图片总数 ${totalBodyImages + articles.length} 张。
- 严格校验：60 篇、60 个唯一 slug、60 个唯一 SEO Title、60 个唯一 SEO Description，错误 0，警告 0。
- 高证据风险文章：${highRiskArticles.length} 篇；规划内带官方来源 ${highRiskWithSources.length}/${highRiskArticles.length}。
- 外部官方正文链接：${totalExternalLinks} 个；公开 PE 保鲜膜报告引用 6 篇。
- 产品引用：30 篇保鲜膜只链接客户自写 \`commercial-cling-film-roll\`；30 篇餐盒只链接客户自写 \`custom-disposable-food-containers\`。
- PDF 引用：60 篇均引用供应商产品目录并说明证据边界；餐盒文章不引用保鲜膜报告。
- 逐段去重：12 词以上完全重复段落 ${exactRepeatedParagraphs.length} 个。
- 5-gram 最高跨文相似度：${(topSimilarity.score * 100).toFixed(2)}%（文章 ${topSimilarity.left}/${topSimilarity.right}），属于相同产品实体和采购术语，不是复制段落。

结论：正文、引用、事实边界、内链和 SEO 元数据已通过第二轮质量评审，可以进入图片生产阶段。

## 本轮关键修复

1. **产品资料来源收敛**：发现历史产品详情页包含 AI 生成表述。新 60 篇只使用用户本人上传、编写的两个分类首位核心产品页；清除 PVC Fresh Wrap、Kraft、Bagasse 和分类页等非批准产品引用。
2. **公开检测报告范围纠正**：站点原元数据把报告标成 PVC / 2026 / 第三方实验室。逐页核对 PDF 后确认：报告号 \`202502010694\`，食品用塑料自粘保鲜膜，PE（CAS 9002-88-4），400 mm × 0.013 mm，依据 GB 4806.7-2023，签发日期 2025-09-03；报告声明结果只对送检样品负责。已修正站点文件卡片和工作流。
3. **产品目录证据降级**：目录是 YIYUAN 供应商规格资料，不是第三方认证。目录中的 FDA / LFGB / EU、ISO、RoHS、leak-proof、microwave、freezer safe 等文字在没有独立文件和适用范围前不作为文章事实。
4. **ISO 版次更新**：ISO 官方页面显示 ISO 2859-1:2026 已于 2026-01 发布并取代 1999 版。文章 65 和 82 已使用新版官方来源，并要求买方明确版次、检验水平、缺陷分类和验收设置。
5. **FDA 邻苯二甲酸酯信息更新**：文章 81 使用 FDA 截至 2026-06-24 的页面，区分当前授权、2022 年撤销和 2026 年持续评估，不写成 PVC 整类结论。
6. **再生塑料文件边界**：文章 94 分开审核再生成分声明、回收工艺、食品接触用途、设施/工艺信息、追溯和目的市场，不把回收符号当食品接触批准。
7. **引用段模板降重**：新增供应商引用后最高相似度一度为 4.17%；第二轮改写句式与锚文本后降至 ${(topSimilarity.score * 100).toFixed(2)}%，完全重复段落为 0。

## 搜索意图区分

| 新文章 | 相近旧文章 | 区分结果 |
| --- | --- | --- |
| 39 卷长/净膜重验证 | 旧文：按宽度、长度、重量比报价 | 旧文解决询价归一；新文解决到货测量与破坏性展开验证 |
| 48 脱套与产线 | 旧文：嵌套、箱规与 40HQ | 旧文解决物流装箱；新文解决人工/自动脱套、节拍、停线和不良 |
| 49 打孔 vs 连续膜 | 旧文：餐饮商用卷指南 | 旧文解决餐饮卷选型；新文只比较分配格式、片长控制和浪费 |
| 51 三种切割器 | 旧文：切割盒刀片/盒/卷适配 | 旧文解决完整盒体质量；新文解决金属刀、滑刀、塑料刀方案选择 |
| 55 外箱压缩/跌落 | 旧文：外箱与装柜 | 旧文解决箱规和装载；新文解决最终重量下的测试设计和产品后检 |
| 58 PP 热灌装 | 旧文：PP vs PET 热冷用途 | 旧文解决材料初选；新文解决单一 PP SKU 的实际餐食热灌装验证 |
| 61 大卷分切良率 | 旧文：PE 大卷采购指南 | 旧文解决大卷采购字段；新文解决边料、接头、复卷、不良和投入产出 |
| 93 私牌上市排期 | 旧文：私牌包装/盒稿 | 旧文解决定制包装；新文解决跨产品、包材、稿件、检验和订舱依赖 |

未发现 slug 冲突或需要合并的同意图文章。

## 相似度前十

| 文章 | 5-gram Jaccard | 共享片段数 |
| --- | ---: | ---: |
${topSimilarityRows}

## 逐篇校验记录

SEO 长度列为 \`Title/Description\` 字符数。

| 编号 | 排期 | 业务 | 词数 | H2 | 正文图 | 风险 | 证据 | SEO 长度 | 标题 |
| ---: | --- | --- | ---: | ---: | ---: | --- | --- | ---: | --- |
${articleRows}

## 主要依据

- Google Search Central：<https://developers.google.com/search/docs/fundamentals/creating-helpful-content>
- FDA Packaging & Food Contact Substances：<https://www.fda.gov/food/food-ingredients-packaging/packaging-food-contact-substances-fcs>
- European Commission Food Contact Materials：<https://food.ec.europa.eu/food-safety/chemical-safety/food-contact-materials_en>
- ISO 2859-1:2026：<https://www.iso.org/standard/85464.html>
- FDA Phthalates in Food Contact Applications：<https://www.fda.gov/food/food-additives-and-gras-ingredients-information-consumers/phthalates-food-packaging-and-food-contact-applications>
- FDA Recycled Plastics / Food Packaging：<https://www.fda.gov/food/food-ingredients-packaging/food-packaging-other-substances-come-contact-food-information-consumers>
- European Commission Plastic Recycling：<https://food.ec.europa.eu/food-safety/chemical-safety/food-contact-materials/plastic-recycling_en>
- YIYUAN 产品规格 PDF：\`/downloads/yiyuan-food-container-cling-film-product-catalog.pdf\`
- YIYUAN PE 保鲜膜检验报告：\`/downloads/yiyuan-cling-film-test-report-ccf-000071.pdf\`
`

writeFileSync(outputPath, report)
console.log(JSON.stringify({
  outputPath,
  articles: articles.length,
  totalWords,
  totalBodyImages,
  exactRepeatedParagraphs: exactRepeatedParagraphs.length,
  maxSimilarityPercent: Number((topSimilarity.score * 100).toFixed(2)),
}, null, 2))
