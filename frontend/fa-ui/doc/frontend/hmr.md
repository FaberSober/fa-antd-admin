# hmr热更新

## 开发中遇到的热更新问题记录
### 加入了热更新的eslint检查规则
文件路径：`frontend/fa-ui/packages/eslint-config-custom`。    
配置如下：
```javascript
module.exports = {
  plugins: ['react-refresh'],
  rules: {
    // other rules ...
    "react-refresh/only-export-components": "warn", // 只允许导出组件，保证react刷新时能正确更新组件
  },
};
```

### 组件export导出命名规则
#### 1. 使用大写字母开头导出
正确
```typescript jsx
export default function Demo01() {
  return <div>demo01</div>;
}
```

错误
```typescript jsx
export default function demo01() {
  return <div>demo01</div>;
}
```

使用小写会导致热更新失败，报错信息如下：
```
09:57:59 [vite] hmr invalidate /src/pages/threejs/demo01.tsx Could not Fast Refresh. Learn more at https://github.com/vitejs/vite-plugin-react-swc#consistent-components-exports
09:57:59 [vite] hmr update /src/main.tsx
09:57:59 [vite] hmr invalidate /src/main.tsx Could not Fast Refresh. Learn more at https://github.com/vitejs/vite-plugin-react-swc#consistent-components-exports
```

#### 2. 名称不要使用index，尽量使用不同的名称
正确
```typescript jsx
export default function Demo01() {
  return <div>demo01</div>;
}
```

错误
```typescript jsx
export default function index() {
  return <div>demo01</div>;
}
```
