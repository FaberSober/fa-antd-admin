# H5 Feature Manifest 与项目预设契约

## 状态

Frozen for M1，版本 `v1-frozen`，2026-07-23。

M1/M2 按本文实现类型和 Registry。字段语义变化需要更新本文；破坏项目裁剪或权限边界的变化需要新增 ADR。

## 设计原则

- Manifest 只描述模块元数据和懒加载入口，不执行登录、请求或全局副作用。
- 项目预设通过静态 import 选择 Feature。
- 导航和首页入口引用 route ID，避免重复维护 path。
- path 负责导航，permission 负责匹配后端 `scope=2` 的 `linkUrl`。
- Feature 可依赖平台能力和已声明 Feature，不能依赖具体项目预设。

## 类型草案

```ts
import type { ComponentType, ReactNode } from 'react';

export type H5FeatureId = `fa-${string}-h5-pages`;
export type H5RouteId = `${H5FeatureId}.${string}`;

export interface H5LazyRouteModule {
  default: ComponentType;
}

export interface H5RouteDefinition {
  /** 全局唯一，格式：<feature-id>.<route-name> */
  id: H5RouteId;
  /** Router basename 之后的绝对内部路径，例如 /app/messages */
  path: `/${string}`;
  /** 是否要求有效登录会话 */
  access: 'public' | 'authenticated';
  /** 后端 scope=2 菜单 linkUrl，例如 /h5/app/messages */
  permission?: `/${string}`;
  title: string;
  showTabBar?: boolean;
  restoreScroll?: boolean;
  lazy: () => Promise<H5LazyRouteModule>;
}

export interface H5NavItem {
  id: string;
  routeId: H5RouteId;
  label: string;
  icon?: ReactNode;
  order?: number;
}

export interface H5HomeEntry {
  id: string;
  routeId: H5RouteId;
  title: string;
  description?: string;
  icon?: ReactNode;
  order?: number;
}

export type H5FeatureLifecycle =
  | { status: 'active' }
  | {
      status: 'deprecated';
      since: string;
      reason: string;
      migrationGuide: string;
      replacementFeatureId?: H5FeatureId;
      removalVersion?: string;
    };

export interface H5Feature {
  id: H5FeatureId;
  displayName: string;
  order?: number;
  dependsOn?: readonly H5FeatureId[];
  routes: readonly H5RouteDefinition[];
  navItems?: readonly H5NavItem[];
  homeEntries?: readonly H5HomeEntry[];
  lifecycle?: H5FeatureLifecycle;
}

export interface H5FeatureMigration {
  featureId: H5FeatureId;
  acknowledgedIn: string;
  targetFeatureId?: H5FeatureId;
}

export interface H5Project {
  id: string;
  title: string;
  basePath: '/h5';
  defaultRouteId: H5RouteId;
  features: readonly H5Feature[];
  featureMigrations?: readonly H5FeatureMigration[];
}
```

实际实现可以把图标从 `ReactNode` 收窄为图标名称，以避免 Manifest 在加载阶段创建 React 元素；该调整不改变契约语义。

## 最小示例

```ts
const messageRoute = {
  id: 'fa-h5-base-pages.messages',
  path: '/app/messages',
  access: 'authenticated',
  permission: '/h5/app/messages',
  title: '消息中心',
  showTabBar: true,
  restoreScroll: true,
  lazy: () => import('./pages/messages/MessageListPage'),
} satisfies H5RouteDefinition;

export default {
  id: 'fa-h5-base-pages',
  displayName: 'H5 基础页面',
  routes: [messageRoute],
  navItems: [
    {
      id: 'messages',
      routeId: messageRoute.id,
      label: '消息',
      order: 30,
    },
  ],
} satisfies H5Feature;
```

项目预设：

```ts
import baseFeature from '@features/fa-h5-base-pages';

export default {
  id: 'default',
  title: 'FA H5',
  basePath: '/h5',
  defaultRouteId: 'fa-h5-base-pages.home',
  features: [baseFeature],
} satisfies H5Project;
```

## Registry 输出

Registry 应输出不可变结果：

```ts
interface H5Registry {
  project: H5Project;
  featureMap: ReadonlyMap<H5FeatureId, H5Feature>;
  routeMap: ReadonlyMap<H5RouteId, H5RouteDefinition>;
  routes: readonly H5RouteDefinition[];
  navItems: readonly H5NavItem[];
  homeEntries: readonly H5HomeEntry[];
  lifecycleWarnings: readonly string[];
}
```

排序规则：

1. Feature `order` 升序，缺省值为 `1000`。
2. 入口自身 `order` 升序，缺省值为 `1000`。
3. order 相同按稳定 ID 字典序排列，保证构建结果可复现。

## 必须校验

- Project ID 只允许小写字母、数字和连字符。
- Feature ID 符合 `fa-<domain>-h5-pages`。
- Feature ID、route ID、route path、nav ID 和 home entry ID 全局唯一。
- route ID 以所属 Feature ID 开头。
- route path 以 `/` 开头，不包含 `/h5` basename，不以 `/` 结尾，根路由除外。
- authenticated 业务路由必须声明 permission；平台定义的 home/me 可通过 allowlist 设为仅登录。
- permission 必须以 `/h5/` 开头。
- nav/home entry 引用的 route ID 必须存在。
- `dependsOn` 必须已启用，且依赖图无循环。
- public route 不得贡献需要登录的导航入口。
- 项目默认 route 必须存在且可被当前项目访问。
- lifecycle 缺省时按 `active` 处理。
- deprecated Feature 必须提供 `since`、`reason` 和非空 `migrationGuide`。
- deprecated Feature 声明 `replacementFeatureId` 时，替代项不能指向自身。
- Project 启用 deprecated Feature 时必须存在对应 `featureMigrations` 记录。
- 迁移确认中的 `targetFeatureId` 必须已启用，并与 Feature 声明的替代项一致。
- 新 Project 脚手架默认拒绝 deprecated Feature；存量 Project 的确认只将错误降为持续 warning。

## 错误处理

- 开发和构建阶段校验失败时抛出包含 Feature ID 和字段路径的错误。
- 生产环境不静默删除冲突项。
- 懒加载失败由路由 ErrorBoundary 处理，并提供重试能力。
- 权限菜单存在但路由未注册时记录配置错误，不将其展示为可点击导航。
- deprecated Feature 的迁移确认无效时阻断开发/构建；确认有效时仍输出包含 Feature 和目标版本的 warning。

## 向后兼容规则

以下变化属于兼容：

- 新增可选 Manifest 字段。
- 新增 Feature、路由或入口。
- 不改变 ID/path 的标题和排序调整。
- 将未声明 lifecycle 的 Feature 显式标记为 `active`。

以下变化属于破坏性变化：

- 修改 Feature ID、route ID、path 或 permission。
- 修改已有字段语义。
- 把可选字段改为必填。
- 改变项目选择 Feature 的构建时行为。
- 跳过 deprecated 迁移窗口直接删除 Feature。
- 修改 lifecycle、迁移确认或替代 Feature 的校验语义。
