# 开发记录

这个文件用于记录每次开发、修复、内容调整、构建发布和推送前后的重要变化。

## 记录规则

- 每次完成一组有意义的改动后，在顶部追加一条记录。
- 如果已经提交，补充 commit hash。
- 如果只是文档或内容改动，也要记录。
- 如果没有跑测试或构建，需要明确写出来。

## 2026-06-30 - 新增产品分类和产品管理 CRUD

背景：

- 产品原本写死在 `app/data/site.ts`，后台无法新增、编辑、删除产品。
- 用户要求增加产品分类模块和产品管理模块，并支持保鲜膜、一次性餐盒两级分类下的产品管理。
- 产品需要补充材料、MOQ、定制、包装、规格参数和多规格尺寸选项。

改动：

- 新增 `product_categories` 和 `products` 两张 SQLite 表。
- 默认初始化两个产品分类：`保鲜膜`、`一次性餐盒`。
- 将原静态产品作为初始数据导入数据库，并补充尺寸选项。
- 新增后台分类 CRUD API：`/api/admin/product-categories`。
- 新增后台产品 CRUD API：`/api/admin/products`。
- 新增公开产品接口：`/api/public/products` 和 `/api/public/products/:slug`。
- 新增 `/admin/products` 产品管理页面，一个页面内包含“产品列表”和“产品分类”两个 Tab。
- 产品表单支持图片上传、材料、MOQ、定制、包装、规格参数、尺寸选项、应用场景、排序和发布状态。
- 后台侧边栏和后台概览新增产品管理入口和统计。
- 前台产品列表、产品详情、首页产品分类、首页精选产品、页脚产品分类改为读取数据库。
- 产品新增/修改/删除时同步 SEO 条目，sitemap 自动包含数据库产品详情页。
- 产品结构化数据改为读取数据库产品。

验证：

- `pnpm build` 通过。
- 已重启 `3005` 生产服务。
- `/products` 返回 200。
- `/products/kraft-meal-box` 返回 200。
- `/api/public/products` 返回 2 个分类、8 个产品。
- `/api/public/products/kraft-meal-box` 返回产品材料和 3 条尺寸选项。
- `/admin/products` 登录后返回 200。
- `admin` / `admin123` 登录 API 返回 200。
- 临时创建、更新、删除产品分类成功。
- 临时创建、更新、删除产品成功。
- `/api/admin/stats` 返回 `productCategories=2`、`products=8`、`publishedProducts=8`。
- `/sitemap.xml` 包含产品详情 URL。

## 2026-06-30 - 修复后台移动导航点击后不展开

背景：

- 手机端点击后台汉堡菜单后，导航没有正常滑出。

改动：

- 修复 `app/layouts/admin.vue` 移动端右侧抽屉的位移控制。
- 移除静态 `translate-x-full` 与动态 `translate-x-0` 的 Tailwind 类名冲突，改为用内联 `transform` 明确控制开关状态。

验证：

- `pnpm build` 通过。
- 已重启 `3005` 生产服务。
- `/admin/login` 返回 200。
- `admin` / `admin123` 登录接口返回 200。
- `/admin/settings` 登录后返回 200。
- SSR 页面中移动抽屉已不再输出冲突的 `translate-x-full` 类，保留关闭态 `transform:translateX(100%)` 和移动端打开按钮。

## 2026-06-30 - 修复公网 3005、联系方式设置和后台移动端导航

背景：

- 用户反馈公网 `:3005` 无法访问、后台登录和博客编辑异常、首页联系按钮不对齐、右下角联系组件不能折叠。
- 用户要求新增后台联系方式配置能力，修复 sitemap 只输出路径的问题，并让管理面板支持手机端使用。

改动：

- 修正启动脚本，统一使用 `0.0.0.0:3005`，移除误生成的 `--host/` 和缓存类不规范目录。
- 将生产服务切换到 `.output/server/index.mjs`，避免开发服务动态模块导致的访问问题。
- 替换博客富文本编辑器为本地 `contenteditable` 编辑器，移除 TinyMCE 依赖。
- 修复首页联系 CTA 按钮宽度和间距，右下角联系组件默认折叠并可展开/收起。
- 新增 `site_settings` 数据表、后台设置 API、公共设置 API 和 `/admin/settings` 页面。
- 前台页头、页脚、首页、产品页、博客页、联系页统一读取站点联系方式设置。
- sitemap、robots 和结构化数据改为输出完整绝对 URL，未配置固定域名时按当前请求 Host 自动生成。
- 后台布局增加“网站设置”菜单，优化顶部标题区域。
- 后台手机端增加汉堡按钮和右侧滑出导航抽屉，移动端可访问所有管理模块。

