# 项目总览

最后更新：2026-07-02

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
pnpm dev      # 0.0.0.0:3000
pnpm build
pnpm preview  # 0.0.0.0:3000
pnpm start    # 0.0.0.0:3000
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

- `app/app.vue`：根据路由选择前台默认布局、后台布局或登录页空布局。
- `app/layouts/default.vue`：前台全局布局，挂载头部、页面、页脚和 WhatsApp 浮窗。
- `app/data/site.ts`：公司信息默认值、跑马灯内容和产品/博客初始化种子数据。
- `app/assets/css/main.css`：Tailwind 入口、主题变量、Element Plus 全局样式覆盖、通用 section/container 样式。
- `nuxt.config.ts`：Nuxt 模块、全局 CSS、页面 head 和基础 SEO 配置。

## 路由

| 路由 | 文件 | 说明 |
| --- | --- | --- |
| `/` | `app/pages/index.vue` | 首页，包含 hero、分类、工厂概览、车间、OEM、产品、质量和联系区块 |
| `/products` | `app/pages/products/index.vue` | 产品列表，从公开产品接口读取数据库产品 |
| `/products/category/[slug]` | `app/pages/products/category/[slug].vue` | 产品分类页，从数据库分类和产品读取 |
| `/products/[slug]` | `app/pages/products/[slug].vue` | 产品详情页，从公开产品接口按 slug 查找 |
| `/about` | `app/pages/about.vue` | 公司和工厂信息 |
| `/blog` | `app/pages/blog/index.vue` | 博客列表，从数据库读取已发布文章 |
| `/blog/page/[page]` | `app/pages/blog/page/[page].vue` | 博客分页列表 |
| `/blog/[slug]` | `app/pages/blog/[slug].vue` | 博客详情页，从公开文章接口按 slug 查找 |
| `/contact` | `app/pages/contact.vue` | 询盘表单和联系方式 |
| `/like` | `app/pages/like/index.vue` | 后台概览，需要登录 |
| `/like/login` | `app/pages/like/login.vue` | 后台登录 |
| `/like/seo` | `app/pages/like/seo/index.vue` | 页面 TDK 管理 |
| `/like/products` | `app/pages/like/products.vue` | 产品分类和产品管理 |
| `/like/home-popup` | `app/pages/like/home-popup.vue` | 首页弹窗管理 |
| `/like/posts` | `app/pages/like/posts/index.vue` | 博客文章管理 |
| `/like/inquiries` | `app/pages/like/inquiries/index.vue` | 询盘记录管理 |
| `/like/mail-forwarding` | `app/pages/like/mail-forwarding.vue` | 询盘邮件转发管理 |
| `/like/settings` | `app/pages/like/settings.vue` | 网站设置 |
| `/like/social-links` | `app/pages/like/social-links.vue` | 社交链接管理 |
| `/like/friend-links` | `app/pages/like/friend-links.vue` | 友情链接管理 |

## 核心组件

| 组件 | 作用 |
| --- | --- |
| `SiteHeader.vue` | 顶部联系方式、跑马灯、桌面/移动导航、询盘按钮 |
| `SiteFooter.vue` | 合规跑马灯、社交图标、产品/公司/联系链接、移动端折叠区块 |
| `InfoMarquee.vue` | 可复用跑马灯组件 |
| `ProductCard.vue` | 产品卡片，包含详情和询盘入口 |
| `InquiryForm.vue` | Element Plus 表单校验和真实询盘提交 |
| `SectionHeading.vue` | 通用区块标题 |
| `WhatsAppFab.vue` | 固定右下角联系浮窗 |
| `SocialIcon.vue` | 页脚和后台共用社交平台图标 |
| `admin/RichTextEditor.client.vue` | TinyMCE 富文本编辑器 |
| `ArticleToc.client.vue` | 博客详情页桌面端悬浮文章目录 |

## 数据模型

当前主要运行数据存储在 SQLite，默认路径为 `data/yiyuan.db`：

- `site_settings`：品牌、联系方式、Logo/Favicon、首页弹窗、邮件转发配置等站点设置。
- `product_categories`：产品分类、分类 TDK 和排序/启用状态。
- `products`：产品详情、图片、材质、MOQ、规格、尺寸选项、应用场景、包装、产品 TDK 和发布状态。
- `posts`：博客文章、封面图、正文 HTML、SEO 字段和发布状态。
- `seo_entries`：页面 TDK、canonical、robots、OG 和结构化数据相关配置。
- `inquiries`：前台询盘记录、处理状态和邮件发送状态。
- `social_links`：页脚社交平台链接。
- `friend_links`：页脚友情链接。
- `admin_users`、`sessions`、`uploaded_files`：后台账号、登录会话和上传文件记录。

`app/data/site.ts` 仍保留公司默认值、跑马灯内容和产品/博客初始化种子数据。产品详情页、分类页和博客详情页都依赖 slug 精确匹配，新增产品、分类或文章时需要保证 slug 唯一。

## 视觉与交互

整体风格是工业 B2B 工厂站：

- 主色：深蓝 `#0f2a4a`。
- 强调色：红色 `#c1121f`。
- 组件风格：直角、边框明显、信息密度较高。
- 图片资产集中在 `public/images/`。

主要交互：

- 产品列表和正式分类页从数据库读取产品数据。
- 产品详情和产品卡片可跳转到带 `product` 查询参数的联系页。
- 联系表单提交到 `/api/inquiries`，写入 SQLite 并尝试邮件转发。
- WhatsApp 和邮箱使用外部链接或 `mailto:`。
- 语言切换入口仅保留在手机端，当前作为多语言预留入口。
- 博客详情页桌面端显示悬浮文章目录，手机端不显示目录。
- 页脚友情链接由后台维护；桌面端在页脚底部横向展示，手机端与 Products、Company、Contact 一样折叠显示，默认收起。

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
- 当前生产服务按 `3000` 端口口径运行；旧文档和历史日志中的 `3005` 属于历史记录。
- SQLite 数据库和上传目录是运行时数据，需要服务器持久化和备份。
- 产品、博客、页面 TDK、询盘、邮件转发、首页弹窗、网站设置、社交链接和友情链接均已有后台管理入口。
- 合规、认证、产能等宣传内容需要业务侧确认真实材料后再用于正式投放。
