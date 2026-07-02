# 开发记录

这个文件用于记录每次开发、修复、内容调整、构建发布和推送前后的重要变化。

## 记录规则

- 每次完成一组有意义的改动后，在顶部追加一条记录。
- 如果已经提交，补充 commit hash。
- 如果只是文档或内容改动，也要记录。
- 如果没有跑测试或构建，需要明确写出来。

## 2026-07-02 - 精简首页询盘区和页脚联系方式

背景：

- 用户反馈首页底部 Contact 区右侧 `Get a Quote / Start Your Inquiry` CTA 与现有联系方式重复，信息过多。
- 用户要求页脚能力标签补足 4 个，并要求页脚 Contact 里电话、邮箱、地址直接显示，不再加 `Phone / Email / Address` 标签。

改动：

- 删除首页 Contact 区右侧重复 CTA 卡片，保留左侧联系方式。
- 页脚能力标签从 3 个补为 4 个：`Wholesale Orders`、`OEM/ODM Packing`、`Sample Support`、`Export Support`。
- 页脚 Contact 列删除 `Phone / Email / Address` 前置标签，改为直接显示电话、邮箱和地址。
- 未涉及数据库、API、后台管理逻辑或数据迁移。

涉及文件：

- `app/pages/index.vue`
- `app/components/SiteFooter.vue`
- `docs/DEVELOPMENT_LOG.md`

验证：

- `NODE_OPTIONS=--max-old-space-size=1536 ionice -c2 -n7 nice -n 15 pnpm build` 通过。
- 构建存在既有警告：VueUse pure 注释、TinyMCE CSS `2of`、部分 chunk 超 500 kB、`node:sqlite` external、`@nuxt/image` sharp binaries 警告；未阻断构建。
- 已重启 `3000` 生产服务，当前监听 `127.0.0.1:3000`，PID `2144595`。
- `http://127.0.0.1:3000/` 返回 200。
- `http://127.0.0.1:3000/api/public/friend-links` GET 返回 200。
- `https://yiyuanpack.com/` 返回 200。
- 本机和公网首页 HTML 已确认包含 `Export Support`，不再包含首页 Contact 区的 `Start Your Inquiry` 和 `Open Inquiry Form`。

## 2026-07-02 - 重新设计前台页脚视觉结构

背景：

- 用户反馈前台底部视觉效果差，需要重新设计 footer。
- 本次只调整前台展示层，保留后台友情链接数据、现有公开 API 和站点设置数据来源。

改动：

- 桌面端页脚重做为品牌行动区、Export Supplier 信息区、Products / Company / Contact 三列内容区，以及底部低调横向 `Friend Links` 区域。
- 手机端保留原有折叠交互，重做品牌展示、CTA 按钮、折叠标题、联系信息和友情链接列表样式。
- 社交链接只展示已配置 URL 的可点击平台，去掉空 URL 的灰色占位图标。
- 友情链接仍从 `/api/public/friend-links` 读取；当前后台友链名称仍为 `link`，本次未改后台数据。
- 未涉及数据库、API、后台管理逻辑或数据迁移。

涉及文件：

- `app/components/SiteFooter.vue`
- `docs/DEVELOPMENT_LOG.md`

验证：

- `NODE_OPTIONS=--max-old-space-size=1536 ionice -c2 -n7 nice -n 15 pnpm build` 通过。
- 构建存在既有警告：VueUse pure 注释、TinyMCE CSS `2of`、部分 chunk 超 500 kB、`node:sqlite` external、`@nuxt/image` sharp binaries 警告；未阻断构建。
- 已重启 `3000` 生产服务，当前监听 `127.0.0.1:3000`，PID `2093428`。
- `http://127.0.0.1:3000/` 返回 200。
- `http://127.0.0.1:3000/api/public/friend-links` GET 返回 200。
- `https://yiyuanpack.com/` 返回 200。
- 本机与公网首页 HTML 已确认包含新 footer 输出：`site-footer-friend-links`、`Friend Links`、`Request Export Quote`。

## 2026-07-02 - 修正页脚品牌区居中层级

背景：

- 用户反馈页脚品牌区仍然堆叠过多信息，Logo、品牌名、描述、公司全称和 metadata 混在一起，视觉层级不清晰。
- 用户明确要求品牌区按 Logo、`YIYUAN NEW MATERIALS`、`Food packaging and cling film export supplier.` 居中展示。

改动：

- 页脚品牌区删除法定公司名、地点、成立年份和注册资本 metadata。
- 桌面端品牌区改为 Logo 与品牌名居中一行，描述文案在下方居中显示。
- 手机端品牌区同步改为 Logo 与品牌名居中一行，描述文案下方居中显示。
- 页脚 Logo 从 `NuxtImg` 改为原生 `img`，避免图片处理异常时显示 alt 文本造成品牌名重复。

涉及文件：

- `app/components/SiteFooter.vue`
- `docs/DEVELOPMENT_LOG.md`

验证：

- `NODE_OPTIONS=--max-old-space-size=1536 ionice -c2 -n7 nice -n 15 pnpm build` 通过。
- 构建存在既有警告：TinyMCE CSS `2of`、部分 chunk 超 500 kB、`@nuxt/image` sharp binaries 警告；未阻断构建。
- 已重启 `3000` 生产服务，当前监听 `127.0.0.1:3000`，PID `2057082`。
- `http://127.0.0.1:3000/` 返回 200。
- `http://127.0.0.1:3000/api/public/friend-links` 返回 200。
- 源站 HTTPS 直连 `https://yiyuanpack.com/` 返回 200。
- 首页 HTML 已确认页脚品牌区使用原生 Logo 图片，保留描述文案，并移除法定公司名和 metadata 信息块。