涉及文件：

- `package.json`
- `.gitignore`
- `app/layouts/admin.vue`
- `app/components/SiteHeader.vue`
- `app/components/SiteFooter.vue`
- `app/components/WhatsAppFab.vue`
- `app/components/admin/RichTextEditor.client.vue`
- `app/composables/useSiteSettings.ts`
- `app/pages/admin/settings.vue`
- `app/pages/**`
- `server/utils/db.ts`
- `server/utils/site-settings.ts`
- `server/utils/seo.ts`
- `server/api/admin/settings/**`
- `server/api/public/settings.get.ts`
- `server/routes/sitemap.xml.get.ts`
- `server/routes/robots.txt.get.ts`

验证：

- `pnpm build` 通过。
- 已重启生产服务，当前监听 `0.0.0.0:3005`。
- `http://43.134.105.149:3005/` 返回 200。
- `admin` / `admin123` 登录 API 返回 200。
- `/admin/settings` 登录后返回 200。
- `/api/admin/settings` 返回站点设置。
- `/sitemap.xml` 输出 `http://43.134.105.149:3005/...` 完整 URL。
- `/robots.txt` 输出完整 sitemap 地址。
- `/api/public/seo?key=page:home` 的 JSON-LD 输出完整公网 URL。
- 环境没有 Chromium/Playwright，未生成真实手机截图；已通过 SSR HTML 确认移动端“打开导航”和右侧导航抽屉结构存在。

## 2026-06-30 - 初始化项目文档

背景：

- 需要建立 `docs/` 文档体系，后续开发、推送、状态变化都能持续记录。
- 已阅读项目结构、配置、核心数据、页面和组件。

改动：

- 新增文档索引。
- 新增项目总览。
- 新增当前项目状态快照。
- 新增开发记录模板。
- 新增待办清单。
- 新增推送检查清单。

涉及文件：

- `docs/README.md`
- `docs/PROJECT_OVERVIEW.md`
- `docs/PROJECT_STATE.md`
- `docs/DEVELOPMENT_LOG.md`
- `docs/TASKS.md`
- `docs/PUSH_CHECKLIST.md`

验证：

- 这是文档初始化，没有改业务代码。
- 未运行构建命令。

后续：

- 后续每次功能开发或推送前，按本文档规则追加记录。

## 2026-06-30 - 管理面板需求确认与规划

背景：

- 需要为当前 Nuxt 工厂站增加轻量管理面板。
- 已确认采用 VPS、SQLite、本地上传、单管理员、中文后台、TinyMCE、邮件 API 转发询盘。

改动：

- 新增管理面板开发规划文档。
- 明确后台模块、数据库表、环境变量、开发阶段和 SEO 能力范围。

涉及文件：

- `docs/ADMIN_PANEL_PLAN.md`
- `docs/README.md`
- `docs/DEVELOPMENT_LOG.md`

验证：

- 文档改动，未运行构建。

后续：

- 按规划开始实现后台基础设施、管理 API 和前台接入。

## 2026-06-30 - 完成轻量管理面板第一版

背景：

- 根据已确认需求开发 `/admin` 管理面板。
- 第一版覆盖 SEO、博客文章、询盘记录、邮件转发、社交链接。

改动：

- 新增 SQLite 数据层和自动建表/初始化逻辑。
- 新增单管理员登录、cookie session、后台路由保护。
- 新增后台布局和中文管理页面。
- 新增 SEO 管理 API 和页面，前台通过 `useManagedSeo` 接入。
- 新增博客 CRUD、TinyMCE 富文本编辑、HTML 源码编辑、封面图上传。
- 前台博客列表和详情改为读取数据库已发布文章。
- 前台询盘表单改为真实提交，必填姓名、邮箱、需求详情。
- 新增询盘后台查看、状态管理、删除和邮件重发。
- 新增 Resend 邮件转发逻辑，未配置 API key 时记录为 `skipped`。
- 新增社交链接后台管理，页脚改为动态读取。
- 新增 sitemap.xml、robots.txt、基础结构化数据。
- 新增 `.env.example` 和后台使用说明。
- 修正 `tsconfig.json` 为 Nuxt 配置。
- 忽略 SQLite 数据库和上传目录。

