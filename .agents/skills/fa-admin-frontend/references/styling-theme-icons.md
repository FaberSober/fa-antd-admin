# 样式、主题与图标

归并自 `css.md`、`theme.md`、`icon.md` 和 `prism.md`。

## CSS 与 className

优先复用仓库 `fa-*` 原子类、目标 feature 样式和 CSS 变量。动态 class 使用 `clsx`，避免手工拼接产生 `undefined`/多余空格：

```tsx
<div className={clsx('fa-flex-row-center', active && 'is-active', className)} />
```

- 小范围一次性尺寸可跟随相邻组件使用 inline style；可复用/响应式/主题相关规则放入样式文件。
- 新 CSS 变量沿用现有命名和作用域，不在业务组件覆盖全局 Ant Design 选择器。
- 修改共享 theme 包前搜索影响范围，避免用大量 `!important` 修复局部页面。

## 亮色与暗色

组件通过 `ThemeLayoutContext` 获取当前主题及主色：

```tsx
const { themeDark, colorPrimary } = useContext(ThemeLayoutContext);
```

主题配置和应用逻辑以当前文件为准：

- `frontend/fa-ui/packages/ui/src/layout/theme/ThemeLayout.tsx`
- `frontend/apps/admin/features/fa-admin-pages/layout/lang/LangLayout.tsx`
- `frontend/fa-ui/packages/theme/theme.scss`

新增颜色优先使用现有 CSS 变量/Ant Design token。必须自定义时同时验证 light/dark、hover、disabled、border 和文本对比度，不把旧文档中的固定色表当成唯一真值。

## Iconify 与自定义 SVG

先搜索 `@fa/icons` 和已安装 Iconify 集合。已有图标直接复用；需要新的 Iconify 集合时，只安装具体 `@iconify-json/<collection>`，不要安装体积大的通用全集。

Iconify 原子 class 跟随当前 UnoCSS/Icon 配置，例如：

```tsx
<div className="i-streamline-sharp:input-box" />
```

依赖安装必须在 workspace 根目录并指定正确 filter，见 [tooling-vite.md](tooling-vite.md)。

通用自定义 SVG 放入 `frontend/fa-ui/packages/icons/src/components/custom`，从 `@fa/icons` 导出。组件接受 `size`、`color="currentColor"` 和标准 SVG props；保留正确 `viewBox`，避免硬编码不可主题化颜色。

## Prism

代码块高亮先搜索当前 Markdown/编辑器组件是否已有方案。只有仍使用 public Prism 静态插件时：

- 版本化放在 `frontend/apps/admin/public/plugins/prism/<version>`。
- 在当前 HTML 入口引入对应 JS/CSS。
- 动态内容渲染后按现有类型声明调用 `Prism.highlightAll()`。
- 只包含需要的语言/插件，避免重复加载另一套高亮器。
- 不信任的代码内容按文本渲染，不能通过高亮流程绕过 HTML 清理。
