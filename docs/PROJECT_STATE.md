# 当前项目状态

快照日期：2026-07-02

## 快照摘要

- 项目类型：Nuxt 4 SSR 展示站。
- 主要语言：Vue SFC、TypeScript、CSS。
- 依赖已安装：当前工作区存在 `node_modules/`。
- 构建产物已存在：当前工作区存在 `.nuxt/` 和 `.output/`。
- 当前服务端口口径：`3000`。
- 已新增轻量后台：`/like`。
- 已新增 SQLite 数据库层：默认 `data/yiyuan.db`。

## 已实现功能

- 首页完整展示：hero、产品分类、工厂概览、车间图片、OEM 定制、精选产品、质量控制、询盘入口。
- 产品分类和产品管理：SQLite 存储，后台支持分类和产品 CRUD，前台列表、分类页、详情页读取公开接口。
- 产品列表页：展示数据库产品。
- 产品分类页：正式路径 `/products/category/[slug]`。
- 产品详情页：展示图片、材质、MOQ、定制能力、规格表、尺寸选项、应用场景、相关产品和询盘入口。
- 公司页：展示注册信息、工厂图片、联系方式和询盘 CTA。
- 博客列表、分页和博客详情：读取 SQLite 已发布文章。
- 博客详情页：桌面端悬浮文章目录，手机端不显示目录。
- 联系页：Element Plus 表单、基础校验、国家/地区必填、真实提交、联系方式侧栏。
- 全站页头、页脚、跑马灯、手机端语言切换和固定联系浮窗。
- 后台登录、概览、页面 TDK、产品管理、首页弹窗、博客 CRUD、询盘管理、邮件转发管理、网站设置、社交链接和友情链接管理。
- 后台侧边栏已按总览、内容管理、询盘转化、站点配置进行分组。
- 前台表单真实提交并写入数据库。
- 询盘邮件转发接口，支持后台配置和重发；未配置邮件 API 时记录为 `skipped`。
- sitemap、robots 和基础结构化数据。
- 页脚友情链接模块：桌面端低优先级展示，手机端默认折叠。

## 内容资产

当前 `public/images/` 主要使用 WebP 图片，已包含：

- 首页和工厂图：`hero-factory.webp`、`about-factory.webp`、`workshop-main.webp`、`workshop-equipment.webp`、`workshop-warehouse.webp`、`quality-control.webp`。
- 产品图：`product-meal-box.webp`、`product-bento.webp`、`product-cling-film.webp`、`product-fresh-wrap.webp`、`product-deli.webp`、`product-clamshell.webp`、`product-custom-box.webp`、`product-cup.webp`。
- 分类图：`cat-containers.webp`、`cat-film.webp`、`cat-food.webp`、`cat-custom.webp`。
- 博客图：早期 `blog-*.webp` 和 `public/images/blog/*.webp` 下 6 篇保鲜膜 TOB 文章图片。

根目录还有 `hero.png`、`home.png`、`home2.png`、`product.png`、`to-b.zip` 等文件，当前 `.gitignore` 已忽略这些大文件或临时文件。

## 当前限制

- 没有 lint、typecheck、test 脚本。
- 邮件自动转发依赖运行环境 `RESEND_API_KEY` 和后台转发设置。
- `app/data/site.ts` 仍保留默认值和初始化种子，真实运行数据以 SQLite 为准。
- 合规跑马灯中的认证和法规词需要确认业务证据，避免不准确宣传。

## 推荐近期优先级

1. 增加 `typecheck`、`lint`、`format` 或最小构建检查脚本。
2. 确认所有工厂、认证、产能和公司信息的来源材料。
3. 部署时持续规划 `data/yiyuan.db`、`public/uploads/` 和博客图片资产的持久化备份。