涉及文件：

- `app/pages/admin/**`
- `app/layouts/admin.vue`
- `app/middleware/admin-auth.global.ts`
- `app/components/admin/RichTextEditor.client.vue`
- `app/components/InquiryForm.vue`
- `app/components/SiteFooter.vue`
- `app/components/SocialIcon.vue`
- `app/composables/useManagedSeo.ts`
- `server/api/**`
- `server/routes/**`
- `server/utils/**`
- `.env.example`
- `.gitignore`
- `tsconfig.json`
- `docs/ADMIN_PANEL_USAGE.md`

验证：

- `pnpm build` 通过。
- 启动 `PORT=3000 node .output/server/index.mjs` 预览成功。
- 验证 `/`、`/blog`、`/blog/choosing-food-packaging-supplier`、`/products/pe-cling-film` 返回 200。
- 验证 `/admin/login` 返回 200。
- 登录后访问 `/admin` 返回 200。
- 验证 `/api/public/posts`、`/api/public/seo`、`/api/public/social-links`、`/sitemap.xml`。
- 验证表单提交写入询盘，未配置 `RESEND_API_KEY` 时邮件状态为 `skipped`。
- 验证后台博客新建和删除 API。

后续：

- 部署前配置正式环境变量。
- 配置 Resend API key 后做真实邮件发送测试。
- 后续可再扩展产品内容管理和公司信息管理。

## 2026-06-30 - 修复后台误加载前台布局

背景：

- 后台登录页不应该加载前台头部、页脚、WhatsApp 浮窗或前台公开接口。
- 原 `app.vue` 固定包裹了 `SiteHeader`、`SiteFooter`、`WhatsAppFab`，导致所有页面都会加载前台壳。

改动：

- 将前台壳移动到 `app/layouts/default.vue`。
- 将 `app/app.vue` 改为标准 `NuxtLayout + NuxtPage`。
- `/admin` 现在使用后台 layout，`/admin/login` 使用独立无布局页面。

涉及文件：

- `app/app.vue`
- `app/layouts/default.vue`

验证：

- `pnpm build` 通过。
- `http://localhost:3005/admin/login` 返回 200。
- 登录页 SSR 内容不再包含前台 header/footer/WhatsApp 相关文本。

## 2026-06-30 - 记录协作授权规则并还原登录页临时改动

背景：

- 排查后台登录页 500 问题时，曾临时把登录页改为原生表单。
- 用户要求还原该临时改动，并明确后续所有操作必须先文字汇报，得到授权后再执行。

改动：

- 还原 `app/pages/admin/login.vue` 为 Element Plus 登录页。
- 新增协作规则文档。
- 在文档索引中加入协作规则入口。

涉及文件：

- `app/pages/admin/login.vue`
- `docs/COLLABORATION_RULES.md`
- `docs/README.md`
- `docs/DEVELOPMENT_LOG.md`

验证：

- 本次仅按授权执行还原和文档记录，未运行构建或服务命令。

## 2026-06-30 - 后台账号改为普通管理员账号

背景：

- 后台登录应该是独立管理模块登录，不使用前台用户或邮箱账号结构。
- 用户指定后台账号密码为 `admin` / `admin123`。

改动：

- 后台认证从 `email/password` 改为 `username/password`。
- 默认管理员账号改为 `admin`，默认密码改为 `admin123`。
- 兼容已有 SQLite 管理员表，自动补充 `username` 字段。
- 更新登录页、环境变量示例和管理面板文档。

涉及文件：

- `server/utils/db.ts`
- `server/utils/auth.ts`
- `server/api/admin/auth/login.post.ts`
- `app/middleware/admin-auth.global.ts`
- `app/pages/admin/login.vue`
- `.env.example`
- `docs/ADMIN_PANEL_USAGE.md`
- `docs/ADMIN_PANEL_PLAN.md`
- `docs/PROJECT_STATE.md`
- `docs/DEVELOPMENT_LOG.md`