提交：

- commit: `7e8b32a`

## 2026-07-02 - 精简顶部信息和优化页脚层级

背景：

- 用户反馈顶部电话、邮箱和业务短句同时展示过于杂乱，需要删除顶部信息条。
- 用户要求电脑端页脚更简单、干脆、清爽、明朗，减少重复信息和杂乱层级。

改动：

- 删除前台顶部深蓝联系方式工具栏，移除电话、邮箱和业务短句展示。
- 桌面端页脚品牌区精简为 Logo、品牌名、简短定位、法定公司名和一行公司 metadata。
- 桌面端公司事实信息从三格卡片改为一行弱化文本。
- 桌面端 Contact 区电话和邮箱改为可点击链接，地址弱化显示。
- 手机端页脚品牌信息同步精简，去掉三格事实卡片。
- 友情链接保持桌面底部横向展示、手机端折叠展示。
- 同步项目总览中 `SiteHeader` 的组件说明。

涉及文件：

- `app/components/SiteHeader.vue`
- `app/components/SiteFooter.vue`
- `docs/DEVELOPMENT_LOG.md`
- `docs/PROJECT_OVERVIEW.md`

验证：

- `NODE_OPTIONS=--max-old-space-size=1536 ionice -c2 -n7 nice -n 15 pnpm build` 通过。
- 构建存在既有警告：TinyMCE CSS `2of`、部分 chunk 超 500 kB、`@nuxt/image` sharp binaries 警告；未阻断构建。
- 已重启 `3000` 生产服务，当前监听 `127.0.0.1:3000`，PID `2001823`。
- `http://127.0.0.1:3000/` 返回 200。
- `http://127.0.0.1:3000/api/public/friend-links` 返回 200。
- 源站 HTTPS 直连 `https://yiyuanpack.com/` 返回 200。
- 首页 HTML 已确认不再包含顶部业务短句和 `site-header__utility` 结构。

提交：

- commit: `30f4365`

## 2026-07-02 - 调整页脚友情链接为横向展示

背景：

- 用户要求 `Friend Links` 不要作为页脚竖向栏目展示，需要单独在底部横向显示一行友情链接。
- 手机端仍保持折叠展示。

改动：

- 桌面端页脚主内容恢复为品牌、Products、Company、Contact 四列。
- 友情链接从桌面端主网格中移出，改到四列内容下方，单独一行横向排列。
- 桌面端横向友链只显示链接名称，不显示描述。
- 手机端 `Friend Links` 折叠区块保持不变。
- 同步文档中关于友情链接展示方式的描述。

涉及文件：

- `app/components/SiteFooter.vue`
- `docs/ADMIN_PANEL_USAGE.md`
- `docs/DEVELOPMENT_LOG.md`
- `docs/PROJECT_OVERVIEW.md`
- `docs/PROJECT_STATE.md`

验证：

- `NODE_OPTIONS=--max-old-space-size=1536 ionice -c2 -n7 nice -n 15 pnpm build` 通过。
- 构建存在既有警告：TinyMCE CSS `2of`、部分 chunk 超 500 kB、`@nuxt/image` sharp binaries 警告；未阻断构建。
- 已重启 `3000` 生产服务，当前监听 `127.0.0.1:3000`，PID `1953498`。
- `http://127.0.0.1:3000/` 返回 200。
- `http://127.0.0.1:3000/api/public/friend-links` 返回 200。
- 源站 HTTPS 直连 `https://yiyuanpack.com/` 返回 200。

提交：

- commit: `685e9d7`

## 2026-07-02 - 优化顶部导航、博客目录并新增友情链接模块

背景：

- 用户要求顶部业务文案更贴近海外采购、OEM/ODM 贴牌代工和定制加工。
- 用户要求电脑端移除多余语言切换组件，只保留手机端语言预留入口。
- 用户要求博客详情页目录大纲只在电脑端悬浮跟随滚动，手机端不显示。
- 用户要求新增友情链接模块，后台支持管理，页脚手机端与 Products、Company、Contact 一样折叠显示。
- 用户确认当前线上端口口径应为 `3000`，部分文档仍保留历史 `3005` 和旧后台/数据模型口径，需要同步当前状态。

改动：

- 顶部工具栏文案改为 `Overseas Sourcing | OEM/ODM Private Label | Custom Processing`。
- 顶部跑马灯相关词改为 `OEM/ODM Private Label` 和 `Custom Processing`。
- 移除桌面端导航右侧语言切换组件，手机端保留 compact 语言切换入口。
- 博客 `ArticleToc` 移除手机端 `Outline` 入口和底部弹层，仅桌面端显示；sticky 改到目录根容器，增强跟随滚动稳定性。
- 新增 `friend_links` SQLite 表。
- 新增后台友情链接 CRUD API：`/api/admin/friend-links`。
- 新增公开友情链接接口：`/api/public/friend-links`。
- 新增后台页面 `/like/friend-links`，支持名称、URL、描述、启用、排序和新窗口打开。
- 页脚桌面端新增低优先级 `Friend Links` 链接列；手机端新增默认折叠的 `Friend Links` 区块。
- 后台侧边栏整理为 `总览`、`内容管理`、`询盘转化`、`站点配置` 四组，并加入友情链接入口。
- 后台概览增加友情链接统计和快捷入口。
- `package.json` 的 `dev`、`preview`、`start` 端口统一为 `3000`。
- 同步更新项目文档，修正当前后台路径 `/like`、当前数据模型、当前端口和友情链接模块说明。

涉及文件：

