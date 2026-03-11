# icon
## 查看图标
- 网址：https://icon-sets.iconify.design/

找到想用的图标，如：https://icon-sets.iconify.design/?query=input&search-page=1。图标为`streamline-sharp:input-box`

在代码中使用`<div className="i-streamline-sharp:input-box"/>`

## 使用图标需要安装依赖
```bash
# 如果使用 pnpm
pnpm add -D @iconify-json/streamline-sharp
# 或者安装通用集合（不推荐，体积大）
pnpm add -D @iconify/json
```

## 使用svg图标
如果不想要在package.json中引入太多的依赖包，可以使用自定义Icon组件，内部使用svg，如：
```typescript react
export const FaSendIcon = ({ size = "1em", color = "currentColor", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 1792 1792"
    {...props}
  >
    <path
      fill={color}
      d="M1764 11q33 24 27 64l-256 1536q-5 29-32 45q-14 8-31 8q-11 0-24-5l-453-185l-242 295q-18 23-49 23q-13 0-22-4q-19-7-30.5-23.5T640 1728v-349l864-1059l-1069 925l-395-162q-37-14-40-55q-2-40 32-59L1696 9q15-9 32-9q20 0 36 11"
    />
  </svg>
);
```

可以使用把图标放到`frontend/fa-ui/packages/icons/src/components/custom`目录下，使用如下：
```typescript react
import { FaSendIcon } from "@fa/icons";

<FaSendIcon style={{color: '#3296fa'}} />
```
