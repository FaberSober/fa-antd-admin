# FA Admin 项目级 Agent 约束

本文件只保留每次任务都适用、且仅属于本仓库的约束。后端和前端的可复用技术规范、示例与参考文档由对应 skill 维护。

## Skill Routing

- 后端 Java/Spring Boot、MyBatis-Plus、CRUD API、Entity/Mapper/Biz/Controller、DDL、版本升级 SQL、枚举、字典、校验、Excel、缓存和消息任务：使用 `fa-admin-backend` skill。
- React/Vite/Ant Design 管理端页面、CRUD、表格/表单、选择器、路由、主题、状态与前端工具链任务：使用 `fa-admin-frontend` skill。
- 前后端联动任务按涉及范围同时使用两个 skill；数据库类型、方言、时序数据与迁移规则以 `fa-admin-backend` skill 为准。
- UniApp 移动端 `mobile/` 任务遵守 `mobile/AGENTS.md`；新增触摸交互统一使用 `@tap`，不要新增 `@click`。

## 项目默认原则

- 修改前先参考相邻模块和仓库已有实现，沿用现有命名、目录、分层和组件风格。
- 具体开发流程、技术约束、示例路径和参考文档以对应 skill 的 `SKILL.md` 与 `references/` 为准；仓库代码与文档冲突时，以仓库代码为准。
- 共享规范由其 Git/NPM 源仓库维护并发布；除非用户明确要求，不直接修改 `.agents/skills` 中的消费副本。

## 交付与验证

- 工作存在关联计划或 ADR 文档时：需要验证则将其状态标记为 `🔍验证中`；无需验证才标记为 `✅已完成`。
- 用户确认“验证成功”后，将关联文档状态更新为 `✅已完成`；验证失败或未完成时保持 `🔍验证中`。
- 优先执行最小、受影响范围的验证。未明确要求时，不运行完整前端构建或全量测试。

## 工作区保护

- 不扫描 `node_modules`、`dist`、`build`、`coverage`、`logs`、`*.log`、`*.zip`。
- 先用 `rg` 定位，再读取与任务直接相关的文件；不要无关地遍历仓库或做重构。
