# Update Log
## 2025-12-04
1. change loading global status
Old ways:
```typescript tsx
const { loadingEffect } = useContext(ApiEffectLayoutContext);
const loading = loadingEffect[api.getUrl('save')] || loadingEffect[api.getUrl('update')];
```

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