- `app/components/SiteHeader.vue`
- `app/components/ArticleToc.client.vue`
- `app/components/SiteFooter.vue`
- `app/data/site.ts`
- `app/layouts/admin.vue`
- `app/pages/like/index.vue`
- `app/pages/like/friend-links.vue`
- `server/utils/db.ts`
- `server/utils/serializers.ts`
- `server/api/admin/friend-links/*`
- `server/api/public/friend-links.get.ts`
- `server/api/admin/stats.get.ts`
- `package.json`
- `AGENTS.md`
- `docs/ADMIN_PANEL_PLAN.md`
- `docs/ADMIN_PANEL_USAGE.md`
- `docs/PROJECT_OVERVIEW.md`
- `docs/PROJECT_STATE.md`
- `docs/PUSH_CHECKLIST.md`
- `docs/TASKS.md`
- `docs/DEVELOPMENT_LOG.md`

验证：

- 已备份 SQLite：`data/backups/yiyuan-before-friend-links-20260702_210437.db`。
- `NODE_OPTIONS=--max-old-space-size=1536 ionice -c2 -n7 nice -n 15 pnpm build` 通过。
- 构建存在既有警告：TinyMCE CSS `2of`、部分 chunk 超 500 kB、`@nuxt/image` sharp binaries 警告；未阻断构建。
- 新构建先在 `127.0.0.1:3010` 临时验证，通过后停止临时服务。
- 临时服务验证：后台登录 200、`/like/friend-links` 200、创建/公开读取/删除临时友链接口均 200。
- 已停止旧 `3000` 生产进程，保留旧进程环境变量启动新生产进程，当前监听 `127.0.0.1:3000`，PID `1931508`。
- `http://127.0.0.1:3000/` 返回 200，输出新顶部文案，不再输出旧顶部文案。
- `http://127.0.0.1:3000/blog/pe-vs-pvc-cling-film` 返回 200，不再输出手机端 `Outline` 文案。
- `http://127.0.0.1:3000/api/public/friend-links` 返回 200，当前 `items` 为 0。
- 使用当前进程环境中的正式后台账号登录 `/api/admin/auth/login` 返回 200，访问 `/like/friend-links` 返回 200。
- 源站 HTTPS 直连 `https://yiyuanpack.com/` 和 `https://yiyuanpack.com/blog/pe-vs-pvc-cling-film` 均返回 200。

提交：

- commit: `5d7b6fa`

## 2026-07-02 - 更新询盘邮件转发收件人并测试发信

背景：

- 用户要求将询盘邮件转发邮箱改为 `hezuo1025@gmail.com`，并模拟提交一条询盘检查邮件效果。

改动：

- 操作前备份 SQLite：`data/backups/yiyuan-before-mail-to-change-20260702_144516.db`。
- 更新 `site_settings.inquiryMailTo` 为 `hezuo1025@gmail.com`。
- 通过生产服务 `127.0.0.1:3000/api/inquiries` 提交测试询盘。

验证：

- 生产进程中 `RESEND_API_KEY` 已配置。
- 数据库确认 `inquiryMailEnabled = true`。
- 测试询盘 ID `8` 写入成功。
- 邮件转发状态为 `sent`，收件人 `hezuo1025@gmail.com`，Provider `resend`，Message ID `4f460c0d-8729-4c7d-a251-6d7f67ab9bda`。
- 本次只改数据库配置和提交测试询盘，不涉及代码构建；不需要重启生产服务。

提交：

- commit: `67d0503`

## 2026-07-02 - 源站性能优化与 PageSpeed 问题处理

背景：

- 用户要求参考 PageSpeed 检测结果制定并执行优化。
- PageSpeed Insights API 在当前环境返回 429 配额错误，无法直接取得正式 PageSpeed JSON 分数。
- 用户说明腾讯 EdgeOne 当前暂停解析使用；实际排查发现公网 `yiyuanpack.com` 仍解析到 `yiyuanpack.com.eo.dnse1.com`，并由 EdgeOne 返回 `*.cdn.myqcloud.com` 证书，严格 HTTPS 校验会失败。源站验证均通过 `--resolve yiyuanpack.com:443:127.0.0.1` 直连本机完成。

改动：

- 调整源站 Nginx `/etc/nginx/conf.d/yiyuanpack.com.conf`：
  - 为 HTTPS 监听启用 HTTP/2。
  - 为 HTML、CSS、JS、JSON、SVG 等文本资源启用 gzip。
  - 为 `/images/`、`/uploads/`、`/_ipx/` 响应设置 `Cache-Control: public, max-age=604800`。
  - 对上述静态/图片路径隐藏上游缓存头，避免重复 `Cache-Control`。
- 优化公开博客列表接口 `server/api/public/posts/index.get.ts`，列表只查询并返回摘要字段，不再返回完整 `contentHtml`。
- 新增 `mapPostSummary`，详情接口仍保留 `mapPost` 返回完整正文。
- 首页、博客列表、博客详情封面图和产品卡片图改用 `NuxtImg`，补充 `sizes`、`width`、`height`、`loading`、`fetchpriority`、`decoding`。
- 首屏关键图设置 preload/high priority；非首屏图设置 lazy/low priority。

涉及文件：

- `app/pages/index.vue`
- `app/components/BlogListing.vue`
- `app/components/ProductCard.vue`
- `app/pages/blog/[slug].vue`
- `server/api/public/posts/index.get.ts`
- `server/utils/serializers.ts`
- `/etc/nginx/conf.d/yiyuanpack.com.conf`（系统配置，不在 git 仓库）
- `docs/DEVELOPMENT_LOG.md`

验证：

