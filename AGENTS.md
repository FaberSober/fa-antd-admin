# 项目数据库类型

当前项目同时支持 **MySQL** 与 **PostgreSQL 18**。所有 Entity、DDL 和版本升级 SQL 都必须先确定目标数据库类型，再自动套用对应方言规范；禁止把 MySQL 与 PostgreSQL 语法、布尔值或类型定义混写在同一数据库类型脚本中。

| 数据库类型标识 | 目标数据库 | SQL 目录 | 基线文件 |
| --- | --- | --- | --- |
| `mysql` | MySQL（兼容现有 MySQL 5.7 语法） | `src/main/resources/sql/{module}/mysql/` | `fa-base/src/main/resources/sql/fa-base/mysql/1.0.0_base_ddl.sql` |
| `postgre` | PostgreSQL 18 | `src/main/resources/sql/{module}/postgre/` | `fa-base/src/main/resources/sql/fa-base/postgre/1.0.0_base_ddl.sql` |

- 数据库升级组件根据 JDBC `DatabaseMetaData#getDatabaseProductName()` 自动映射 MySQL 至 `mysql`、PostgreSQL 至 `postgre`，只加载 `sql/{模块}/{数据库类型}/*.sql`。
- 新增或变更已支持模块的表结构时，必须分别评估并提供两个数据库类型的等价 SQL；尚未支持 PostgreSQL 的业务模块必须在需求/脚本中明确，不得回退执行 MySQL SQL。
- 字段类型必须与 Java 实体匹配：MySQL 布尔字段使用 `tinyint(1)`（`0/1`），PostgreSQL 布尔字段使用 `boolean`（`true/false`）；MySQL JSON 使用 `json`，PostgreSQL JSON 使用 `jsonb`；MySQL 自增使用 `AUTO_INCREMENT`，PostgreSQL 使用 `GENERATED ... AS IDENTITY`。
- 升级脚本禁止 `DROP TABLE`、`DROP SCHEMA`、`TRUNCATE`；执行器会在执行前强制拦截。已发布版本脚本不得改写；仅空库基线验证阶段可在用户明确授权后直接修正基线脚本。

# Project Conventions

本文件只保留项目级路由和全局默认约束。具体后端、前端实现规范已拆分到 skills，执行对应任务时优先加载对应 skill。

## Skill Routing

- 后端 Java/Spring Boot、MyBatis-Plus、CRUD API、Entity/Mapper/Biz/Controller、枚举、字典、校验、分页、自定义后端接口、Excel 导入导出、MySQL 5.7（或PostgreSQL 18 + PostGIS + TimescaleDB） DDL 或版本脚本任务：使用 `fa-admin-backend` skill。
- 前端后台管理 React 页面、简单 CRUD 列表页、弹窗表单、查询表单、`@fa/ui` 表格能力、services/types、feature 模块组织任务：使用 `fa-admin-frontend` skill。

## Global Defaults

- 修改前先参考相邻模块和仓库已有实现，优先沿用现有命名、目录、分层和组件风格。
- 数据库设计和 DDL 先匹配任务目标数据库类型；涉及时序数据时默认优先面向 PostgreSQL 18 + TimescaleDB。
- 时序数据表默认按 PostgreSQL + TimescaleDB 设计；涉及采集数据、气象数据、预测结果等物联网时间序列场景时，优先评估 hypertable、时间分区、保留策略和连续聚合。
- MySQL 与 PostgreSQL 的 DDL、迁移 SQL 必须分别遵守其方言：PostgreSQL 不使用 `ENGINE=InnoDB`、`CHARSET`、`COLLATE`、反引号标识符或 `ON UPDATE CURRENT_TIMESTAMP`；MySQL 不使用 PostgreSQL 的 `jsonb`、`GENERATED ... AS IDENTITY`、`ON CONFLICT` 或 PostgreSQL trigger 函数语法。
- 默认不添加数据库外键约束，除非用户明确要求。
- 逻辑删除字段统一使用 `deleted`，不要改成 `is_deleted`、`del_flag` 等其他名称。
- 新增通用后台业务接口时，优先复用 `fa-core` 的基类能力，保持“基类继承 + 薄 Controller”模式。
- 业务SQL要写到Mapper对应的xml文件中，不可直接写到java Mapper文件的注解SQL里。

## Validation Defaults

- 前端修改后默认不要执行 `./node_modules/.bin/vite build`、`pnpm build`、`npm run build` 等完整打包验证，除非用户明确要求。
- 前端验证优先使用更轻量的方式，例如检查相关文件、局部类型/语法判断、复用现有 dev server 页面验证或用户指定的命令。

## Key References

