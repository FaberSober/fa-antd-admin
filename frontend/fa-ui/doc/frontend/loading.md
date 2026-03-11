# loading全局加载状态
## 使用
New ways:
```typescript tsx
import { useApiLoading } from '@fa/ui';
import { jobLogApi } from '@/api';

// single url
const loading = useApiLoading(jobLogApi.getUrl('save'));

// multi urls
const loading = useApiLoading([
  jobLogApi.getUrl('save'),
  jobLogApi.getUrl('update'),
  jobLogApi.getUrl('delete'), // 想加几个加几个
]);
```