验证：

- 已重启 `3005` dev server，未启动 `3000`。
- `/admin/login` 返回 200，只显示后台登录页。
- `/admin` 未登录返回 302 到 `/admin/login?redirect=/admin`。
- `admin` / `admin123` 登录接口返回 `username: admin`。
- 登录后 `/admin` 返回后台概览和后台侧边栏，不再包含前台 Header/Footer/WhatsApp。
- dev server 输出未出现 500 或 `Invalid layout 'blank' selected`。

## 2026-06-30 - 兼容旧后台路径避免进入错误页

背景：

- 排查后台错误时，dev server 日志显示外部请求访问了不存在的旧路径：
  `/manage/account/login` 和 `/admin/index.html`。
- 源码中没有这些路径引用，判断为浏览器缓存、历史地址或旧入口导致。

改动：

- `/manage/account/login` 301 重定向到 `/admin/login`。
- `/admin/index.html` 301 重定向到 `/admin`。
- 后台路由中间件增加旧路径兜底处理。
- 登录成功后的 `redirect` 参数增加白名单清洗，避免跳回不存在的后台路径。

涉及文件：

- `app/middleware/admin-auth.global.ts`
- `app/pages/admin/login.vue`
- `server/routes/admin/index.html.get.ts`
- `server/routes/manage/account/login.get.ts`
- `docs/DEVELOPMENT_LOG.md`

验证：

- `http://localhost:3005/manage/account/login` 返回 301 到 `/admin/login`。
- `http://localhost:3005/admin/index.html` 返回 301 到 `/admin`。
- 未登录访问 `/admin/index.html` 最终进入 `/admin/login?redirect=/admin`。
- `admin` / `admin123` 登录后 `/admin` 返回后台概览。
- dev server 输出没有新的 500 或旧路径 `No match found`。

## 2026-06-30 - 修复错误启动导致项目不可访问

背景：

- 使用 `pnpm dev -- --host 0.0.0.0` 启动时，`--host` 被 Nuxt 当作项目目录参数处理。
- Nuxt 在空的 `--host/` 目录中生成缓存并显示默认欢迎页，导致实际项目页面和 API 没有被加载。

改动：

- 将 `pnpm dev` 默认改为 `nuxt dev --host 0.0.0.0 --port 3005`。
- 将 `pnpm preview` 默认改为 `nuxt preview --host 0.0.0.0 --port 3005`。
- `.gitignore` 增加 `--host/`，避免误生成目录进入版本控制。

涉及文件：

- `package.json`
- `.gitignore`
- `docs/DEVELOPMENT_LOG.md`

验证：

- `pnpm dev` 能正常监听 `0.0.0.0:3005` 并加载项目首页，不再显示 Nuxt 欢迎页。
- `/api/public/seo?key=page:home` 返回 JSON。
- `/admin/login` 返回 200。

提交：

- commit: `cf0565d`

## 2026-06-30 - 修复首页询盘 CTA 对齐和悬浮联系折叠

背景：

- 首页 `Start Your Inquiry` 区块中 Element Plus 相邻按钮默认左边距导致按钮错位。
- 右下角悬浮联系组件默认展开，占用页面空间，折叠状态不够明确。

改动：

- 首页询盘 CTA 按钮组统一清除 Element Plus 默认按钮左边距，确保三条按钮等宽对齐。
- 调整 CTA 卡片内边距、标题宽度和按钮组布局。
- 右下角悬浮联系组件默认折叠为小型 `Contact` 按钮。
- 展开后点击顶部红色条可重新折叠。

涉及文件：

- `app/pages/index.vue`
- `app/components/WhatsAppFab.vue`
- `docs/DEVELOPMENT_LOG.md`

验证：

- `pnpm build` 通过。
- `http://127.0.0.1:3005/` SSR 输出包含 `Start Your Inquiry`、`Open Inquiry Form` 和 `aria-label="Open contact options"`。

提交：

- commit: `3b21a29`

## 2026-06-30 - 修复公网后台登录动态模块错误

背景：