- DDL 基线目录：`fa-base/src/main/resources/sql/fa-base/{mysql|postgre}`
- DDL 重点基线文件：`fa-base/src/main/resources/sql/fa-base/mysql/1.0.0_base_ddl.sql`、`fa-base/src/main/resources/sql/fa-base/postgre/1.0.0_base_ddl.sql`
- 后端简单 CRUD 示例：`fa-demo/src/main/java/com/faber/api/base/demo/rest/StudentController.java`
- 后端树形 CRUD 示例：`fa-demo/src/main/java/com/faber/api/base/demo/rest/TreeController.java`
- 后端通用父类：`fa-core/src/main/java/com/faber/core/web/rest/BaseController.java`
- 后端树形父类：`fa-core/src/main/java/com/faber/core/web/rest/BaseTreeController.java`
- 前端 CRUD 页面示例：`frontend/apps/admin/features/fa-admin-demo-pages/pages/admin/demo/table/table/index.tsx`
- 前端 CRUD 弹窗示例：`frontend/apps/admin/features/fa-admin-demo-pages/pages/admin/demo/table/table/modal/StudentModal.tsx`
- 前端 feature 模块示例：`frontend/apps/admin/features/fa-admin-pages`

## Backend Doc Index

后台开发规范文档统一存放在 `fa-core/doc/server/`。执行后端任务时，先按下方场景定位并读取对应文档，遵循其中的写法与约定后再实现；文档与仓库现有实现冲突时，以仓库代码为准。

### API 与接口
| 场景 | 文档 |
| --- | --- |
| API 路径命名与分层（`/api/大模块/业务模块/实体/CRUD类接口`） | api.md |
| 分页接口标准写法（Controller + Biz + PageHelper） | pagination.md、page.md |
| Forest 声明式 HTTP 客户端调用第三方 API | apiForest.md |
| AI 流式接口（SSE）定义，Controller/方法需加 `@NoFilter` | ai.md |

### 实体、字段与数据
| 场景 | 文档 |
| --- | --- |
| MyBatis-Plus：批量写入优化、JSON 字段映射与查询、动态分表、`@InterceptorIgnore` | mybatisplus.md |
| 数据库常见操作：从列表过滤批量插入/更新、`FieldStrategy.ALWAYS` 强制更新 | db.md |
| 数据库初始化、DDL 文件名规范、主键类型选择（bigint 自增） | dbinit.md |
| 多数据源切换（`@DS` 注解） | dbDynamic.md |
| 清库 SQL（日志表、逻辑删除数据） | clear_db.md |
| TDengine 时序库常用 SQL（建库、STable、增删列） | tdengine.md |
| 经纬度字段定义（decimal(11,8)）与数据库距离计算 | geo.md |
| 枚举定义约定（继承 IEnum、数据库存 tinyint(4)） | enum.md |
| 字典管理（`@FaColDict`）与分页返回字典 | dict.md |
| 入参校验（jakarta.validation 注解） | validator.md |
| Jackson：Long→String 序列化、时间格式化、多连续大写字段 `@JsonProperty` | jackson.md |
| 后台通用约定（树根 ID=0、常用字段定义表） | common.md |
| EasyExcel 分页获取数据库写入 Excel | excel.md |

### 注解与 Java 技巧
| 场景 | 文档 |
| --- | --- |
| 常用注解（`@LogNoRet`、`@FaCacheClear`） | annotation.md |
| List 排序、查找首个匹配元素、Stream 分组/findFirst | list.md、array.md、java8.md |
| 反射获取泛型 Class | reflect.md |
| SpringBoot 常用：获取 request/response、当前环境 | springboot.md |

### 缓存与并发
| 场景 | 文档 |
| --- | --- |
| JetCache 缓存注解用法与 Redis key 命名规范 | cache.md |
| Redisson 分布式锁 | redis.md |
| 线程池配置与线程间用户上下文传递（`BaseContextHandler`） | thread.md |

### 消息与推送
| 场景 | 文档 |
| --- | --- |
| 站内信 + 阿里云短信（`MsgHelper`） | msg.md |
| WebSocket 推送（含 Excel 导入进度，`WsHolder`） | websocket.md |
| netty-socketio 长连接 | socket.md |
| MQTT 发布订阅 | mqtt.md |
| Kafka 生产与消费 | kafka.md |

### 工程与部署
| 场景 | 文档 |
| --- | --- |
| 单元测试写法（`FaTestApp` 包路径须为 `com.faber`） | test.md |
| 代码生成器使用（faber-generator） | genetator.md |
| Maven 依赖版本检查 | mvn.md |
| Git Submodule 操作 | git.md |
| Docker 镜像打包发布 | docker.md |
| 打包部署方式 | deploy.md |
| Nginx 部署配置（http/https/前后端分离/长连接） | nginx.md |
| Windows jar 自启动（start.bat / WinSW 服务） | win自启动设置.md |
| 日志链路追踪 | log.md |
| 菜单模块 ID 规范（aa.bb.cc.dd） | menu.md |
| 项目目录结构总览 | dir.md |
| JWT 解码工具 | jwt.md |
| 外部参考资料链接 | ref.md |

## Frontend Doc Index

