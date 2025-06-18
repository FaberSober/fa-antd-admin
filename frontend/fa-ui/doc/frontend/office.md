# office文件处理
## 查看office文档
```typescript jsx
import {MenuLayoutContext} from "@features/fa-admin-pages/layout";

const {addTab} = useContext(MenuLayoutContext)

addTab({
  key: `/admin/common/doc/view/${fileSaveId}`,
  path: `/admin/common/doc/view/${fileSaveId}`,
  name: `查看模板-${item.name}`,
  type: 'inner', // iframe, inner-内部网页
  closeable: true,
})
```

## 编辑office文档
```typescript jsx
import {MenuLayoutContext} from "@features/fa-admin-pages/layout";

const {addTab} = useContext(MenuLayoutContext)

addTab({
  key: `/admin/common/doc/edit/${fileSaveId}`,
  path: `/admin/common/doc/edit/${fileSaveId}`,
  name: `查看模板-${item.name}`,
  type: 'inner', // iframe, inner-内部网页
  closeable: true,
})
```
