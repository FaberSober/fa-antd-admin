# Get Start
演示地址：http://faber.admin.test.dward.cn/login
演示账户：admin/888888

## 项目说明
一个前后端分离的springboot项目，未使用微服务，部署简单。maven一键打包前后端代码，只需部署一个最终的jar来启动服务。适合小型项目。
- 前端：react17 + antd4.x + vite3(快速开发) + webpack5(打包生产)
- 后端：springboot2.4.x
- 环境：mysql5.7 + redis4

## 开发说明
1. 导入数据库文件：`faber-admin/src/main/resources/data/sql/V1.0.0.sql`
2. 启动后端服务：`faber-admin/src/main/java/com/faber/AdminBootstrap.java`
3. 启动前端服务，
   1. 进入前端项目地址：`faber-admin/src/main/frontend`
   2. 安装依赖：`yarn`
   3. 启动项目：`yarn start`

## 打包部署
1. 在项目根目录下执行：`mvn clean package -Dmaven.test.skip=true`
2. 服务jar包为：`faber-admin/target/faber-admin.jar`
3. 启动jar包：`java -jar faber-admin/target/faber-admin.jar`
4. 访问地址：http://127.0.0.1

## 项目开发使用到的地址
1. ~~http://localhost/swagger-ui.html~~
2. druid数据源：http://localhost/druid/index.html
3. 代码生成：http://localhost:7777

# 使用插件
## 后端
| 插件 | 官网 |
| :--- | :--- |
| tk.mybatis | https://github.com/abel533/Mapper/wiki |

## 前端
| 插件 | 说明 | 官网 |
| :--- | :--- | :--- |
| antd | antd前端组件 | https://ant-design.gitee.io/components/overview-cn/ |
| fa-cron-react-editor | cron编辑器 | https://github.com/xrutayisire/react-js-cron |

### 升级npm依赖
```bash
ncu -u --timeout 120000 --reject husky
```

# 代码生成器使用
## 前端
1. 复制ui-rn/src目录到前端src目录下
2. 修改src/props/index.ts文件（如果没有该文件，则自行创建），将代码生成的ui-rn/src/props/entityxxx.ts namespace中的内容复制到src/props/index.ts文件中；
3. 检查src/configs/server.config.ts文件GATE_APP中是否配置services中的路径


# RoadMap
- [X] 账户表改为逻辑删除
- [X] 不能删除自身账户和admin账户
- [ ] 权限element#code不能重复
- [ ] 优化权限菜单操作、展示效果
- [ ] 删掉无用的Bean属性
- [ ] 登录设备日志记录
- [ ] 单点登录控制
- [X] 定时任务执行日志
- [X] 定时任务corn图形化选择
- [ ] 表联合查询组合查询功能
- [ ] 七牛云demo示例
- [ ] 阿里云demo示例
- [ ] tinymce编辑器集成
- [ ] pdf阅读器集成

# 前端代码迁移
- [x] BaseBiz查询分组List
- [x] 表格高度固定

# 更新日志
## 2022-09-07
1. 增加定时任务执行日志
