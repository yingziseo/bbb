# Resend 询盘邮件最终投递状态追踪

## 目标

- 前台提交询盘后，仅在 Resend 真正投递到收件服务器时显示“已投递”。
- 对延迟、退信、抑制、投诉和失败状态提供明确记录与后台告警。
- 通过签名校验的 Resend Webhook 实时更新状态，并由现有 5 分钟任务定时核验，防止回调遗漏。
- 保留现有首次发送与临时失败重试能力，不对永久失败或抑制状态自动重试。

## 功能分解

1. 数据层
   - 扩展询盘邮件状态和最终事件字段。
   - 为已有 Resend 邮件补查最终状态。
2. 服务端
   - 发送成功后记录为 `submitted`，不再立即记录为 `sent`。
   - 新增 Resend 邮件详情查询与状态映射。
   - 新增带 Svix 签名校验的公开 Webhook API。
   - 扩展内部定时任务，同时处理发送重试与未决邮件状态核验。
3. 后台
   - 增加已提交、已投递、延迟、退信、抑制、投诉等状态标签。
   - 增加异常提示、状态筛选、最终事件时间和错误原因。
   - 对永久失败状态提示先处理原因再手动重发。
4. 运维
   - 配置 `RESEND_WEBHOOK_SECRET`。
   - 注册 Resend Webhook，订阅 sent/delivered/delivery_delayed/bounced/complained/failed/suppressed。
   - 复用 `yiyuanpack-inquiry-mail-retry.timer` 每 5 分钟补偿核验。

## 实施步骤

1. 备份线上 SQLite 数据库。
2. 编写数据库迁移和邮件状态处理逻辑。
3. 接入并校验 Webhook，避免重复或乱序事件覆盖最终状态。
4. 扩展内部定时任务与后台 API/UI。
5. 推送代码，由 GitHub Actions 云端构建并发布产物；服务器仅拉取校验产物并重启 systemd 服务。
6. 注册 Webhook、发送测试询盘并核对 `delivered`。
7. 更新开发日志、提交并推送。

## 验收标准

- 新询盘初始发送后状态为“已提交”，不会误报“已投递”。
- Resend `delivered` 后后台显示“已投递”及时间。
- `suppressed`、`bounced`、`complained`、`failed` 状态在后台醒目显示原因。
- Webhook 重复或乱序事件不会把最终状态降级，非法签名请求被拒绝。
- 即使 Webhook 未到达，5 分钟定时任务也能将近期未决邮件同步为最终状态。
- GitHub Actions 云端构建通过，服务器从校验后的产物部署，systemd 服务和公网页面/API 正常。

## 当前状态

- [x] 需求与边界确认
- [x] 数据库备份与迁移逻辑
- [x] 服务端状态追踪
- [x] 后台展示与筛选
- [x] GitHub Actions 云端构建、产物部署和链路验证
- [x] 日志、提交和推送
