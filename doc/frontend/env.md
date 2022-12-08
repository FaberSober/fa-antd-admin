# ENV环境变量
## vitejs中获取环境变量

### 在业务js中
> 环境变量必须以`VITE_APP_`开头

```typescript
const filePrefix = import.meta.env.VITE_APP_FILE_PREFIX;
```

### 在`vite.config.ts`配置文件中
```typescript
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  console.log('loadEnv(mode, process.cwd())', env)
  return {
    ...
  }
})

```
