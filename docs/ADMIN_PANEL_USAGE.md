# 管理面板使用说明

最后更新：2026-07-02

## 后台入口

```text
/like
```

登录页：

```text
/like/login
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

### 页面 TDK

可维护：

- Title
- Description
- Keywords
- Canonical
- Robots
- 首页、产品列表、公司页、博客列表、联系页等主页面 TDK。

说明：

- 产品和产品分类 TDK 在产品管理模块维护。
- 博客文章 TDK 在博客文章模块维护。

### 产品管理

支持：

- 产品分类新增、编辑、删除、排序和启用状态。
- 产品新增、编辑、删除、发布状态和排序。
- 产品图片上传。
- 材料、MOQ、定制、包装、规格参数、尺寸选项和应用场景。
- 产品和分类 TDK。

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
- 国家/地区
- 需求详情

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

### 友情链接

支持：

- 新增、编辑、删除友情链接。
- 设置名称、URL、描述、启用状态、排序和新窗口打开。
- 前台页脚桌面端展示为低优先级链接列。
- 手机端与 Products、Company、Contact 一样折叠显示，默认收起。

## 验证命令

```bash
pnpm build
HOST=0.0.0.0 PORT=3000 node .output/server/index.mjs
```

访问：

```text
http://localhost:3000/like
```
