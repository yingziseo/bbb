# 当前项目状态

快照日期：2026-06-30

## 快照摘要

- 项目类型：Nuxt 4 静态/SSR 展示站。
- 主要语言：Vue SFC、TypeScript、CSS。
- 源码规模：`app/` 下约 17 个源码文件，约 2157 行。
- 依赖已安装：当前工作区存在 `node_modules/`。
- 构建产物已存在：当前工作区存在 `.nuxt/` 和 `.output/`。
- 已新增轻量后台：`/admin`。
- 已新增 SQLite 数据库层：默认 `data/yiyuan.db`。

## 已实现功能

- 首页完整展示：hero、产品分类、工厂概览、车间图片、OEM 定制、精选产品、质量控制、询盘入口。
- 产品列表页：展示所有产品，支持按分类过滤。
- 产品详情页：展示图片、材质、MOQ、定制能力、规格表、应用场景、相关产品和询盘入口。
- 公司页：展示注册信息、工厂图片、联系方式和询盘 CTA。
- 博客列表和博客详情：基于本地 `posts` 数组渲染。
- 联系页：Element Plus 表单、基础校验、联系方式侧栏。
- 全站页头、页脚、跑马灯和固定联系浮窗。
- 后台登录、概览、SEO 管理、博客 CRUD、询盘管理、社交链接管理。
- 前台表单真实提交并写入数据库。
- 询盘邮件转发接口，未配置邮件 API 时记录为 `skipped`。
- sitemap、robots 和基础结构化数据。

## 内容资产

当前 `public/images/` 已包含：

- 首页和工厂图：`hero-factory.png`、`about-factory.png`、`workshop-main.png`、`workshop-equipment.png`、`workshop-warehouse.png`、`quality-control.png`。
- 产品图：`product-meal-box.png`、`product-bento.png`、`product-cling-film.png`、`product-fresh-wrap.png`、`product-deli.png`、`product-clamshell.png`、`product-custom-box.png`、`product-cup.png`。
- 分类图：`cat-containers.png`、`cat-film.png`、`cat-food.png`、`cat-custom.png`。
- 博客图：`blog-supplier.png`、`blog-materials.png`、`blog-cost.png`。

根目录还有 `hero.png`、`home.png`、`home2.png`、`product.png`、`to-b.zip` 等文件，当前 `.gitignore` 已忽略这些大文件或临时文件。

## 当前限制

- 没有 lint、typecheck、test 脚本。
- 邮件自动转发需要配置 `RESEND_API_KEY`。
- 产品内容仍保留在 `app/data/site.ts`，第一版后台只管理产品详情页 SEO。
- 公司信息仍保留在 `app/data/site.ts`。
- 合规跑马灯中的认证和法规词需要确认业务证据，避免不准确宣传。

## 推荐近期优先级

1. 配置正式 `ADMIN_USERNAME`、`ADMIN_PASSWORD`、`SITE_URL` 和 `RESEND_API_KEY`。
2. 增加 `typecheck`、`lint`、`format` 或最小构建检查脚本。
3. 确认所有工厂、认证、产能和公司信息的来源材料。
4. 部署时规划 `data/yiyuan.db` 和 `public/uploads/` 的持久化备份。