- 公网访问 `/admin/login` 后浏览器报错：`Failed to fetch dynamically imported module: /_nuxt/pages/admin/login.vue`。
- 该路径是 Nuxt dev server 的开发模块路径，公网访问不应长期运行 dev server，否则 HMR 和浏览器缓存容易导致动态导入失败。

改动：

- 将 `preview` 改为直接启动生产构建：`HOST=0.0.0.0 PORT=3005 node .output/server/index.mjs`。
- 增加同样的 `start` 脚本用于生产启动。
- 停止 3005 上的 dev server，改为运行 production server。

涉及文件：

- `package.json`
- `docs/DEVELOPMENT_LOG.md`

验证：

- `pnpm build` 通过。
- `http://43.134.105.149:3005/admin/login` 返回 200，页面引用生产 hash chunk，不再引用 `/_nuxt/pages/admin/login.vue`。
- POST `admin` / `admin123` 到 `/api/admin/auth/login` 返回 200 并设置 session cookie。
- 带 session cookie 访问 `/api/admin/auth/me` 返回 `username: admin`。
- 带 session cookie 访问 `/admin` 返回后台概览。

提交：

- commit: `未提交`

## 2026-06-30 - 增加导航语言切换预留组件

背景：

- 导航需要预留多语言切换入口，覆盖东南亚和其他主要语言。
- 当前网站尚未上线真正的多语言内容，用户切换时需要明确提示功能未上线。

改动：

- 新增 `LanguageSwitcher` 组件，使用 `flag-icons` 的国旗 SVG 素材。
- 桌面端导航右侧和移动端菜单都接入语言切换入口。
- 语言列表包含英文、印尼语、马来语、泰语、越南语、菲律宾语、缅甸语、高棉语、中文、日语、韩语、阿拉伯语、西班牙语、法语。
- 点击任意语言时显示英文提示：`Multilingual feature is not online yet.`
- 只按需导入使用到的国旗 SVG，避免引入完整国旗 CSS 造成构建资源过大。

涉及文件：

- `app/components/LanguageSwitcher.vue`
- `app/components/SiteHeader.vue`
- `package.json`
- `pnpm-lock.yaml`
- `docs/DEVELOPMENT_LOG.md`

验证：

- `pnpm build` 通过。
- 已重启公网 3005 服务。
- `http://43.134.105.149:3005/` 返回 200。
- 首页 SSR 输出包含 `Select language`、`English`、`Bahasa Indonesia`、`Bahasa Melayu`、`Thai`、`Vietnamese` 等语言选项。

提交：

- commit: `48d205e`

## 2026-06-30 - 压缩语言菜单和后台概览尺寸

背景：

- 导航语言下拉过长，鼠标在菜单上操作时容易和页面滚动产生冲突。
- 后台概览统计卡片和快捷入口尺寸过大，不符合管理面板高频操作的密度。

改动：

- 语言下拉改为紧凑两列布局，保留国旗、语言代码和英文语言名。
- 降低语言切换按钮高度、字体和下拉项高度。
- 给语言下拉菜单增加滚轮、触摸和指针事件隔离，并设置 `overscroll-behavior: contain`。
- 后台概览标题、刷新按钮、统计卡片和快捷入口整体收缩，统计卡片改为左右对齐的紧凑信息条。

涉及文件：

- `app/components/LanguageSwitcher.vue`
- `app/pages/admin/index.vue`
- `docs/DEVELOPMENT_LOG.md`

验证：

- `pnpm build` 通过。
- 已重启公网 3005 服务。
- `http://43.134.105.149:3005/` 返回 200，页面包含 `language-switcher-popper` 和语言选项。
- `http://43.134.105.149:3005/admin` 未登录时返回 302 到登录页。
- 使用后台 session 访问 `/admin` 可加载 `后台概览`，页面输出包含新的紧凑尺寸类。

提交：

- commit: `cf0565d`

## 2026-06-30 - 重做前台导航交互和全局进入动效

背景：

- 前台导航 hover、active 和移动端展开缺少明确交互反馈。
- 品牌文字在不同屏幕下需要更合理的显示方式，避免挤压导航和按钮。
- 前台页面缺少进入和渐进式加载效果。

改动：

