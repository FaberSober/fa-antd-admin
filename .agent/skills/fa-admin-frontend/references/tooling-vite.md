# Vite、环境与依赖工具

归并自 `rule.md`、`env.md`、`vite.md`、`hmr.md`、`pnpm.md` 和 `ncu.md`。

## 组件与 Fast Refresh

React 组件函数使用大写业务名，不命名为 `index`：

```tsx
export default function StudentList() {
  return <div />;
}
```

同一模块混合导出组件与会变化的非组件值可能触发 `react-refresh/only-export-components`。遵循 `frontend/fa-ui/packages/eslint-config-custom` 当前规则，将常量、context、工具或类型拆到独立文件，并保持 export 形式与相邻代码一致。

遇到 `Could not Fast Refresh` 时先检查：组件是否大写、默认函数是否叫 `index`、文件是否混合不兼容导出、barrel 是否形成循环依赖。不要通过关闭 HMR/规则掩盖结构问题。

## 环境变量

业务代码只读取允许暴露到浏览器的 `VITE_APP_*` 变量：

```ts
const filePrefix = import.meta.env.VITE_APP_FILE_PREFIX;
```

Vite config 使用 `loadEnv(mode, process.cwd())` 时按当前配置约定传 prefix；不要打印完整 env。所有 `import.meta.env` 值本质上会进入前端包，不能放密钥、私钥、数据库密码或服务端 token。为新增变量同步类型声明和环境模板（若仓库已有），并提供合理缺省/缺失检查。

## pnpm workspace

在 `frontend` workspace 根目录操作依赖，并用 filter 限定目标包：

```shell
pnpm add lodash --filter @fa/admin
pnpm add -D @types/lodash --filter @fa/admin
```

实际 package name 先从目标 `package.json` 确认。不要把历史缩写 `pn i` 当成项目必须命令；优先使用清晰的标准 pnpm 命令。新增共享 UI 依赖时确认应属于具体 app、`@fa/ui`、icons 还是 workspace root。

## 依赖更新

`npm-check-updates` 只用于用户明确要求的升级检查。优先临时执行而不是全局安装：

```shell
npx npm-check-updates
```

`ncu -u` 会直接修改 package manifest，不在普通功能任务中运行。升级前检查 workspace 锁文件、React/Vite/Ant Design 兼容性和被拒绝的特殊包；升级后按用户要求做目标包验证。

## 验证

默认不运行 `vite build`、`pnpm build`、`npm run build` 等完整打包。优先：

- 检查变更文件和 import/export。
- 使用已有 lint/typecheck 的局部能力或用户指定命令。
- 复用运行中的 dev server 做目标页面验证。
- 只有用户明确要求或局部检查无法覆盖高风险工具链变更时，才运行完整构建。
