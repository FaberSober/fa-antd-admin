# Get Start
演示地址：http://faber.admin.test.dward.cn/login
演示账户：admin/888888

# 项目地址
1. ~~http://localhost/swagger-ui.html~~
2. http://localhost/druid/index.html
3. 代码生成：http://localhost:7777

# 使用插件
## 后端
| 查询名称 | 官网 |
| :--- | :--- |
| tk.mybatis | https://github.com/abel533/Mapper/wiki |

# 代码生成器使用
## 前端
1. 复制ui-rn/src目录到前端src目录下
2. 修改src/props/index.ts文件（如果没有该文件，则自行创建），将代码生成的ui-rn/src/props/entityxxx.ts namespace中的内容复制到src/props/index.ts文件中；
3. 检查src/configs/server.config.ts文件GATE_APP中是否配置services中的路径


# RoadMap
- [X] 账户表改为逻辑删除
- [X] 不能删除自身账户和admin账户
- [ ] 权限element#code不能重复
- [ ] 删掉无用的Bean属性
- [ ] 登录设备日志记录
- [ ] 单点登录控制

# 前端代码迁移
- [x] BaseBiz查询分组List
- [x] 表格高度固定
