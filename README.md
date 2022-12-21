# Get Start

演示地址：http://fa.dward.cn/login
演示账户：admin/888888

- Github: https://github.com/FaberSober/vite-react-antd-admin
- Gitee: https://gitee.com/faberxu/vite-react-antd-admin

## 项目说明

一个前后端分离的 springboot 项目，未使用微服务，部署简单。maven 一键打包前后端代码，只需部署一个最终的 jar 来启动服务。适合小型项目。

- 前端：react18 + antd5.x + vite3(快速开发 + 打包生产)
- 后端：springboot2.4.x
- 环境：mysql5.7 + redis4

## 开发说明

1. 导入数据库文件(使用最新版本的)：`doc/sql/admin/V1.0.x.sql`
   1. (可选)导入中国行政地区数据：`doc/sql/base_area.sql.zip`
2. 启动后端服务：`faber-admin/src/main/java/com/faber/AdminBootstrap.java`
3. 启动前端服务，
   1. 进入前端项目地址：`faber-admin/src/main/frontend`
   2. 安装依赖：`yarn`
   3. 启动项目：`yarn dev`

## 打包部署

1. 在项目根目录下执行：`mvn clean package -Dmaven.test.skip=true`
2. 服务 jar 包为：`faber-admin/target/faber-admin.jar`
3. 启动 jar 包：`java -jar faber-admin/target/faber-admin.jar`
4. 访问地址：http://127.0.0.1

# [目录说明](./doc/server/dir.md)

```
├─doc                   # 文档
├─docker                # docker环境部署文件
├─fa-frontend           # pnpm monorepo结构前端代码
├─fa-admin              # java服务端
├─fa-admin-server       # springbootadmin监控服务
├─fa-core               # java core核心公用代码包
├─fa-generator          # 代码生成
├─frontend              # 单体结构的前端代码（以后不更新了）
```

# 使用插件

## 后端

