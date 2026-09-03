import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { batch, contentPlan } from './content-plan.mjs'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const outputPath = resolve(scriptDir, '..', '文章规划.md')

const rows = contentPlan.map((item) => [
  item.number,
  item.publishDate,
  item.title,
  `\`${item.primaryKeyword}\``,
  item.serpIntent,
  item.funnelStage,
  item.searchTask,
  `\`${item.nearestExistingPost}\``,
  item.differentiation,
  item.evidenceRisk,
].map((value) => String(value).replaceAll('|', '\\|')).join(' | '))

const markdown = `# 保鲜膜高转化文章规划（97–126）

- 批次：\`${batch.batchId}\`
- 数量：${contentPlan.length} 篇，全部为保鲜膜。
- 排期：${batch.scheduleStart} 至 ${batch.scheduleEnd}，北京时间每天 1 篇。
- 图片：每篇 1 张封面，正文图 0 张，共 ${batch.expectedImages} 张。
- 选题门槛：先对线上已发布文章、SQLite 全部文章状态和本批候选做搜索意图查重；标题换词但买家、采购阶段、决策任务和预期 SERP 相同的选题不得进入生产。
- 内容门槛：每篇必须提供一项存量内容未覆盖的决策工具或证据结构，不以统一字数、统一 FAQ、统一 CTA 或评分凑质量。

## 30 篇规划

| 编号 | 日期 | 英文标题 | 主关键词 | SERP 意图 | 采购阶段 | 买家任务 | 最近既有文章 | 不竞争说明 / 新增价值 | 风险 |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | :---: |
${rows.map((row) => `| ${row} |`).join('\n')}

## 内容结构分配

- 规格与设备：97–103。用测量表、兼容性字段和试单门槛解决尺寸、长度、厚度和机器适配。
- 场景采购：104–106。只写酒店、烘焙和中央厨房中可核对的站点、用量与补货决策，不写泛用途介绍。
- RFQ 去歧义与计算：107–110。用流程决策树、单位换算和单次覆盖成本模型避免错误询价。
- OEM 与供应商审核：111–119。拆解成本、样品、审厂、供应商角色、产能、刀版、标签和混合 MOQ。
- 贸易与物流：120–124。分别处理报价术语、运输模式、柜型、装载方式和混合 SKU 分配，禁止给出脱离实际箱规的万能装柜数。
- 文件与用途证据：125–126。只引用写作时重新核对的官方来源，并把文件/报告结论限制到具体 SKU、样品、用途、市场和版本。

## 交叉竞争处理规则

1. 每篇保留一个主查询和一个采购阶段；同义词只作为同一页的覆盖词，不拆成多篇。
2. 规格“选择”和规格“验收”分开：新文帮助买家先定目标，旧文继续负责量产测量与容差。
3. 场景文必须拥有独立的工作流、用量或设备约束；若写完后只剩“适合某行业”的泛描述，则删除该文并重新选题。
4. 物流文分别拥有 shipment mode、container size、loading method、SKU allocation 四个不同决策，不互相重复成本解释。
5. 新文只链接已发布文章；不得从较早排期文章链接到后续草稿。
`

writeFileSync(outputPath, markdown, 'utf8')
console.log(JSON.stringify({ outputPath, rows: contentPlan.length }, null, 2))