- 重做前台导航品牌区，桌面显示完整 `YIYUAN NEW MATERIALS` 和副标题，手机显示 `YIYUAN` 与短副标题。
- 桌面导航新增 hover 底色、位移、下划线动画和 active 状态。
- `Products` 导航新增紧凑型产品分类下拉。
- 移动端菜单按钮支持打开/关闭状态切换，菜单增加 slide/fade 过渡。
- 新增 Nuxt 页面切换动画。
- 新增前台视口渐显 client 插件，自动处理 section/card 进入视口效果，并排除后台路由。
- 全局按钮增加轻量 hover 反馈，并支持 `prefers-reduced-motion`。

涉及文件：

- `app/components/SiteHeader.vue`
- `app/app.vue`
- `app/assets/css/main.css`
- `app/plugins/reveal.client.ts`
- `docs/DEVELOPMENT_LOG.md`

验证：

- `pnpm build` 通过。
- 已重启公网 3005 服务。
- `http://43.134.105.149:3005/` 返回 200。
- `http://43.134.105.149:3005/products` 返回 200。
- `http://43.134.105.149:3005/admin` 未登录时返回 302 到登录页。
- 首页 SSR 输出包含 `site-brand`、`site-nav-link`、`site-nav-dropdown`、`site-mobile-toggle`、`YIYUAN NEW MATERIALS`、`Export Factory`。
- 当前环境没有 Chromium/Playwright，未做浏览器截图验证。

提交：

- commit: `9e26c1a`

## 2026-06-30 - 修复前台导航和联系页对齐回归

背景：

- 全局视口渐显插件会让前台内容先变透明，浏览器未触发时导致页面内容不可见。
- 桌面端不应显示手机端菜单按钮。
- Logo hover 不需要变色。
- 联系页 `Quick Contact` 模块两个按钮受 Element Plus 默认按钮间距影响，出现不对齐。

改动：

- 移除 Nuxt 页面 transition 和 `reveal.client.ts`，正文内容恢复直接显示。
- 删除 `.reveal-item`、页面 transition 相关全局 CSS。
- 桌面断点下强制隐藏 `.site-mobile-toggle`。
- 移除 Logo hover 变色、上浮和阴影。
- 导航 active 状态改为明确深蓝底白字，hover 保持浅底和红色下划线。
- 联系页 `Quick Contact` 按钮改为 `grid gap` 布局，并清除按钮默认左边距，允许 WhatsApp 长文本自动高度居中。

涉及文件：

- `app/components/SiteHeader.vue`
- `app/pages/contact.vue`
- `app/app.vue`
- `app/assets/css/main.css`
- `app/plugins/reveal.client.ts`
- `docs/DEVELOPMENT_LOG.md`

验证：

- `pnpm build` 通过。
- 已重启公网 3005 服务。
- `http://43.134.105.149:3005/` 返回 200。
- `http://43.134.105.149:3005/products` 返回 200。
- `http://43.134.105.149:3005/contact` 返回 200。
- 联系页 SSR 输出包含 `Quick Contact`、`WhatsApp +86 131 0382 3508`、`Send Email` 和按钮修正类。
- 首页 SSR 输出不再包含 `reveal-item` 或 `page-enter`。

提交：

- commit: `212bc7e`

## 2026-06-30 - 增加站点 Logo 和 Favicon 设置

背景：

- 使用用户提供的 GPT 生成图片作为网站 logo 和网页 ico 图标。
- 后台网站设置需要支持图标上传替换，便于后续维护。

改动：

- 将源图等比例处理为 `100x100` PNG：`public/site-logo.png`。
- 生成 `60x60` ICO：`public/favicon.ico`。
- 增加站点设置字段 `logoPath` 和 `faviconPath`，默认指向上述静态资源。
- 前台导航 logo 改为读取 `logoPath` 图片。
- 默认布局和 Nuxt head 增加 favicon/apple-touch-icon。
- 结构化数据中的 Organization logo 改为读取后台设置。
- 后台网站设置页增加 Logo 和 ICO 预览、路径编辑和上传替换控件。
- 上传接口支持 `image/x-icon` 和 `image/vnd.microsoft.icon`。

涉及文件：

- `public/site-logo.png`
- `public/favicon.ico`
- `app/components/SiteHeader.vue`
- `app/layouts/default.vue`
- `app/pages/admin/settings.vue`
- `app/composables/useSiteSettings.ts`
- `nuxt.config.ts`
- `server/utils/site-settings.ts`
- `server/utils/db.ts`
- `server/utils/seo.ts`
- `server/api/admin/uploads.post.ts`
- `docs/DEVELOPMENT_LOG.md`

