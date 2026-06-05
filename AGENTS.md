# Project Conventions

本文件只保留项目级路由和全局默认约束。具体后端、前端实现规范已拆分到 skills，执行对应任务时优先加载对应 skill。

## Skill Routing

- 后端 Java/Spring Boot、MyBatis-Plus、CRUD API、Entity/Mapper/Biz/Controller、枚举、字典、校验、分页、自定义后端接口、Excel 导入导出、MySQL 5.7 DDL 或版本脚本任务：使用 `fa-admin-backend` skill。
- 前端后台管理 React 页面、简单 CRUD 列表页、弹窗表单、查询表单、`@fa/ui` 表格能力、services/types、feature 模块组织任务：使用 `fa-admin-frontend` skill。

## Global Defaults

- 修改前先参考相邻模块和仓库已有实现，优先沿用现有命名、目录、分层和组件风格。
- 数据库设计和 DDL 默认兼容 MySQL 5.7。
- 建表默认使用 `ENGINE=InnoDB`，字符集默认优先 `utf8mb4`。
- 维护历史老表时允许保留已有 `utf8` 配置，不主动统一改造。
- 默认不添加数据库外键约束，除非用户明确要求。
- 逻辑删除字段统一使用 `deleted`，不要改成 `is_deleted`、`del_flag` 等其他名称。
- 新增通用后台业务接口时，优先复用 `fa-core` 的基类能力，保持“基类继承 + 薄 Controller”模式。

## Key References

- DDL 基线目录：`fa-base/src/main/resources/sql/fa-base`
- DDL 重点基线文件：`fa-base/src/main/resources/sql/fa-base/1.0.0_base_ddl.sql`
- 后端简单 CRUD 示例：`fa-demo/src/main/java/com/faber/api/base/demo/rest/StudentController.java`
- 后端树形 CRUD 示例：`fa-demo/src/main/java/com/faber/api/base/demo/rest/TreeController.java`
- 后端通用父类：`fa-core/src/main/java/com/faber/core/web/rest/BaseController.java`
- 后端树形父类：`fa-core/src/main/java/com/faber/core/web/rest/BaseTreeController.java`
- 前端 CRUD 页面示例：`frontend/apps/admin/features/fa-admin-demo-pages/pages/admin/demo/table/table/index.tsx`
- 前端 CRUD 弹窗示例：`frontend/apps/admin/features/fa-admin-demo-pages/pages/admin/demo/table/table/modal/StudentModal.tsx`
- 前端 feature 模块示例：`frontend/apps/admin/features/fa-app-pages`
