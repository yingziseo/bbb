# 推送检查清单

最后更新：2026-09-03

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

## 3. 构建验证

开发者本地环境至少执行：

```bash
pnpm build
```

生产服务器绝对禁止执行 `pnpm build`、`npm run build`、`nuxi build` 或其他编译命令。影响线上产物的改动必须推送后由 GitHub Actions 构建，成功后使用：

```bash
scripts/deploy-production-artifact.sh <commit-sha>
```

部署脚本必须完成产物 SHA256、commit SHA、systemd 重启和健康检查，不得手动运行 Node 服务。

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

## 6. 构建产物与磁盘清理

确认：

- GitHub Actions 继续复用固定 `production-build` Release，并通过 `gh release upload --clobber` 覆盖 `yiyuanpack-output.tar.gz` 与校验文件；不得为每个 commit 新建长期保留的 Release 或 Actions artifact。
- 云端 runner 为一次性环境，不把 `release/`、依赖目录或中间构建目录复制回生产服务器。
- `scripts/deploy-production-artifact.sh` 成功或失败退出时均通过 `trap` 清理 `/tmp/yiyuan-artifact-deploy.*` 和项目内 `.artifact-stage.*`。
- 部署成功后删除回退目录 `.output.previous`，线上只保留当前 `.output`；当前正在运行的 `.output` 绝对不能删除。
- 部署完成后执行 `df -h /root /tmp`，并核对 `.output` 大小以及是否存在 `.output.previous`、`release/`、`.artifact-stage.*`、`/tmp/yiyuan-artifact-deploy.*` 残留。
- 只处理上述精确命名且已核实的残留目录，不使用宽泛路径、未解析变量或危险递归删除命令。