前端开发规范文档统一存放在 `frontend/fa-ui/doc/frontend/`。执行前端任务时，先按下方场景定位并读取对应文档，遵循其中的写法与约定后再实现；文档与仓库现有实现冲突时，以仓库代码为准。

### 页面与组件
| 场景 | 文档 |
| --- | --- |
| 列表页表格（`BaseBizTable` + `BaseTableUtils` 生成 columns、操作列配置、表头查询、组合查询） | table.md |
| 滚动轮播列表（`FaScrollList`） | scrollList.md |
| 拖动排序（`FaSortList`） | dnd.md |
| 主页统计小方块配置 | home.md |
| JSON 展示组件（`FaJsonView`） | jsonView.md |
| Tabs 页签 | tabs.md |
| 树形组件（`BaseTree`/`BaseCascader`、`TREE_REFRESH_BUS_KEY` 刷新） | tree.md |
| glb 3D 文件解析（gltfjsx） | 3dmodal.md |

### 表单与选择器
| 场景 | 文档 |
| --- | --- |
| Form 表单细节（InputNumber 校验、Switch/Checkbox 需 `valuePropName="checked"`） | form.md |
| FormEditor 低代码 JSON 配置（JsonConfig/DataConfig/TableConfig） | formEditor.md |
| 通用业务 Select / SearchSelect 组件封装（`BaseSelect`/`BaseSearchSelect`） | select.md |
| 前端开发规范（组件 function 禁用 index 命名） | rule.md |

### 上传与文件
| 场景 | 文档 |
| --- | --- |
| 文件上传规范（`UploadFileLocal`/`UploadFileLocalMultiple`/`UploadImgLocal`，业务只保存文件 ID，`fileSaveApi` 生成地址） | upload.md |
| Office 文档在线查看/编辑（`addTab` inner 标签页） | office.md |

### 路由、URL 与环境
| 场景 | 文档 |
| --- | --- |
| 路由跳转（`useNavigate`） | route.md |
| URL 参数（`useParams`/`useQs`）、操作标签页（`addTab`/`removeTab`）、`Helmet` 标题 | url.md |
| Vite 环境变量（`VITE_APP_` 前缀、`loadEnv`） | env.md |

### 主题与样式
| 场景 | 文档 |
| --- | --- |
| 亮暗主题切换（`ThemeLayoutContext`）、主题色配置、覆盖 antd dark 样式 | theme.md |
| CSS 自定义属性、多 classname（`clsx`） | css.md |

### 状态与事件
| 场景 | 文档 |
| --- | --- |
| 组件间事件总线（`use-bus` 的 `useBus`/`dispatch`） | bus.md |
| 页面状态缓存（react-activation `KeepAlive`，注意 context 会失效） | cache.md |
| 全局加载状态（`useApiLoading`） | loading.md |

### 构建与工程
| 场景 | 文档 |
| --- | --- |
| Vite 常见问题（Fast Refresh 报错处理） | vite.md |
| 热更新规范（组件导出用大写开头、勿用 index 命名） | hmr.md |
| pnpm monorepo 安装依赖（`--filter`） | pnpm.md |
| 升级 npm 依赖（`ncu`） | ncu.md |

### 监控与其他
| 场景 | 文档 |
| --- | --- |
| 事件统计与异常上报 SDK（fa-telemetry 接入/初始化/上报/公共请求头） | fa-telemetry.md |
| 图标使用（iconify 图标、自定义 SVG 图标 `@fa/icons`） | icon.md |
| prism.js 代码块高亮 | prism.md |
| 登录页背景插件（vantajs） | login.md |
| Antd DatePicker 日期格式（Dayjs/Moment 转换） | date.md |
| socket.io 前后端联调参考 | socket.md |

# Rules
Never scan:

node_modules
dist
build
coverage
logs
*.log
*.zip

Prefer reading only requested files.

Never run full test unless explicitly requested.

## Luna 舰队协作

### 调度
- 主 Agent 负责需求分析、任务拆分、共享接口设计、结果集成和最终验收。
- 存在两个及以上边界清晰、互不依赖的子任务时，主动调用子 Agent 并行处理。
- 简单修改、强依赖任务直接执行，不为使用多 Agent 而强行拆分。
- 子 Agent 使用 gpt-5.6-luna，推理强度 medium；不得自行切换模型或继续创建子 Agent。

### 分工
- 派发前明确每个子任务的目标、负责文件、禁止修改范围和验收条件。
- 不同子 Agent 不得同时修改同一文件；共享接口和公共配置由主 Agent 统一处理。
- 子 Agent 只读取任务相关内容，只做必要修改，不进行无关重构。
- 不得覆盖或回退用户及其他 Agent 已有的修改。

### 验收
- 子 Agent 返回简洁结果：修改内容、涉及文件、验证结果、未解决问题。
- 主 Agent 等待相关子任务完成后，统一检查集成结果。
- 遵循项目现有验证要求，优先运行受影响范围的测试；必要时扩大验证范围。
- 不得把未运行的测试描述为通过。