验证：

- `pnpm build` 通过。
- 已重启公网 3005 服务。
- `http://43.134.105.149:3005/site-logo.png` 返回 200，Content-Type 为 `image/png`。
- `http://43.134.105.149:3005/favicon.ico` 返回 200，Content-Type 为 `image/vnd.microsoft.icon`。
- `/api/public/settings` 返回 `logoPath` 和 `faviconPath`。
- 首页 SSR 输出包含 `/site-logo.png`、`/favicon.ico`、`site-brand__logo`。
- 登录后台后 `/admin/settings` 输出包含 `网站 Logo 图标`、`网页 ICO 图标`、`上传替换 Logo`、`上传替换 ICO`。

提交：

- commit: `3b21a29`

## 2026-06-30 - 修复导航吸顶范围、全局滚动条和底部 Logo

背景：

- 页面下滑时不应让顶部工具栏和滚动信息条一起固定，只需要主导航置顶悬浮。
- 网站底部仍显示旧的 `Y` 标识，没有使用全局 Logo。
- 默认滚动条视觉过重，需要改成更极简、极窄的样式。

改动：

- 将 `SiteHeader` 的吸顶范围从整个 header 调整为主导航和移动端菜单区域。
- 顶部工具栏和信息滚动条恢复为普通文档流，下滑后会自然离开视口。
- 底部桌面端和移动端品牌标识统一读取 `company.logoPath`，默认回退 `/site-logo.png`。
- 全局 CSS 增加窄滚动条样式，Firefox 和 WebKit 浏览器均覆盖。

涉及文件：

- `app/components/SiteHeader.vue`
- `app/components/SiteFooter.vue`
- `app/assets/css/main.css`
- `docs/DEVELOPMENT_LOG.md`

验证：

- `pnpm build` 通过。
- 已重启公网 3005 服务。
- `http://43.134.105.149:3005/` 返回 200。
- `http://43.134.105.149:3005/site-logo.png` 返回 200，Content-Type 为 `image/png`。
- `http://43.134.105.149:3005/favicon.ico` 返回 200，Content-Type 为 `image/vnd.microsoft.icon`。
- 首页 SSR 输出包含 `/site-logo.png`、`favicon.ico`、`site-header__sticky`、`site-header__utility` 和 `info-marquee`。

提交：

- commit: `0e66ed3`

## 2026-06-30 - 调整全局 Logo 显示尺寸和底部品牌布局

背景：

- 导航和网站底部的 Logo 视觉尺寸偏小。
- 底部 Logo 需要和导航 Logo 保持一致的白底细边框样式。
- 底部品牌信息堆叠过密，需要避免公司名重复感并重新梳理信息层级。

改动：

- 导航 Logo 容器从 `36px` 调整为 `42px`，图片显示比例提升到 `108%`。
- 底部桌面端 Logo 调整为 `52px`，移动端调整为 `50px`。
- 底部新增 `site-footer-logo` 样式，统一白底、细边框、方形裁切和轻外描边。
- 重新设计底部品牌区，公司名、法定名称、标语和工厂信息分层展示。
- 地址、成立时间、注册资本改成紧凑信息块，移动端小屏自动改为纵向排列。

涉及文件：

- `app/components/SiteHeader.vue`
- `app/components/SiteFooter.vue`
- `docs/DEVELOPMENT_LOG.md`

验证：

- `pnpm build` 通过。
- 已重启公网 3005 服务。
- `http://43.134.105.149:3005/` 返回 200。
- 首页 SSR 输出包含 `/site-logo.png`、`site-brand__mark`、`site-footer-logo`、`site-footer-brand__facts` 和 `site-footer-mobile-brand__facts`。

提交：

- commit: `未提交`

## 记录模板

```markdown
## YYYY-MM-DD - 标题

背景：

- 为什么做这次改动？

改动：

- 改了什么？

涉及文件：

- `path/to/file`

验证：

- 跑了哪些命令？
- 结果如何？

提交：

- commit: `未提交` 或 `hash`

后续：

- 还有什么风险、待办或需要确认？
```
