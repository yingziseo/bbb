# 项目总览

最后更新：2026-06-30

## 项目定位

这是一个面向海外采购客户的 B2B 工厂展示站，品牌为 `YIYUAN NEW MATERIALS`，核心业务内容是保鲜膜、食品包装材料、一次性餐盒和 OEM 定制包装。

网站目标：

- 展示公司基本信息和工厂能力。
- 展示产品分类、产品详情和典型规格。
- 通过联系页、WhatsApp、邮箱入口收集询盘。
- 通过博客文章承接采购指南、材料说明和 SEO 内容。

## 技术栈

- Nuxt 4
- Vue 3.5
- TypeScript
- Element Plus
- Tailwind CSS 4，使用 `@tailwindcss/vite`
- `@nuxt/image`
- Node 24 内置 `node:sqlite`
- TinyMCE
- Resend HTTP API，用于询盘邮件转发

主要命令：

```bash
pnpm dev
pnpm build
pnpm preview
pnpm prepare
```

## 目录结构

```text
app/
  app.vue
  assets/css/main.css
  components/
  composables/
  layouts/
  middleware/
  data/site.ts
  pages/
server/
  api/
  routes/
  utils/
public/
  images/
docs/
```

关键文件：

- `app/app.vue`：全局布局，挂载头部、页面、页脚和 WhatsApp 浮窗。
- `app/data/site.ts`：公司信息、跑马灯内容、产品分类、产品数据、博客数据。
- `app/assets/css/main.css`：Tailwind 入口、主题变量、Element Plus 全局样式覆盖、通用 section/container 样式。
- `nuxt.config.ts`：Nuxt 模块、全局 CSS、页面 head 和基础 SEO 配置。

## 路由

| 路由 | 文件 | 说明 |
| --- | --- | --- |
| `/` | `app/pages/index.vue` | 首页，包含 hero、分类、工厂概览、车间、OEM、产品、质量和联系区块 |
| `/products` | `app/pages/products/index.vue` | 产品列表，支持 `category` 查询参数过滤 |
| `/products/[slug]` | `app/pages/products/[slug].vue` | 产品详情页，从 `products` 数组按 slug 查找 |
| `/about` | `app/pages/about.vue` | 公司和工厂信息 |
| `/blog` | `app/pages/blog/index.vue` | 博客列表，第一篇作为 featured |
| `/blog/[slug]` | `app/pages/blog/[slug].vue` | 博客详情页，从 `posts` 数组按 slug 查找 |
| `/contact` | `app/pages/contact.vue` | 询盘表单和联系方式 |
| `/admin` | `app/pages/admin/index.vue` | 后台概览，需要登录 |
| `/admin/login` | `app/pages/admin/login.vue` | 后台登录 |
| `/admin/seo` | `app/pages/admin/seo/index.vue` | SEO 管理 |
| `/admin/posts` | `app/pages/admin/posts/index.vue` | 博客文章管理 |
| `/admin/inquiries` | `app/pages/admin/inquiries/index.vue` | 询盘记录管理 |
| `/admin/social-links` | `app/pages/admin/social-links.vue` | 社交链接管理 |

## 核心组件

| 组件 | 作用 |
| --- | --- |
| `SiteHeader.vue` | 顶部联系方式、跑马灯、桌面/移动导航、询盘按钮 |
| `SiteFooter.vue` | 合规跑马灯、社交图标、产品/公司/联系链接、移动端折叠区块 |
| `InfoMarquee.vue` | 可复用跑马灯组件 |
| `ProductCard.vue` | 产品卡片，包含详情和询盘入口 |
| `InquiryForm.vue` | Element Plus 表单校验和模拟提交 |
| `SectionHeading.vue` | 通用区块标题 |
| `WhatsAppFab.vue` | 固定右下角联系浮窗 |
| `SocialIcon.vue` | 页脚和后台共用社交平台图标 |
| `admin/RichTextEditor.client.vue` | TinyMCE 富文本编辑器 |

## 数据模型

数据目前集中在 `app/data/site.ts`：

- `company`：品牌、公司名、邮箱、WhatsApp、电话、地址、成立年份、注册资本等。
- `categories`：4 个产品分类。
- `products`：8 个产品，包含 slug、名称、分类、图片、材质、MOQ、规格、应用场景和包装信息。
- `posts`：3 篇博客文章，包含 slug、标题、日期、分类、摘要、封面、阅读时间和正文段落。

产品详情页和博客详情页都依赖 slug 精确匹配。新增产品或文章时，需要保证 slug 唯一。

博客文章、SEO、询盘和社交链接现在存储在 SQLite 中。旧的 `posts` 数组只作为首次初始化种子。

## 视觉与交互

整体风格是工业 B2B 工厂站：

- 主色：深蓝 `#0f2a4a`。
- 强调色：红色 `#c1121f`。
- 组件风格：直角、边框明显、信息密度较高。
- 图片资产集中在 `public/images/`。

主要交互：

- 产品列表支持分类过滤，并同步到 URL 查询参数。
- 产品详情和产品卡片可跳转到带 `product` 查询参数的联系页。
- 联系表单仅做前端校验和模拟提交。
- WhatsApp 和邮箱使用外部链接或 `mailto:`。

## SEO 与 head

全局 head 在 `nuxt.config.ts` 中配置：

- `lang="en"`
- 默认 title
- description
- viewport
- theme-color

页面级 SEO 通过后台 `seo_entries` 配置，并由 `useManagedSeo` 接入。当前已支持 sitemap、robots、Open Graph 和基础结构化数据。

## 当前注意点

- `InquiryForm.vue` 已接入真实提交接口，邮件转发依赖 `RESEND_API_KEY`。
- SQLite 数据库和上传目录是运行时数据，需要服务器持久化和备份。
- 页脚社交平台链接已改为后台管理。
- 合规、认证、产能等宣传内容需要业务侧确认真实材料后再用于正式投放。
