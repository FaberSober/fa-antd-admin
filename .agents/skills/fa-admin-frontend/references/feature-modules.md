# Feature 模块组织

结合当前 `frontend/apps/admin/features` 结构整理；优先参考 `fa-ai-pages`、`fa-vision-pages` 和目标模块相邻 feature。

## 目录职责

按实际需要创建目录，不为空结构预建文件：

- `configs/`：模块网关和配置常量。
- `types/`：共享实体、请求、响应和业务类型。
- `services/`：后端资源接口，按业务域拆分并聚合导出。
- `pages/`：路由页面，目录层级贴近菜单/路由和业务域。
- `components/`：跨多个页面复用的模块组件。
- `layout/`、`styles/`、`workflow/` 等：只有模块确实需要时添加。

页面内部组件放在页面目录下：

- `modal/`：弹窗表单。
- `components/` 或 `cube/`：页面业务块、子列表。
- `helper/`、`select/`：页面专用选择器或辅助组件。
- `tabs/`：详情页标签内容。

不要引用已经不存在的 `fa-app-pages`。创建前使用 `find frontend/apps/admin/features -maxdepth 1` 确认当前模块命名和布局。

## Configs

网关配置放入 `configs/index.ts`，结构匹配当前 `Fa.ConfigApp`：

```ts
import { Fa } from '@fa/ui';

export default {
  GATE_APP: {
    vision: {
      base: '/api/vision',
    },
  },
} as Fa.ConfigApp;
```

先复用模块统一前缀，再让 service 构造器追加资源名。不要在页面和每个 service 中散落完整 URL。

## Services

每个后端资源一个 service 文件。标准 CRUD 继承 `BaseApi<Entity, Key>`，仅在基类不足时增加有明确返回类型的自定义方法：

```ts
class Api extends BaseApi<Vision.Project, number> {
  statistics = (id: number) =>
    this.get<Vision.ProjectStatistics>(`${id}/statistics`);
}

export default new Api(GATE_APP.vision.base, 'project');
```

资源名必须与后端 Controller 路径一致。通过 `services/index.ts` 聚合导出，页面优先从模块出口或既有 `@/services` 别名导入，不使用跨 feature 的深层相对路径。

## Types

在 `types/ModuleName.ts` 使用业务命名空间组织类型，并通过 `types/index.ts` 导出：

```ts
export type { default as Vision } from './Vision';
```

- 持久化实体优先继承 `Fa.BaseDelEntity` 或目标模块现有基础类型。
- 独立声明创建/更新请求、详情响应、统计结果等类型，不用 `any` 掩盖契约差异。
- 主键、枚举、可空字段和后端 JSON 结构必须保持一致。
- 不在多个页面重复声明同一个业务类型。

## 页面与路由

`pages` 目录贴近当前路由约定，例如 `pages/admin/vision/project/index.tsx`。动态参数使用当前方括号目录，如 `[id].tsx`；新增前搜索相邻路由，不套用旧版目录约定。

后台页面、开放页面或其他入口分别跟随现有 `admin`、`open`、`in` 等分区。组件名使用业务语义且大写开头，不能把默认函数命名为 `index`。

## 创建顺序

1. 确认目标 feature 是否已经存在及其聚合出口。
2. 补齐/更新共享 types。
3. 补齐 configs 和 services，并更新 index 导出。
4. 创建页面及其局部 modal/helper/components。
5. 接入菜单或路由的任务同时核对路径、权限和后端资源。
6. 检查别名解析、循环依赖和跨 feature 边界。

README 只在相邻 feature 确有维护约定且内容能持续更新时添加，不作为空模块的必需文件。
