# 代码生成器
## 启动
1. 启动`faber-generator`项目
2. 访问地址：http://localhost:7777
3. 选择并生成的单表查询代码

## 后端
1. 将main目录复制到后端main目录增量覆盖；
2. 整理代码（生成的代码不一定完全正确，需要修剪下代码）;

## 前端
1. 复制ui-rn/src目录到前端src目录下
2. 修改src/props/index.ts文件（如果没有该文件，则自行创建），将代码生成的ui-rn/src/props/entityxxx.ts namespace中的内容复制到src/props/index.ts文件中；
3. 检查src/configs/server.configScene.ts文件GATE_APP中是否配置services中的路径
