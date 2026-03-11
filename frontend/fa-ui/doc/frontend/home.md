# home主页配置
## 统计小方块
```typescript tsx
import React from 'react';

export function CountUser() {
  return (
    <div>
      hello
    </div>
  );
}

CountUser.displayName = 'CountUser'; // 必须与方法名称一致
CountUser.title = '用户量';
CountUser.description = '总用户量';
CountUser.showTitle = false; // 是否展示Card的Title
CountUser.permission = ''; // 需要的权限-对应RbacMenu.linkUrl
CountUser.w = 6; // 宽度-网格-max=24
CountUser.h = 4; // 高度-每个单位20px
```