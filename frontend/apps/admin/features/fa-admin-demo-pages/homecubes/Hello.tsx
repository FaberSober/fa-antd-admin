import React from 'react';


// export type HelloProps = {}

export function Hello() {
  return (
    <div>
      <div>Hello</div>
      <div>This Component has title</div>
    </div>
  );
}

Hello.displayName = "Hello"; // 必须与方法名称一致
Hello.title = "组件Hello";
Hello.description = "组件Hello描述";
Hello.showTitle = true; // 是否展示Card的Title
Hello.permission = ""; // 需要的权限
Hello.w = 4; // 宽度-网格-max=16
Hello.h = 6; // 高度-每个单位20px
