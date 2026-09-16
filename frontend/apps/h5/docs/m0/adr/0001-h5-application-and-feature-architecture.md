# ADR-0001：H5 应用与 Feature 组合架构

## 状态

Accepted，2026-07-23。2026-07-22 的初版结论保留，本次增量纳入账号边界、渲染模式、Feature 生命周期和工程门禁。

## 背景

H5 需要作为手机端管理应用独立演进，并允许不同项目自由选择业务模块。Admin 已经具有 `features/*` 目录，但其页面通过通配扫描发现，服务、类型和配置又通过应用级 barrel 全量聚合，无法保证未选择模块完全退出依赖图。

仓库已经具备独立 H5 Vite 应用、`/h5/` 生产前缀、Maven 资源复制和 Spring SPA 深链接回退能力，因此不需要改变现有部署拓扑。

Portal 的实施进一步验证了静态 Feature 组合、模块图、应用级资格校验、代理冒烟、性能预算和生产状态码验收的必要性。H5 复用这些工程结论，但不复用 Portal 的公开注册和官网预渲染定位。

## 决策

### 1. 应用形态

- H5 保持独立 SPA，不合并进 Admin React 根节点。
- 发布基路径固定为 `/h5/`。
- React Router 使用 `basename="/h5"`。
- H5 使用独立移动 UI 和布局，不通过响应式 CSS 直接承载 Admin 页面。

### 2. Feature 模型

- 业务模块位于 `frontend/apps/h5/features/fa-<domain>-h5-pages`。
- 每个 Feature 通过 `feature.ts` 提供唯一 Manifest。
- Manifest 可以贡献路由、底部导航项、首页入口和依赖声明。
- Feature 只从 `index.ts` 暴露公共内容。
- Feature 之间不得深层引用；显式依赖必须同时出现在 `dependsOn`。

### 3. 项目组合

- 项目组合位于 `src/projects/<project>.ts`。
- 一个构建产物只对应一个项目预设。
- Vite 使用 `loadEnv()` 读取 `VITE_APP_PROJECT`，校验项目名后将 `@project` 指向唯一预设。
- 只有项目预设显式 import 的 Feature 才进入构建依赖图。
- 首期不使用 `import.meta.glob` 自动收集全部 Feature，也不使用 `vite-plugin-pages` 扫描全部 Feature 页面。

### 4. 路由和运行时分包

- 路由通过 Feature Manifest 显式注册。
- 页面组件使用动态 import。
- 导航和首页入口引用 route ID，不重复保存业务 path。
- Registry 在启动前检查 Feature、依赖、route ID、path 和导航 key 冲突。
- 冲突直接阻断开发启动或构建，不采用后注册覆盖前注册的策略。

### 5. 平台边界

- M1 的请求层先放在 H5 `src/platform/http`。
- Feature 只能通过稳定的 platform 公共出口使用请求、鉴权和权限能力。
- 当 Admin 或第二个应用需要复用相同请求实现时，再通过独立 ADR 提取为 workspace 包。
- `@fa/core` 可承载稳定基础类型，但 H5 不整包依赖 `@fa/ui`。

### 6. 状态方案

- 服务端状态使用 TanStack Query。
- 登录用户、当前租户和项目配置首期使用 React Context。
- 页面表单和临时状态保留在组件内。
- 不在 M1 引入额外全局状态库；出现跨 Provider 的可证明需求后再评估 Zustand。

### 7. UI 和样式

- H5 使用 Ant Design Mobile。
- H5 建立独立 CSS Token，并映射品牌主色。
- Admin 的 `BaseBizTable`、`DragModal`、菜单标签页和桌面布局不进入 H5。
- 页面必须适配安全区、`100dvh` 和主流手机视口。

### 8. 账号与应用访问边界

- H5 是 Admin 的移动管理入口，复用 `base_user`、`Authorization` Token、租户和 RBAC。
- 用户必须同时满足账号有效、`admin_enabled = 1`、租户有效和业务权限；`admin_enabled` 不能替代 RBAC 或数据范围权限。
- H5 不新增用户表、账号映射、`h5_enabled` 字段或公开注册接口。
- `/api/h5/**` 默认仍是管理接口，不加入公开 allowlist；能复用现有业务 API 时不复制 Controller。
- 后端负责最终资格和权限校验，客户端路由、导航和按钮过滤只负责体验。