- `nginx -t` 通过并已 reload。
- `NODE_OPTIONS=--max-old-space-size=1536 ionice -c2 -n7 nice -n 15 pnpm build` 通过。
- 构建存在既有依赖警告：TinyMCE CSS `2of`、部分 chunk 超 500 kB、`@nuxt/image` sharp binaries 警告；未阻断构建。
- 新构建先在 `127.0.0.1:3010` 临时验证，`/_ipx/` 图片正常返回 200。
- 已停止旧生产进程，启动新生产服务，当前监听 `127.0.0.1:3000`，PID `1313497`。
- 源站直连首页和博客页均返回 `HTTP/2 200`，并带 `Content-Encoding: gzip`。
- 源站直连 `/_ipx/s_768x432/images/blog/pe-vs-pvc-cling-film-cover.webp` 返回 `HTTP/2 200`、`Content-Type: image/webp`、`Cache-Control: public, max-age=604800`。
- `/api/public/posts` 从约 91KB 降到约 7.8KB，9 条列表数据不再包含 `contentHtml`。
- 源站直连未压缩 HTML：首页约 165.6KB，博客详情约 158.3KB。
- 源站直连压缩下载体积：首页约 27.0KB，博客详情约 32.3KB。

提交：

- commit: `ea7ee0b`

## 2026-07-02 - 更新 6 篇保鲜膜博客图片水印

背景：

- 用户要求已发布 6 篇保鲜膜 TOB 文章的封面图和正文配图移除邮箱、WhatsApp 联系信息。
- 新水印只保留大写域名 `YIYUANPACK.COM`，位置沿用右下角。
- 本次是静态图片同名覆盖，不涉及数据库、页面代码或 API；由于 Nuxt/Nitro 生产服务会使用构建时静态资源元数据，最终需要重新构建并重启生产服务。

改动：

- 处理 18 张博客图片：每篇 1 张封面图 + 2 张正文配图。
- 更新 `工作流/封面图/*.png`，覆盖旧右下角三行联系信息水印区域，只保留 `YIYUANPACK.COM`。
- 从更新后的 PNG 重新生成 WebP 90% 成品，覆盖 `工作流/封面图/已经转webp/*.webp`。
- 覆盖发布用图片 `public/images/blog/*.webp`。
- 重新构建 `.output`，使生产静态资源 manifest 使用新图片尺寸和 ETag。
- 更新 `工作流/博客文章工作流.md` 和 `工作流/文章执行记录.md`，将水印规则改为只使用大写域名。

涉及文件：

- `工作流/博客文章工作流.md`
- `工作流/文章执行记录.md`
- `工作流/封面图/*.png`
- `工作流/封面图/已经转webp/*.webp`
- `public/images/blog/*.webp`
- `.output/public/images/blog/*.webp`（构建产物，不提交）
- `docs/DEVELOPMENT_LOG.md`

验证：

- 抽样查看 `public/images/blog/pe-vs-pvc-cling-film-cover.webp` 和 `public/images/blog/cling-film-supplier-china-checklist-02.webp`，右下角只显示 `YIYUANPACK.COM`，未见邮箱和 WhatsApp。
- 确认 18 张 PNG、工作流 WebP、发布用 WebP 均保持 `1672x940`。
- 先用 `NODE_OPTIONS=--max-old-space-size=1024`、`nice`、`ionice` 低优先级构建，server build 阶段因堆限制过低 OOM 退出。
- 改用 `NODE_OPTIONS=--max-old-space-size=1536`、`nice -n 15`、`ionice -c2 -n7` 后 `pnpm build` 通过。
- 已停止旧生产进程，启动新生产服务，当前监听 `127.0.0.1:3000`，PID `1225594`；未启动 3005。
- `https://yiyuanpack.com/images/blog/pe-vs-pvc-cling-film-cover.webp`、`https://yiyuanpack.com/images/blog/cling-film-supplier-china-checklist-02.webp`、`https://yiyuanpack.com/images/blog/pvc-fresh-wrap-supermarket-guide-cover.webp` 均返回 200，`Content-Type: image/webp`，下载大小和本地文件一致。
- `https://yiyuanpack.com/blog/pe-vs-pvc-cling-film` 返回 200。

提交：

- commit: `64f0cf7`

## 2026-07-01 - 发布 6 篇保鲜膜 TOB 博客和统一水印图片

背景：

- 用户确认 6 篇保鲜膜 TOB 文章使用真实商务合作、工厂、采购、包装场景图片。
- 图片需要统一右下角联系信息水印，不使用公司 logo，不出现 AI 乱码文字。
- 文章 HTML 已完成，需要生成图片、转 WebP、写入数据库并上线验证。

改动：

- 更新 `工作流/博客文章工作流.md`，补充真实 TOB 摄影风格、高画质、统一右下角联系信息水印规则，并使用项目邮箱 `yiyuancoop@gmail.com`。
- 生成并处理 18 张博客图片：每篇 1 张封面 + 2 张正文图。
- PNG 原图保存到 `工作流/封面图/`，WebP 90% 保存到 `工作流/封面图/已经转webp/`。
- WebP 成品复制到 `public/images/blog/`，文件名使用 `slug-cover.webp`、`slug-01.webp`、`slug-02.webp`。
- 所有成品图片统一为 `1672x940`、16:9，并用 Pillow 叠加一致的右下角半透明联系信息水印。
- 发布 6 篇文章到 `posts`，状态为 `published`，并写入对应 `seo_entries`。
- 更新 `工作流/文章执行记录.md`，记录图片、WebP、数据库发布和验证结果。
- 更新 `.gitignore`，忽略 `data/backups/`，避免 SQLite 备份误提交。

涉及文件：

- `.gitignore`
- `工作流/博客文章工作流.md`
- `工作流/文章执行记录.md`
- `工作流/文章/1.html` 到 `工作流/文章/6.html`
- `工作流/封面图/*.png`
- `工作流/封面图/已经转webp/*.webp`
- `public/images/blog/*.webp`
- `data/yiyuan.db`（按用户要求使用 `git add -f` 强制纳入本次提交）
- `docs/DEVELOPMENT_LOG.md`

