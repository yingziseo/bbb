# 推送检查清单

最后更新：2026-06-30

每次准备提交或推送前，按下面顺序检查。

## 1. 查看改动范围

```bash
git status --short
git diff --stat
git diff
```

确认：

- 没有混入无关文件。
- 没有提交 `.nuxt/`、`.output/`、`node_modules/`、临时图片、压缩包等生成物。
- 没有泄露邮箱密码、API key、token、后台地址等敏感信息。

## 2. 更新文档

确认：

- `docs/DEVELOPMENT_LOG.md` 已追加本次改动记录。
- 路由、依赖、数据结构、核心组件变化已同步到 `docs/PROJECT_OVERVIEW.md`。
- 项目状态变化已同步到 `docs/PROJECT_STATE.md`。
- 新发现的问题或需求已加入 `docs/TASKS.md`。

## 3. 本地验证

至少执行：

```bash
pnpm build
```

如果后续增加了脚本，也执行：

```bash
pnpm typecheck
pnpm lint
pnpm test
```

如果是页面或样式改动，手动检查：

- `/`
- `/products`
- `/products/[slug]`
- `/about`
- `/blog`
- `/blog/[slug]`
- `/contact`
- `/like/login`
- `/like`
- 移动端导航和页脚折叠区域
- 页脚友情链接折叠区域
- WhatsApp、邮箱、询盘按钮

## 4. 提交信息建议

格式示例：

```text
docs: initialize project documentation
feat: add real inquiry submission
fix: correct product filter behavior
chore: update Nuxt configuration
```

## 5. 推送后记录

推送完成后，在 `docs/DEVELOPMENT_LOG.md` 补充：

- commit hash
- 推送分支
- 构建或部署结果
- 发现的问题和后续处理