### 9. 渲染、依赖图与性能门禁

- 首期采用 React Router Data Mode + CSR，`basename="/h5"`；受保护页面不做全站 SSR 或预渲染。
- App Shell、登录和会话恢复不得静态导入业务页面，Feature 页面由路由动态 import。
- Project 静态 import 决定源码裁剪，路由动态 import 决定运行时 Chunk；两者不能互相替代。
- 构建输出当前 Project、Feature、路由、版本、模块图和 `build-report.json`。
- 模块图出现 Admin 源码、桌面 Ant Design、`@fa/ui`、未启用 Feature 或禁止依赖时失败。
- 性能使用目标值和硬上限双门槛；具体数值和测量口径见 [性能、构建与生产验收基线](../performance-build-and-production-baseline.md)。

### 10. Feature 生命周期

- Feature 缺省为 `active`；准备替换或删除时先标记为 `deprecated`。
- deprecated Feature 必须声明开始版本、原因、迁移文档，可选声明替代 Feature 和移除版本。
- Project 继续启用 deprecated Feature 时，必须显式记录确认版本和迁移目标；确认不消除构建 warning。
- 新 Project 默认拒绝 deprecated Feature，删除前必须确认所有 Project 已完成迁移。

### 11. 开发与生产边界

- Vite 通过 `loadEnv()` 读取并校验 Project 与代理配置；浏览器业务请求统一使用同源 `/api/...`。
- 开发和生产统一使用 `/h5/` base；开发代理默认连接仓库 Spring 开发地址并执行 JSON 响应冒烟。
- 生产必须区分页面深链接、静态资源和 `/api/**`：页面可回退 H5 HTML，缺失资源和 API 保持真实状态码。
- `index.html` 使用不缓存或短缓存，带 hash 资源使用长期 immutable 缓存；JAR 必须实际包含 `static/h5`。
- 请求层先保留在 H5；至少出现两个独立消费应用、API 稳定两个发布周期且没有 H5 业务耦合后，再通过新 ADR 评审 workspace package。

## 目录基线

```text
frontend/apps/h5/
├── src/
│   ├── app/
│   ├── projects/
│   ├── platform/
│   ├── layouts/
│   └── shared/
├── features/
│   ├── fa-h5-base-pages/
│   └── fa-h5-demo-pages/
└── tests/
```

目录按实际阶段创建，不预建空目录。

## 后果

正面影响：

- 项目组合和构建结果可预测。
- 未启用 Feature 不进入路由和业务依赖图。
- 路由、导航、权限和首页入口可以统一校验。
- Feature 可以并行开发，并拥有清晰的复制与删除边界。

代价：

- 新 Feature 必须编写 Manifest 和项目注册代码。
- M2 需要实现 Registry 和构建时项目别名。
- Admin 与 H5 的页面代码不会直接共享。

## 被否决方案

### 复制 Admin 的通配页面扫描

未采用。它会使目录存在即影响路由，也无法通过项目预设严格裁剪模块。

### Module Federation/微前端

未采用。当前没有独立部署和独立版本治理需求，引入成本高于收益。

### 每个 Feature 作为独立 workspace 包

首期未采用。当前 Feature 只有一个宿主，先通过目录边界验证契约；出现跨宿主发布需求后再升级为包。

## 变更规则

以下变更必须新建 ADR：

- 改为自动扫描 Feature。
- 一个产物同时运行多个项目预设。
- 将 Feature 提取成独立发布包。
- 更换路由或服务端状态方案。
- 引入微前端运行时。
- 改变 `base_user + admin_enabled + RBAC` 的应用准入模型。
- 允许运行时扫描全部 Feature 后再筛选。
- 取消模块图、硬性性能预算或生产状态码门禁。
- 跳过 deprecated 兼容窗口直接删除仍被 Project 使用的 Feature。
