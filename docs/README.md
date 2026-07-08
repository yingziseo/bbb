# 项目文档索引

最后更新：2026-06-30

这个目录用于记录项目当前状态、开发演进、推送前检查和后续待办。后续协作时优先阅读这里，可以快速了解项目做过什么、现在是什么状态、下一步应该注意什么。

## 阅读顺序

1. [项目总览](./PROJECT_OVERVIEW.md)
2. [当前状态](./PROJECT_STATE.md)
3. [管理面板开发规划](./ADMIN_PANEL_PLAN.md)
4. [管理面板使用说明](./ADMIN_PANEL_USAGE.md)
5. [协作规则](./COLLABORATION_RULES.md)
6. [内容资料优化清单](./CONTENT_IMPROVEMENT_BACKLOG.md)
7. [开发记录](./DEVELOPMENT_LOG.md)
8. [待办清单](./TASKS.md)
9. [推送检查清单](./PUSH_CHECKLIST.md)

## 维护规则

- 每次完成一个功能、修复、页面调整或内容更新后，在 `DEVELOPMENT_LOG.md` 追加记录。
- 如果路由、核心组件、数据结构或依赖发生变化，同步更新 `PROJECT_OVERVIEW.md`。
- 如果项目实际状态发生变化，例如表单接入后端、增加测试、上线部署等，同步更新 `PROJECT_STATE.md`。
- 如果发现问题或产生新需求，放入 `TASKS.md`，并标注优先级。
- 如果客户新增真实产品、工厂、证书、检测、采购参数等资料，同步更新 `CONTENT_IMPROVEMENT_BACKLOG.md`。
- 每次提交或推送前，按 `PUSH_CHECKLIST.md` 做一次检查。

## 记录粒度

记录应保持简洁，但要能回答这几个问题：

- 改了什么？
- 为什么改？
- 涉及哪些文件？
- 如何验证？
- 还有什么后续风险或待办？
