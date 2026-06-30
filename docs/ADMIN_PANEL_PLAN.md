# 管理面板开发规划

最后更新：2026-06-30

## 已确认选择

- 部署方式：VPS/服务器运行 Nuxt。
- 数据库：SQLite，本项目本地文件数据库。
- 图片上传：本地上传到 `public/uploads/`。
- 邮件转发：使用邮件 API，第一版按 Resend API 接入，通过环境变量配置。
- 后台账号：单管理员账号密码。
- 后台路径：`/admin`。
- 后台语言：中文。
- 博客编辑器：TinyMCE，支持富文本和 HTML 源代码。
- 博客 URL：沿用 `/blog/slug`。
- 产品管理：第一版不做产品 CRUD，保留 `app/data/site.ts` 中的产品数据，只做产品详情页 SEO。
- 社交媒体：Facebook、Instagram、X、YouTube、TikTok、LinkedIn、Telegram 全部保留，可配置链接、启用状态、排序、新窗口打开。

## 功能范围

### 1. 后台基础

- `/admin/login` 登录页。
- `/admin` 后台首页。
- 单管理员账号登录。
- Cookie session。
- 后台左侧导航和顶部栏。

### 2. SEO 管理

覆盖页面：

- 首页 `/`
- 产品列表页 `/products`
- 每个产品详情页 `/products/[slug]`
- 公司页 `/about`
- 博客列表页 `/blog`
- 每篇博客详情页 `/blog/[slug]`
- 联系页 `/contact`

字段：

- 页面名称
- 路由
- Title
- Description
- Keywords
- Canonical
- Robots
- OG Title
- OG Description
- OG Image

额外能力：

- `sitemap.xml`
- `robots.txt`
- `Article` 结构化数据
- `Organization` 结构化数据
- `Product` 结构化数据

### 3. 博客文章

不做分类。字段：

- 标题
- Slug
- 摘要
- 封面图
- 正文 HTML
- SEO Title
- SEO Description
- SEO Keywords
- Canonical
- 发布状态：草稿 / 已发布
- 发布时间
- 更新时间

能力：

- 新建
- 编辑
- 删除
- 列表查看
- 草稿和发布状态
- 封面图上传
- 富文本编辑
- HTML 源码编辑

### 4. 询盘表单

前台必填：

- 姓名
- 邮箱
- 需求详情

前台选填：

- 公司
- 国家/地区
- 产品
- 预计数量

后台能力：

- 查看提交记录
- 查看详情
- 标记已读 / 未读
- 标记已处理
- 删除
- 查看邮件转发状态
- 邮件发送失败后可重发

邮件转发：

- 固定转发到 `yiyuancoop@gmail.com`。
- 表单提交后写入数据库，并自动调用邮件 API。
- 记录发送状态、发送时间、失败原因。

防垃圾提交：

- honeypot 隐藏字段。
- IP 频率限制。

### 5. 社交媒体链接

后台字段：

- 平台
- 链接
- 启用状态
- 排序
- 新窗口打开，默认开启

前台页脚从后台配置读取。未启用或未填写链接的平台不显示。

## 数据存储规划

SQLite 数据库文件：

```text
data/yiyuan.db
```

主要表：

- `admin_users`
- `sessions`
- `seo_entries`
- `posts`
- `inquiries`
- `social_links`
- `uploaded_files`

## 环境变量

第一版建议：

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
RESEND_API_KEY=
MAIL_TO=yiyuancoop@gmail.com
MAIL_FROM=YIYUAN Website <onboarding@resend.dev>
SITE_URL=https://example.com
```

说明：

- 如果数据库里没有管理员账号，服务启动时用 `ADMIN_USERNAME` 和 `ADMIN_PASSWORD` 初始化。
- `RESEND_API_KEY` 未配置时，询盘仍会入库，但邮件转发会记录为未配置。
- 正式部署时必须修改默认管理员密码。

## 开发阶段

### 阶段一：基础设施

- 修正 Nuxt TypeScript 配置。
- 创建 SQLite 数据层。
- 初始化数据库表和默认数据。
- 实现后台登录和 session。

### 阶段二：后台框架

- `/admin/login`
- `/admin`
- 后台布局
- 中文导航
- 退出登录

### 阶段三：SEO 管理

- SEO API。
- SEO 列表和编辑页。
- 前台页面读取 SEO 数据。
- sitemap、robots、结构化数据。

### 阶段四：博客管理

- 博客 API。
- 后台博客列表、新建、编辑、删除。
- TinyMCE 富文本和 HTML 源码编辑。
- 封面图上传。
- 前台博客列表和详情切换到数据库文章。

### 阶段五：询盘系统

- 前台表单真实提交。
- 后台询盘列表和详情。
- 自动邮件转发。
- 重发邮件。
- honeypot 和 IP 限流。

### 阶段六：社交链接

- 社交链接 API。
- 后台配置页。
- 页脚动态渲染。

### 阶段七：验证和文档

- 构建检查。
- 更新开发记录。
- 补充部署说明和环境变量说明。
