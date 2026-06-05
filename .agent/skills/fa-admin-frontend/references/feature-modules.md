# Feature 模块参考

创建或重组 `frontend/apps/admin/features` 下的前端 feature 模块时使用本参考。

## 基线

优先参考：

- `frontend/apps/admin/features/fa-app-pages`

feature 目录名通常使用 `fa-xxx-pages` 风格。

## 目录结构

标准模块默认包含：

- `configs/`：网关和模块配置常量。
- `pages/`：页面实现，目录层级贴近路由和业务域。
- `services/`：接口服务定义，按业务域拆分。
- `types/`：模块业务类型。
- `README.md`：简要模块说明。

即使模块较小，也尽量保留这几层结构，不要把类型、服务和页面全部放到一个目录中。

## Configs

模块后端网关配置放在 `configs/index.ts`，对象类型声明为 `Fa.ConfigApp`。

```ts
export default {
  GATE_APP: {
    app: {
      app: '/api/app/app',
      crash: '/api/app/crash',
    },
  },
} as Fa.ConfigApp;
```

先定义统一网关前缀，再供 services 使用。

## 服务

`services` 按业务域组织，例如 `services/app/app`、`services/app/crash`。每个实体或资源一个 service 文件。

CRUD service 继承 `BaseApi<Entity, Key>`。只有基类能力不能覆盖时，才在 service 类中补充自定义方法。

```ts
class Api extends BaseApi<App.Apk, number> {
  getApkInfo = (fileId: string) => this.get(`getApkInfo/${fileId}`);
  create = (params: any) => this.post('create', params);
}

export default new Api(GATE_APP.app.app, 'apk');
```

service 构造参数由“模块网关 + 资源名”组成。资源名应与后端 Controller 资源路径一致。

## Service 导出

先做业务分组导出，再做模块级导出。

示例：

- `services/app/index.ts` 导出 `apkApi`、`apkVersionApi`、`apkCrashApi`。
- `services/index.ts` 再通过 `export * from './app'` 二次导出。

页面优先从 index 聚合出口导入，不要深层直连具体 service 文件。

## 类型

模块业务类型放在 `types/ModuleName.ts`，使用命名空间组织，例如 `namespace App`。

通过 `types/index.ts` 统一导出：

```ts
export type { default as App } from './App';
```

实体类型优先继承 `Fa.BaseDelEntity` 或相邻项目代码使用的基础类型。不要在多个页面重复声明相同实体类型。

## 页面

`pages` 目录层级贴近路由和业务域，例如 `pages/admin/system/base/notice/index.tsx`。

如果模块同时包含后台页面和 H5 页面，分别放在：

- `pages/admin/...`
- `pages/h5/...`

页面目录下按需继续拆分：

- `modal/`：弹窗表单。
- `cube/`：页面内部业务块或子列表。
- `helper/`：页面辅助组件。

## 命名与导入

- feature 目录：`fa-xxx-pages`。
- service 导出变量：`xxxApi`。
- 类型命名空间：业务模块名，例如 `App`、`Demo`。
- 页面组件：业务语义命名，例如 `ApkList`、`ApkVersionList`、`ApkCrashView`。
- 弹窗组件：`XxxModal`。

导入优先使用 `@/services`、`@/types`、`@/configs`、`@features/模块名/...`。

## 创建顺序

1. 创建 feature 根目录和 `README.md`。
2. 创建 `configs/index.ts`。
3. 创建 `types/模块名.ts` 和 `types/index.ts`。
4. 按业务域创建 `services/`。
5. 补齐分组和模块级 `services/index.ts` 导出。
6. 在 `admin`、`h5` 或具体路由层级下创建 `pages/`。
7. 按需添加页面内 `modal`、`cube`、`helper` 目录。