验证：

- 发布前已备份 SQLite：`data/backups/yiyuan-before-blog-publish-2026-07-01_08-23-30.db`。
- 数据库确认 6 篇新文章均为 `published`，封面图和 SEO OG image 均指向 `/images/blog/*-cover.webp`。
- `pnpm build` 通过；存在既有依赖警告：TinyMCE CSS `2of`、部分 chunk 超 500 kB、`@nuxt/image` sharp binaries 警告。
- 已重启公网 3005 生产服务，当前 PID `9242`，监听 `0.0.0.0:3005`。
- `http://127.0.0.1:3005` 和 `http://43.134.105.149:3005` 下 6 篇文章页、公开 API、封面图资源均返回 200。

提交：

- commit: `8b2b24e`

## 2026-07-01 - 博客文章页新增自动目录

背景：

- 用户希望博客文章页有可折叠、可展开的悬浮目录，提高长文章阅读体验。
- 项目有开发权限，目录应由代码层自动解析文章 H2/H3 生成，不应写入每篇文章 HTML。

改动：

- 新增 `ArticleToc.client.vue`，客户端自动扫描 `.article-body h2, .article-body h3`，生成文章目录。
- 自动为缺少 `id` 的 H2/H3 生成锚点。
- 桌面端显示右侧 sticky 可折叠目录，并高亮当前阅读章节。
- 手机端显示左下角 `Outline` 按钮，展开底部目录面板，避免和右下角 WhatsApp 组件冲突。
- 博客详情页改为正文 + 右侧目录的响应式布局。
- 文章标题增加 `scroll-margin-top`，避免点击目录后被顶部导航遮挡。
- 补充正文 figure、figcaption、table 基础样式，适配后续工作流文章。
- 更新 `工作流/博客文章工作流.md`，明确自动目录已由代码层实现，文章 HTML 只写干净 H2/H3。

涉及文件：

- `app/components/ArticleToc.client.vue`
- `app/pages/blog/[slug].vue`
- `app/assets/css/main.css`
- `工作流/博客文章工作流.md`
- `docs/DEVELOPMENT_LOG.md`

验证：

- `pnpm build` 通过。
- 构建产物包含 `ArticleToc` 组件和目录样式。
- 已重启公网 3005 服务，当前进程监听 `0.0.0.0:3005`。
- `http://127.0.0.1:3005/blog/choosing-food-packaging-supplier` 返回 200。
- `http://43.134.105.149:3005/blog/choosing-food-packaging-supplier` 返回 200。

提交：

- commit: `当前提交`

## 2026-07-01 - 调整博客文章工作流目录

背景：

- 用户希望文章工作流像 Cyril 项目一样独立成目录，文章 HTML、PNG 原图和 WebP 成品分目录管理。
- 后续 AI 生成文章时，需要先把文章和图片落到工作流目录，再复制 WebP 到网站 public 目录并写入数据库。

改动：

- 新建 `工作流/` 目录。
- 将博客文章工作流文档迁移为 `工作流/博客文章工作流.md`。
- 新建 `工作流/文章/`，用于保存 `1.html`、`2.html` 等数字累加文章文件。
- 新建 `工作流/封面图/`，用于保存 `1_0.png` 封面图和 `1_1.png` 到 `1_4.png` 正文配图原图。
- 新建 `工作流/封面图/已经转webp/`，用于保存压缩转换后的 `1_0.webp` 到 `1_4.webp`。
- 更新工作流文档，明确先保存 HTML、PNG、WebP，再复制 WebP 到 `public/images/blog/` 并写入 `posts` 和 `seo_entries`。

涉及文件：

- `工作流/博客文章工作流.md`
- `工作流/文章/.gitkeep`
- `工作流/封面图/.gitkeep`
- `工作流/封面图/已经转webp/.gitkeep`
- `docs/DEVELOPMENT_LOG.md`

验证：

- 文档和目录结构调整，无需构建。
- 已检查旧 `docs/BLOG_ARTICLE_WORKFLOW.md` 不再存在。
- 已检查 `工作流/` 下目录和占位文件存在。

提交：

- commit: `当前提交`

## 2026-07-01 - 新增 Codex 协作规范文件

背景：

- 用户希望 Codex 默认读取项目协作规则，固定“先读代码、出方案、核对需求、确认后执行、完成后 push”的工作流程。

改动：

- 新增项目根目录 `AGENTS.md`。
- 记录代码修改、新模块开发、数据库/API/后台/UI 改动前的沟通和确认流程。
- 记录完成后的验证、开发日志、提交和推送要求。
- 记录 git 提交时避免带入无关文件的要求。

涉及文件：

- `AGENTS.md`
- `docs/DEVELOPMENT_LOG.md`

验证：

- 文档改动，无需构建。

提交：

- commit: `未提交`

## 2026-07-01 - 页脚手机端社媒显示优化

背景：

- 手机端页脚已有顶部社媒图标，底部 `Social` 折叠菜单重复。
- 社媒图标 SVG 本体偏小，需要全局放大，但不改变外层容器尺寸。

改动：

- 移除手机端页脚 `Social` 折叠菜单。
- 保留页脚顶部社媒图标区域。
- 将 `SocialIcon` 内所有 SVG 图标统一调整为 `20px`。

涉及文件：

- `app/components/SiteFooter.vue`
- `app/components/SocialIcon.vue`
- `docs/DEVELOPMENT_LOG.md`

验证：

