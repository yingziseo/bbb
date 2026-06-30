# 管理面板使用说明

最后更新：2026-06-30

## 后台入口

```text
/admin
```

登录页：

```text
/admin/login
```

首次运行时，如果数据库中没有管理员账号，系统会使用环境变量初始化：

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

正式部署前必须修改默认账号和密码。

## 环境变量

参考根目录 `.env.example`。

关键变量：

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
COOKIE_SECURE=false
SITE_URL=https://example.com
SQLITE_PATH=./data/yiyuan.db
RESEND_API_KEY=
MAIL_TO=yiyuancoop@gmail.com
MAIL_FROM=YIYUAN Website <onboarding@resend.dev>
```

说明：

- `COOKIE_SECURE=true` 只建议在 HTTPS 部署时开启。
- `RESEND_API_KEY` 未配置时，询盘仍会保存到后台，邮件状态会记录为 `skipped`。
- `MAIL_TO` 默认是 `yiyuancoop@gmail.com`。
- `SITE_URL` 配置后，sitemap 和结构化数据会输出绝对 URL。
- 服务器 Node.js 需要使用 24.x，项目依赖内置 `node:sqlite`。
- 后台登录使用普通管理员账号，不使用邮箱作为登录账号。

## 数据文件

默认数据库：

```text
data/yiyuan.db
```

上传目录：

```text
public/uploads/
```

这两个运行时目录已加入 `.gitignore`，部署时需要在服务器上持久化备份。

## 后台模块

### 概览

显示文章数量、已发布文章、询盘总数、未读询盘、SEO 条目和邮件失败数量。

### SEO 管理

可维护：

- Title
- Description
- Keywords
- Canonical
- Robots
- OG Title
- OG Description
- OG Image

覆盖首页、产品列表、产品详情、公司页、博客列表、博客详情、联系页。

### 博客文章

支持：

- 新建文章
- 编辑文章
- 删除文章
- 草稿/发布
- 封面图上传
- TinyMCE 富文本编辑
- HTML 源码编辑
- 单篇文章 SEO

文章前台路径：

```text
/blog/slug
```

### 询盘记录

前台表单提交后：

- 写入 SQLite。
- 自动尝试邮件转发。
- 后台可查看详情。
- 可标记已读/未读。
- 可标记已处理。
- 可重发邮件。

必填字段：

- 姓名
- 邮箱
- 需求详情

选填字段：

- 公司
- 国家/地区
- 产品
- 预计数量

### 社交链接

支持配置：

- Facebook
- Instagram
- X
- YouTube
- TikTok
- LinkedIn
- Telegram

每个平台可设置链接、启用状态、排序、新窗口打开。

## 验证命令

```bash
pnpm build
PORT=3000 node .output/server/index.mjs
```

访问：

```text
http://localhost:3000/admin
```
