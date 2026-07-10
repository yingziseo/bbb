import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { contentPlan37To96 as plan } from './content-plan-37-96.mjs'

const root = '/root/bbb'
const outputPath = join(root, '工作流/两个月文章规划-37-96.md')

const escapeCell = (value) => String(value).replaceAll('|', '\\|').replaceAll('\n', ' ')
const businessLabel = (value) => value === 'cling-film' ? '保鲜膜' : '一次性餐盒'
const totalBodyImages = plan.reduce((total, item) => total + item.bodyImageCount, 0)
const imageDistribution = [1, 2, 3]
  .map((count) => `${count} 张：${plan.filter((item) => item.bodyImageCount === count).length} 篇`)
  .join('；')

const planRows = plan.map((item) => [
  item.number,
  item.plannedDate,
  businessLabel(item.business),
  item.articleType,
  item.title,
  `\`${item.slug}\``,
  item.primaryKeyword,
  item.intent,
  item.audience,
  item.bodyImageCount,
  item.evidenceRisk,
].map(escapeCell).join(' | ')).map((row) => `| ${row} |`).join('\n')

const imageRows = plan.map((item) => {
  const bodyThemes = item.bodyImageThemes.map((theme, index) => `${index + 1}. ${theme}`).join('<br>')
  return `| ${item.number} | ${escapeCell(item.title)} | ${escapeCell(item.coverTheme)} | ${escapeCell(bodyThemes)} |`
}).join('\n')

const markdown = `# YIYUAN 后续两个月 TOB 博客规划（37-96）

最后更新：2026-07-10

## 目标与边界

- 新增 60 篇英文 TOB 获客文章：保鲜膜 30 篇、一次性餐盒 30 篇。
- 接续当前排期，从 2026-08-09 至 2026-10-07，北京时间每天发布 1 篇。
- 两个业务方向隔日交替，避免连续一个月只发布单一产品线。
- 不重复现有 39 篇文章的主要搜索意图；新内容下沉到规格验收、质量控制、渠道操作、成本模型、索赔证据、变更控制和文件审核。
- 不为凑字数写百科内容。每篇必须让采购人员能够完成一个具体判断、测试、计算、沟通或批准动作。
- 不虚构工厂经验、客户案例、测试结论、认证或法规结论。
- 源文章目录：\`工作流/文章/两个月60篇-37-96/\`。

## 产品资料与 E-E-A-T 引用规则

- 新文章只把客户本人上传、编写的两个首位核心产品页作为产品事实和产品内链来源：保鲜膜 \`/products/commercial-cling-film-roll\`；一次性餐盒 \`/products/custom-disposable-food-containers\`。
- 其他产品详情页为历史 AI 生成内容，在用户删除或重新确认前不得作为产品参数、应用、合规或 E-E-A-T 依据，也不主动内链。
- 产品规格、RFQ、样品、包装和选型内容，主题相关时优先引用 \`/downloads/yiyuan-food-container-cling-film-product-catalog.pdf\`；该文件是产品资料，不是第三方认证。
- 食品接触、PE 材料、检测报告和质量文件内容，主题相关时可引用 \`/downloads/yiyuan-cling-film-test-report-ccf-000071.pdf\`，但只限报告编号 202502010694 明确的 PE 食品用塑料自粘保鲜膜送检样品（400 mm × 0.013 mm）、项目、方法和结果。
- 保鲜膜检测报告不能给餐盒、PVC 膜、其他 PE 配方/规格、其他批次或全部市场背书；报告声明结果只对送检样品负责。餐盒没有公开对应检测 PDF 时，只能引导买家按具体 SKU、用途和目的市场申请文件。
- \`/documents\` 中的 \`On request\` 文件只是申请入口，不能写成已经签发、已经公开或全产品认证。
- 第二轮质量评审必须检查产品页来源、PDF 适用范围、报告样品匹配、请求型文件措辞和锚文本准确性。

## 图片策略

- 每篇固定 1 张封面图，共 60 张。
- 正文图按内容复杂度配置 1-3 张，不固定数量：${imageDistribution}。
- 正文图共 ${totalBodyImages} 张；加封面后计划图片总数为 ${plan.length + totalBodyImages} 张。
- 1 张正文图：单一规格或单一判断问题。
- 2 张正文图：标准对比、测试或故障分析。
- 3 张正文图：多阶段流程、成本模型、检查计划、生产线或文件矩阵。
- 图片保持真实 B2B 产品摄影风格；无可读品牌、无假认证、无假报告、无夸张实验结果、无水印。
- 允许出现人物、正面人物和正常工作场景；人物或人脸本身不作为拒绝或重生成理由。

## 发布与内链策略

- 每篇按主题优先链接 1 个允许使用的核心产品页或对应产品资料 PDF、1-2 篇已经发布或更早排期的相关文章，以及联系页或 Documents 页面；不为了数量堆叠链接。
- 规划已校验，不存在指向后续尚未发布文章的前向博客链接。
- 每篇独立编写 SEO Title 和 Description，不从文章标题机械截取。
- FAQ 只在存在独立搜索问题时使用；不以 FAQ 数量作为 SEO 质量指标。
- 高事实风险文章在写作时重新核对 FDA、欧盟委员会、ISO 或其他对应官方来源。

## 60 篇文章规划

| 编号 | 日期 | 业务 | 类型 | 英文标题 | Slug | 主关键词 | 搜索任务 | 目标买家 | 正文图 | 证据风险 |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | ---: | --- |
${planRows}

## 图片主题规划

| 编号 | 文章 | 封面图主题 | 正文图主题 |
| ---: | --- | --- | --- |
${imageRows}

## 执行顺序

1. 按编号生成源 HTML，先写正文，不直接入库。
2. 每篇完成搜索意图、事实边界、采购价值、内链和 HTML 自检。
3. 60 篇完成后做跨文章重复度、关键词竞争、模板句式和标题元数据审计。
4. 根据审计结果做第二轮优化，形成独立质量评审记录。
5. 根据本规划生成封面和正文图片，转为 WebP 并放入 \`public/images/blog/\`。
6. 备份 SQLite，暂停定时发布，通过只允许新 slug 的事务导入脚本写入草稿和 SEO 记录。
7. 从 2026-08-09 起按编号每天发布 1 篇；验证草稿隔离、图片、SEO、sitemap 和定时发布状态。

结构化数据源：\`工作流/scripts/content-plan-37-96.mjs\`。
`

writeFileSync(outputPath, markdown)
console.log(JSON.stringify({ outputPath, articles: plan.length, totalImages: plan.length + totalBodyImages }, null, 2))