- `pnpm build` 通过。
- 已重启公网 3005 服务。
- `http://43.134.105.149:3005/` 返回 200。
- 首页 HTML 不再输出 `Social` 折叠菜单文本，社媒 SVG 输出 `h-5 w-5`。

提交：

- commit: `未提交`

## 2026-07-01 - 精简询盘表单和后台字段

背景：

- 询盘表单字段过多，客户需要填写公司、产品、数量等信息，提交成本偏高。
- 前台表单、提交接口、数据库字段、邮件转发和后台管理需要保持一致。

改动：

- 前台询盘表单精简为姓名、邮箱、国家/地区、需求详情四项。
- 国家/地区改为可搜索、可手输的选择框，并设为必填。
- 去掉公司、产品、预计数量和 Reset 按钮。
- 提交按钮改为 `Submit Inquiry`。
- 提交 API 只接收核心字段，并要求国家/地区。
- `inquiries` 表迁移为简化结构，删除 `company`、`product`、`quantity` 字段。
- 后台询盘列表用国家/地区替代产品列，详情页去掉公司、产品、数量。
- 邮件转发模板同步去掉公司、产品、数量。
- 联系页文案和默认联系页 SEO 描述改成快速询盘导向。

涉及文件：

- `app/components/InquiryForm.vue`
- `app/pages/contact.vue`
- `app/pages/admin/inquiries/index.vue`
- `app/pages/admin/inquiries/[id].vue`
- `server/api/inquiries.post.ts`
- `server/utils/db.ts`
- `server/utils/mail.ts`
- `server/utils/serializers.ts`
- `docs/DEVELOPMENT_LOG.md`

验证：

- `pnpm build` 通过。
- 重启公网 3005 服务，`http://43.134.105.149:3005/contact` 返回 200。
- 已备份线上 SQLite 数据库到 `/root/yiyuan-db-backups/`。
- 线上 `inquiries` 表已无 `company`、`product`、`quantity` 字段。
- 联系页 SEO 描述已迁移为快速询盘文案。
- 提交接口缺少国家/地区时返回 400。

提交：

- commit: `未提交`

## 2026-07-01 - 顶部联系方式和导航悬浮优化

背景：

- 顶部手机号码和邮箱只是静态文本，用户需要手机和电脑端都能直接联系。
- 桌面端和手机端都需要主导航随页面下滑固定在顶部，但顶部文字栏和滚动信息栏不需要固定。

改动：

- 顶部手机号码改为 WhatsApp 新窗口链接。
- 顶部邮箱改为 `mailto:` 邮件链接。
- 增加悬浮和点击反馈样式。
- 主导航滚动到顶部后切换为固定定位，顶部工具栏和滚动信息栏继续正常滚走。
- 增加导航固定时的占位高度，避免页面内容跳动。
- 手机端汉堡菜单在导航固定后仍从固定导航下方展开。

涉及文件：

- `app/components/SiteHeader.vue`
- `docs/DEVELOPMENT_LOG.md`

验证：

- `pnpm build` 通过。
- 已重启公网 3005 服务。
- `http://43.134.105.149:3005/` 返回 200。
- 首页 HTML 输出 WhatsApp 链接、`mailto:` 链接和导航固定占位结构。

提交：

- commit: `未提交`

## 2026-07-01 - 首页弹窗播放器改为真实可播放交互

背景：

- 用户反馈播放器按钮不够像真实播放器，且点击后应弹出视频播放，而不是只做静态演示。

改动：

- 播放按钮改为半透明红色玻璃质感，使用白色播放三角形，hover 时有红色光圈和放大反馈。
- 点击播放器画面后打开独立视频弹窗，并在弹窗中加载外部 iframe 播放。
- 后台“首页弹窗”预览同步增加点击播放弹窗。
- 弹窗关闭缓存 key 升级，便于部署后立即看到新的真实播放交互。
- 新项目默认视频地址设置为 YouTube 示例链接，当前服务器空视频地址已填入该示例链接，后续可在后台替换成真实工厂视频。

验证：

- `pnpm build` 通过。
- 已重启 `3005` 生产服务。
- 首页返回 200，公共设置接口返回 YouTube 示例视频地址。
- 后台首页弹窗页返回 200，并可输出视频预览弹窗结构。

## 2026-07-01 - 精简首页弹窗播放器文案

背景：

- 用户反馈播放器中 “Watch factory overview / External video player” 文案多余，播放按钮和说明需要更简洁居中。

改动：

- 首页弹窗播放器中间区域只保留居中播放按钮和一行英文说明：`Watch Real Factory Video`。
- 移除播放器中多余的外部来源说明文案。
- 后台“首页弹窗”预览同步调整。

验证：

- `pnpm build` 通过。
- 已重启 `3005` 生产服务。

## 2026-07-01 - 转换 public/images 原图为 WebP

背景：

- 用户要求将 `public/images/` 下原始 PNG 图片转换为 WebP，质量压缩 90%，减少前台静态资源体积。
- 原始图片需要保留到单独文件夹备用。

改动：

- 使用 Pillow 从 PNG 原图直接编码为 WebP，参数为 `quality=90`、`method=6`。
- 将 22 张原始 PNG 备份到 `image-originals/public-images-png-20260701/`。
- `public/images/` 删除 PNG，保留对应 `.webp` 文件。
- 将前台页面、默认数据、SEO 默认图、弹窗播放器背景等内置图片路径从 `.png` 改为 `.webp`。
- 增加 SQLite 启动迁移，只替换数据库中 `/images/*.png` 内置静态图路径为 `.webp`，不影响 `/uploads/` 用户上传图片。
- 将 `image-originals/` 加入 `.gitignore`，避免误提交原始大图。

验证：

