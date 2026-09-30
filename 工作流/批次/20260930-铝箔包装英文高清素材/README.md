# 铝箔包装英文产品素材（已发布）

用户授权：PDF 仅作为素材和参数来源；修复产品主图，生成极简英文规格图；外观相同、尺寸不同的型号共用主图，明显不同的外观分别修复。

## 发布结果

- 网站分类：[Aluminum Foil Packaging](https://yiyuanpack.com/products/category/aluminum-foil-packaging)，ID 234。
- 保留 121 条独立产品记录：117 款容器/盖、4 个卷/片系列，卷/片共 38 行尺寸与包装选项。
- 39 组外观对应 39 张修复主图，减少 82 次重复修复；每个产品各有一张英文规格图，另有一张分类图，共 **161 张网站素材**。
- 金银颜色、形状、深浅轮廓、分格、耳柄、锅型及盖子分别归组。共用图片不代表型号、容量、尺寸或装箱信息相同。
- 规格图保留对应型号的容量、长宽高、底部和箱规、装箱数量；容器尺寸有技术轮廓和尺寸箭头。未给出的数据不补造。卷/片 38 行规格全部保留。
- 仅替换主图、配图、详情中的规格图片及分类图。所有非图片字段以及既有 15 款其他产品保持一致；详情图片可点击打开原尺寸版本。
- 新图片保存到 `/root/bbb/public/uploads/aluminum-foil-en-20260930/`，文件名含内容 SHA256 前缀，避免沿用旧图缓存。

## 素材和生成记录

本批次使用 **内置 image_gen** 修复，10 次最终 2×2 拼图生成涵盖 39 组外观。使用 Pillow 执行用户授权的拼接参考、切分、标准画布布局和准确英文文字/尺寸箭头绘制。

| 内容 | 保存位置 |
| --- | --- |
| 每组来源、代表型号与全部对应产品 | `generation-plan.json`、`外观去重映射.md` |
| 最终 10 次生成的完整提示词、工具、来源及选用输出 | `generation-results.json` |
| 输入拼图 | `references/visual-01.png` 至 `visual-10.png` |
| AI 最终输出拼图 | `generated-grids/visual-01.png` 至 `visual-10.png` |
| 切出的 39 张照片 | `images/cropped/` |
| 网站主图 | `images/main/`，1280×960 无损 WebP |
| 英文规格图 | `images/specification/`，容器 1600×1200；卷/片按完整规格行数增加高度 |
| 分类图 | `images/category/`，1200×900 |
| 文件路径、像素、SHA256、字节数、产品映射 | `asset-manifest.json` |
| 图片上实际绘制的英文文字 | `english-rendered-text.json` |
| 发布请求与结果 | `image-updates.json`、`published-products.json`、`publication-state.json` |
| 更新前的产品数据快照 | `before-image-update.json` |
| 验证记录和截图 | `public-verification.json`、`browser-verification.json`、`images/verification/` |

实际生成拼图为 1254×1254，每个切分单元 627×627。1280/1600 是网站布局尺寸；AI 根据低分辨率来源恢复材质细节，并不声称照片原生 4K。共用照片作为外观示意，具体规格以各型号标注为准；技术轮廓仅帮助识别标尺方向，不是生产图纸。

## 验证与备份

- SQLite 在线备份：`/root/bbb/data/backups/before-aluminum-english-images-20260930-035323.db`，写入前 quick_check=ok。
- 161 张公网图片全部 HTTP 200、响应 SHA256 与本地文件一致、像素尺寸和完整解码通过。
- 121 个英文产品页与分类页全部 HTTP 200；公开 API 返回 39 个共用主图地址、121 个独立规格图地址，原主图/规格图地址残留为 0。
- 121 个型号的非图片字段保持一致，规格图文字无中文，完整卷/片规格保留；详情图片之外的 HTML 内容一致。
- 1440px/390px 浏览器验证：121 张卡片、分类导航、主图加载、规格图切换、原尺寸图链接通过；无脚本错误或横向溢出。
- SQLite integrity_check=ok，foreign_key_check 无异常；3000 端口进程为 systemd 主进程。

本次没有应用代码、API 或数据库结构变化，不需要构建部署或重启服务。PDF 不属于本次工作范围，未继续修复或为 PDF 单独部署。生成图片、运行数据库及备份沿用项目既有 Git 排除规则；批次脚本、映射、提示词、发布及验收记录提交到 Git。

## 脚本用途

- `prepare-visual-groups.py`：整理外观分组及参考拼图；会重建生成计划，已发布批次无需重新运行。
- `create-english-assets.py`：切分已审核的 AI 拼图并绘制英文规格图；`--reuse-main` 可复用主图。
- `publish-images.py`：备份、校验并通过既有认证后台 API 更新现有图片字段；其他字段逐项核对。
- `verify-public-images.py`：公开 API、161 张图片和 122 个页面验证。
- `verify-browser.py`：桌面和手机浏览器检查；本环境 Playwright 位于 `/tmp/codex-playwright`，浏览器使用已安装 Chromium。