| 插件                                                                        | 说明                     | 官网                                                                                                           |
| :-------------------------------------------------------------------------- | :----------------------- | :------------------------------------------------------------------------------------------------------------- |
| MyBatis-Plus                                                                | 数据库操作增强           | https://baomidou.com/                                                                                          |
| easyexcel                                                                   | excel 操作               | https://easyexcel.opensource.alibaba.com/                                                                      |
| Spring Validation                                                           | 参数校验                 | http://www.45fan.com/article.php?aid=1D2CNY5HBM62RmJc/                                                         |
| guava                                                                       | google 工具包            | https://github.com/google/guava/                                                                               |
| hutool                                                                      | 常用工具包               | https://hutool.cn/docs/                                                                                        |
| hutool-crypto                                                               | 对称加密-SymmetricCrypto | https://www.hutool.cn/docs/#/crypto/%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86-SymmetricCrypto?id=%e4%bb%8b%e7%bb%8d |
| UserAgentUtil                                                               | HTTP 接口客户端参数解析  | https://hutool.cn/docs/#/http/UA%E5%B7%A5%E5%85%B7%E7%B1%BB-UserAgentUtil/                                     |
| [redisson](https://github.com/redisson/redisson/wiki)                       | redis 缓存               | https://github.com/redisson/redisson/                                                                          |
| [jetcache](https://github.com/alibaba/jetcache/blob/master/introduce_CN.md) | 通用缓存访问框架         | https://github.com/alibaba/jetcache/                                                                           |
| ~~Redis Manager~~                                                           | Redis 在线管理           | https://github.com/ngbdf/redis-manager/                                                                        |
| phpRedisAdmin                                                               | Redis 在线管理           | https://github.com/erikdubbelboer/phpRedisAdmin/                                                               |
| Forest                                                                      | 声明式 HTTP 客户端框架   | https://forest.dtflyx.com/                                                                                     |

## 前端

| 插件                 | 说明             | 官网                                                |
| :------------------- | :--------------- | :-------------------------------------------------- |
| vite                 | vitejs 构建      | https://www.vitejs.net/                             |
| vite-plugin-pages    | 目录路由生成     | https://github.com/hannoeru/vite-plugin-pages       |
| react-router v6      | 路由             | https://github.com/hannoeru/vite-plugin-pages       |
| antd                 | antd 前端组件    | https://ant-design.gitee.io/components/overview-cn/ |
| fa-cron-react-editor | cron 编辑器      | https://github.com/xrutayisire/react-js-cron        |
| use-bus              | bus 事件通知     | https://github.com/fabienjuif/use-bus               |
| tailwindcss          | tailwindcss      | https://tailwindcss.com                             |
| react-use            | React Hooks — 👍 | https://github.com/streamich/react-use              |
| ahooks               | ahooks.js        | https://ahooks.js.org/                              |
| tinymce              | 富文本编辑器     | https://github.com/tinymce/tinymce                  |
| fontawesome          | 图标库           | https://fontawesome.com/                            |
| dnd-kit              | 拖动库           | https://dndkit.com/                                 |
| tree-node-cli        | list dir as tree | https://github.com/yangshun/tree-node-cli           |

## Docker 部署环境文件

1. redis: `docker/redis/docker-compose.yml`
2. phpRedisAdmin: `docker/phpRedisAdmin/docker-compose.yml`

## 项目开发使用到的地址

1. ~~http://localhost/swagger-ui.html~~
2. druid 数据源：http://localhost/druid/index.html
3. 代码生成：http://localhost:7777

# 详细文档

## 前台

1. [升级 npm 依赖](./doc/frontend/ncu.md)
1. [env 环境变量](./doc/frontend/env.md)
1. [登录页面](./doc/frontend/login.md)
1. [bus 事件总线](./doc/frontend/bus.md)
1. [socketio](./doc/frontend/socket.md)
1. [拖动排序](./doc/frontend/dnd.md)

## 后台

1. [详细目录说明](./doc/server/dir.md)
1. [后台约定的一些规则](./doc/server/common.md)
1. [API 路径定义](./doc/server/api.md)
1. [枚举](./doc/server/enum.md)
1. [注解](./doc/server/annotation.md)
1. [代码生成器](./doc/server/genetator.md)
1. [socketio](./doc/server/socket.md)
1. [nginx 部署](./doc/server/nginx.md)
1. [mybatisplus](./doc/server/mybatisplus.md)
1. [参考资料](./doc/server/ref.md)

# RoadMap

- [x] 账户表改为逻辑删除
- [x] 不能删除自身账户和 admin 账户
- [x] 权限 rbac_menu#link_url 不能重复
- [x] 优化权限菜单操作、展示效果
- [x] 删掉无用的 Bean 属性
- [x] 登录设备日志记录
- [ ] 个人登录历史
- [ ] 单点登录控制
- [x] 请求 URL 日志记录
- [ ] 请求 URL 增加注解，拦截时获取注解说明
- [x] 权限使用注解拦截校验
- [x] 定时任务执行日志
- [x] 定时任务 corn 图形化选择
- [ ] 七牛云 demo 示例
- [ ] 阿里云 demo 示例
- [x] tinymce 编辑器集成
- [ ] pdf 阅读器集成
- [x] 切换 MyBatis-Plus，delState 类型变更为 int
- [ ] SpringDoc：https://blog.csdn.net/wdj_yyds/article/details/125174042
- [x] 前端 tree 结构的根结点 ID 切换为 0，并使用统一的枚举值
- [x] 导出 Excel 需要适配 Enum 类型属性的转换
- [x] 剔除多余的 hooks 使用
- [x] socket 整理
- [ ] socket 连接加入 auth
- [x] 集成 Spring Validation
- [x] 集成 redis 缓存方案
- [x] 集成 redis 在线管理工具
- [x] 组合查询功能模块整理
- [ ] 组合查询功能-扩展-支持 mysql json 格式字段过滤查询
- [x] 导出 Excel-扩展-支持 mysql json 格式字段导出
- [ ] 表联合查询组合查询功能
- [ ] 使用 https 访问后，druid 访问 nginx 302 问题处理
- [x] BaseBiz 查询分组 List
- [x] 表格高度固定
- [x] 数据库 tinyint 是否类字段在 ORM 映射中统一修改为 Bool 类型
- [x] 数据库 del_state 字段名称统一修改为 deleted，
- [x] 使用 dnd-kit 替换现有的拖动排序
- [x] 使用 react-contexify 替换现有的右键菜单
- [ ] 国际化
- [x] 图标 ℹ️ 技术整理
- [ ] 图表 📈 技术整理
- [ ] 通用导入方法
- [ ] 多租户
- [ ] ES
- [ ] 流程引擎
- [ ] 报表功能
- [x] 系统配置-基础配置
- [ ] 系统配置-文件配置
- [ ] 系统配置-邮件配置
- [ ] 系统配置-短信配置
- [ ] TabBar Extra Tools
- [ ] Dashboard
- [ ] Code Generator
- [ ] Http Utils
- [x] Frontend use pnpm workspace.

# [CHANGELOG](./CHANGELOG.md)