- `pnpm build` 通过。
- 已重启 `3005` 生产服务。
- `public/images` 从约 `28.25MB` 降到约 `2.4MB`。
- `.output/public/images` 为约 `2.4MB`。
- `http://43.134.105.149:3005/images/hero-factory.webp` 返回 200，`Content-Type: image/webp`。
- 首页返回 200，首页 HTML 和 `/api/public/products` 均输出 `.webp` 图片路径。

## 2026-07-01 - 优化首页弹窗视频播放器预留效果

背景：

- 用户反馈首页弹窗的视频位置只有播放按钮，缺少明显播放器视觉，不像一个预留的视频组件。

改动：

- 将首页弹窗右侧视频区改为完整播放器壳，包含顶部标题栏、视频画布、播放按钮、底部时间、进度条和控制图标。
- 后台“首页弹窗”预览同步改为相同播放器外观。
- 弹窗关闭缓存 key 升级，便于部署后看到新版播放器；新版关闭后仍按后台配置小时数缓存。

验证：

- `pnpm build` 通过。
- 已重启 `3005` 生产服务。
- `http://43.134.105.149:3005/` 返回 200。
- `/admin/home-popup` 登录后返回 200，并输出播放器预览结构。

## 2026-07-01 - 新增首页业务弹窗和后台弹窗管理

背景：

- 用户要求首页增加电脑和手机自适应弹窗，用于简洁介绍业务、引导联络和免费获取样品。
- 弹窗需要预留视频播放器位置，支持 YouTube 等外部视频地址，避免占用服务器带宽。
- 后台需要增加首页弹窗管理，可控制是否展示、视频地址和访客点击关闭后的缓存小时数，默认 12 小时。

改动：

- 新增 `HomeLeadPopup` 首页弹窗组件，采用项目统一的深蓝、红色 CTA、直角边框视觉。
- 首页挂载业务弹窗，电脑端左右布局，手机端上下布局。
- 弹窗关闭按钮写入同设备 `localStorage` 冷却时间；只有点击关闭才缓存，未关闭则下次仍会弹出。
- 视频播放使用外部 iframe，YouTube / youtu.be 地址会自动转换为 `youtube-nocookie.com/embed`。
- `site_settings` 增加 `homePopupEnabled`、`homePopupCooldownHours`、`homePopupVideoUrl` 配置项。
- 新增后台 `/admin/home-popup` 页面，支持开关、冷却小时数、外部视频地址和弹窗预览。
- 后台侧边栏增加“首页弹窗”入口。

验证：

- `pnpm build` 通过。
- 已重启 `3005` 生产服务。
- `http://43.134.105.149:3005/` 返回 200。
- `/api/public/settings` 返回 `homePopupEnabled=true`、`homePopupCooldownHours=12`。
- `admin` / `admin123` 登录 API 返回 200。
- `/admin/home-popup` 登录后返回 200。
- `/api/admin/settings` 保存首页弹窗配置成功。

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

- commit: `ea138d8`

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

- commit: `ea138d8`

## 2026-06-30 - 替换站点 Logo 和 ICO

背景：

- 使用用户提供的新 `logo.png` 替换原站点 Logo。
- 新图主体更满，四周留白更少，更适合导航、底部和 favicon 展示。

改动：

- 基于 `logo.png` 自动识别主体边界，裁掉多余边距。
- 将浅色棋盘格背景透明化，避免显示在白底 Logo 容器内。
- 重新生成 `public/site-logo.png`，尺寸为 `100x100` RGBA PNG。
- 重新生成 `public/favicon.ico`，尺寸为 `60x60` ICO。

涉及文件：

- `public/site-logo.png`
- `public/favicon.ico`
- `docs/DEVELOPMENT_LOG.md`

验证：

- `pnpm build` 通过。
- 已重启公网 3005 服务。
- `http://43.134.105.149:3005/` 返回 200。
- `http://43.134.105.149:3005/site-logo.png` 返回 200，Content-Type 为 `image/png`，Content-Length 为 `10193`。
- `http://43.134.105.149:3005/favicon.ico` 返回 200，Content-Type 为 `image/vnd.microsoft.icon`，Content-Length 为 `4941`。

提交：

- commit: `d1d34e1`

## 2026-07-01 - 优化后台 TDK 管理边界

背景：

- 后台 SEO 管理不应混入产品详情、产品分类和图片上传。
- 主要页面 TDK 应集中管理，产品和分类 TDK 应回到产品模块内维护。

改动：

- 后台导航和页面文案从 `SEO 管理` 调整为 `页面 TDK`。
- `/api/admin/seo` 只返回 `page_type = page` 的首页、产品页、公司页、博客页、联系页。
- 页面 TDK 编辑页移除 Open Graph 图片上传和 OG 编辑区，只保留 Title、Description、Keywords、Canonical、Robots。
- 产品和产品分类表增加 `seo_title`、`seo_description`、`seo_keywords`、`canonical` 字段，并提供自动迁移。
- 产品编辑弹窗新增 `产品 SEO` 区块，分类编辑弹窗新增 `分类 SEO` 区块。
- 新增正式分类页 `/products/category/:slug`，分类页读取 `category:slug` TDK。
- 导航、底部和首页分类入口改为正式分类 URL。
- 草稿产品和停用分类会删除对应 SEO 记录，避免 sitemap 出现不可访问页面。

涉及文件：

- `app/layouts/admin.vue`
- `app/pages/admin/seo/index.vue`
- `app/pages/admin/seo/[id].vue`
- `app/pages/admin/products.vue`
- `app/pages/products/index.vue`
- `app/pages/products/category/[slug].vue`
- `app/components/SiteHeader.vue`
- `app/components/SiteFooter.vue`
- `app/pages/index.vue`
- `server/api/admin/seo/*`
- `server/api/admin/products/*`
- `server/api/admin/product-categories/*`
- `server/utils/db.ts`
- `server/utils/product-seo.ts`
- `server/utils/serializers.ts`
- `docs/DEVELOPMENT_LOG.md`

验证：

- `pnpm build` 通过。
- 已重启公网 3005 服务。
- `http://43.134.105.149:3005/products` 返回 200。
- `http://43.134.105.149:3005/products/category/cling-film` 返回 200。
- `sitemap.xml` 包含 `/products/category/cling-film` 和 `/products/category/disposable-meal-boxes`，不再包含旧的 `/products?category=`。
- `/api/admin/seo` 登录后只返回 `page:/`、`page:/about`、`page:/blog`、`page:/contact`、`page:/products`。
- 直接访问产品 SEO 的 `/api/admin/seo/:id` 返回 404。
- `products` 和 `product_categories` 表已迁移出 `seo_title`、`seo_description`、`seo_keywords`、`canonical` 字段。
- 使用现有产品原值 PUT `/api/admin/products/:id` 返回 200，并返回产品 TDK 字段。
- 使用现有分类原值 PUT `/api/admin/product-categories/:id` 返回 200，并返回分类 TDK 字段。

提交：

- commit: `0169850`

## 2026-07-01 - 首页弹窗手机端紧凑适配

背景：

- 手机端首页弹窗高度过大，内容堆叠后需要在弹窗内部上下滚动，影响查看和操作。

改动：

- 仅调整 `max-width: 760px` 的移动端样式，桌面端弹窗保持不变。
- 手机端弹窗改为居中紧凑面板，去掉常规手机尺寸下的内部滚动。
- 压缩标题、说明、卖点、按钮、邮箱入口和播放器控制条尺寸。
- 增加低高度手机断点，进一步压缩播放器和内容间距。
- 增加遮罩点击和 `Esc` 临时跳过逻辑，不写入关闭缓存；只有点击关闭按钮才触发缓存周期。

涉及文件：

- `app/components/HomeLeadPopup.vue`
- `docs/DEVELOPMENT_LOG.md`

验证：

- `pnpm build` 通过。
- 已重启公网 3005 服务。
- `http://43.134.105.149:3005/` 返回 200。

提交：

- commit: `未提交`

## 2026-07-01 - 后台文章编辑器升级 TinyMCE

背景：

- 后台发布文章的手写富文本编辑器功能过于简陋，图片和链接插入依赖输入框，无法满足接近 WordPress 的编辑体验。

改动：

- 将 `AdminRichTextEditor` 内部替换为 TinyMCE 自托管富文本编辑器，保留原组件调用方式。
- 增加中文编辑器语言包和成熟工具栏：标题、字体、字号、加粗、颜色、对齐、列表、链接、图片、表格、媒体、源码、预览、全屏等。
- 编辑器内图片上传接入现有 `/api/admin/uploads`，支持选择图片、粘贴图片和拖入图片。
- 服务端文章 HTML 清洗规则补充媒体标签和 iframe/image 属性，避免保存后内容被误过滤。

涉及文件：

- `app/components/admin/RichTextEditor.client.vue`
- `server/utils/content.ts`
- `package.json`
- `pnpm-lock.yaml`
- `docs/DEVELOPMENT_LOG.md`

验证：

- `pnpm build` 通过。
- 已重启公网 3005 服务。
- `http://127.0.0.1:3005/admin/login` 返回 200。
- 默认管理员接口登录成功。
- 登录后 `http://127.0.0.1:3005/admin/posts/new` 返回 200。

提交：

- commit: `当前提交`

## 2026-07-01 - 优化全站 SEO TDK

背景：

- 现有主要页面、产品分类和产品详情 TDK 可用但偏模板化，标题区分度和采购搜索词覆盖不足。

改动：

- 更新首页、产品页、关于页、博客页、联系页的 Title、Description 和 Keywords。
- 更新 2 个产品分类、8 个产品、3 篇博客文章的 SEO 字段和 `seo_entries`。
- 新增 SEO 文案生成工具，用于后续新增产品和分类时生成更偏 B2B 采购搜索词的默认 TDK。
- `useManagedSeo` 增加默认自引用 canonical、绝对 OG 图片 URL、`og:url` 和 Twitter Card 标签。
- 产品详情页、分类页、博客详情页 fallback 优先使用实体自身 SEO 字段。
- 数据库初始化增加旧默认 TDK 迁移逻辑，只更新空值或旧模板值，避免覆盖手写自定义 SEO。

涉及文件：

- `app/composables/useManagedSeo.ts`
- `app/data/site.ts`
- `app/pages/index.vue`
- `app/pages/products/index.vue`
- `app/pages/products/category/[slug].vue`
- `app/pages/products/[slug].vue`
- `app/pages/about.vue`
- `app/pages/blog/index.vue`
- `app/pages/blog/[slug].vue`
- `app/pages/contact.vue`
- `server/utils/seo-copy.ts`
- `server/utils/db.ts`
- `server/utils/product-seo.ts`
- `server/utils/post-seo.ts`
- `docs/DEVELOPMENT_LOG.md`

验证：

- 已备份数据库：`/root/yiyuan-db-backups/yiyuan-20260701-140243-before-seo-tdk.db`。
- 当前 SQLite 已更新 5 个主页面、2 个分类、8 个产品、3 篇博客文章 TDK。
- `pnpm build` 通过。
- 已重启公网 3005 服务。
- 首页、产品详情页、产品分类页 HTML 抽查均输出新 title、description 和 canonical。
- `/api/public/seo?key=product:kraft-meal-box` 返回新产品 TDK 和 Product JSON-LD。

提交：

- commit: `当前提交`

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
