# Get Start

演示地址：http://fa.dward.cn/login
演示地址（备用）：http://47.105.146.245:8580/login
演示账户：admin/888888

- Github: https://github.com/FaberSober/fa-antd-admin
- Gitee: https://gitee.com/faberxu/fa-antd-admin

## [Git Submodule](./fa-core/doc/server/git.md)

项目将多个子模块进行了拆分，使用 git submodule 来管理多个 repo。

```
git clone --recurse-submodules https://github.com/FaberSober/fa-antd-admin.git
```

## 预览
light
![dashboard-light.png](./doc/image/screenshot/dashboard-light.png)

dark
![dashboard-dark.png](./doc/image/screenshot/dashboard-dark.png)

## 项目说明

一个前后端分离的 springboot 项目，未使用微服务，部署简单。maven 一键打包前后端代码，只需部署一个最终的 jar 来启动服务。适合小型项目。

- 前端：react18 + antd5.x + vite3(快速开发 + 打包生产)
- 后端：springboot2.4.x
- 环境：mysql5.7 + redis4

## 开发说明

1. 复制配置文件`application-dev.yml.sample`为`application-dev.yml`，修改数据库、redis等配置为本机配置环境。
2. 启动后端服务：`fa-admin/src/main/java/com/faber/AdminBootstrap.java`。启动服务后，会自动执行建表 sql，初始化数据库。
3. 启动前端服务，
   1. 进入前端项目地址：`cd fa-frontend`
   2. 安装依赖：`pnpm i` (如果没有按照`pnpm`，需要先安装：`npm install -g pnpm`)
   3. 如果遇到`canvas: Running install script...`执行很久的情况，可以使用安装命令：`pnpm i --ignore-scripts`
   4. 启动项目：`pnpm dev`

## 打包部署

1. 在项目根目录下执行：`mvn clean package -Dmaven.test.skip=true`
2. 服务 jar 包为：`fa-admin/target/fa-admin.jar`
3. 启动 jar 包：`java -jar fa-admin/target/fa-admin.jar`
4. 访问地址：http://127.0.0.1

# [目录说明](./fa-core/doc/server/dir.md)

```
├─doc                   # 文档
├─docker                # docker环境部署文件
├─fa-admin              # java服务端
├─fa-core               # java core核心公用代码包
├─fa-base               # java base基础通用业务 代码包
├─fa-admin-server       # springbootadmin监控服务
├─frontend              # pnpm monorepo结构前端代码
```

# 使用插件

## 后端

| 插件                                                                          | 说明                   | 官网                                                                                                             |
|:----------------------------------------------------------------------------|:---------------------|:---------------------------------------------------------------------------------------------------------------|
| MyBatis-Plus                                                                | 数据库操作增强              | https://baomidou.com/                                                                                          |
| easyexcel                                                                   | excel 操作             | https://easyexcel.opensource.alibaba.com/                                                                      |
| Spring Validation                                                           | 参数校验                 | http://www.45fan.com/article.php?aid=1D2CNY5HBM62RmJc/                                                         |
| guava                                                                       | google 工具包           | https://github.com/google/guava/                                                                               |
| hutool                                                                      | 常用工具包                | https://hutool.cn/docs/                                                                                        |
| hutool-crypto                                                               | 对称加密-SymmetricCrypto | https://www.hutool.cn/docs/#/crypto/%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86-SymmetricCrypto?id=%e4%bb%8b%e7%bb%8d |
| UserAgentUtil                                                               | HTTP 接口客户端参数解析       | https://hutool.cn/docs/#/http/UA%E5%B7%A5%E5%85%B7%E7%B1%BB-UserAgentUtil/                                     |
| [redisson](https://github.com/redisson/redisson/wiki)                       | redis 缓存             | https://github.com/redisson/redisson/                                                                          |
| [jetcache](https://github.com/alibaba/jetcache/blob/master/introduce_CN.md) | 通用缓存访问框架             | https://github.com/alibaba/jetcache/                                                                           |
| ~~Redis Manager~~                                                           | Redis 在线管理           | https://github.com/ngbdf/redis-manager/                                                                        |
| phpRedisAdmin                                                               | Redis 在线管理           | https://github.com/erikdubbelboer/phpRedisAdmin/                                                               |
| Forest                                                                      | 声明式 HTTP 客户端框架       | https://forest.dtflyx.com/                                                                                     |
| spring-file-storage                                                         | 文件存储框架               | https://spring-file-storage.xuyanwu.cn/                                                                        |
| easy-es                                                                     | ES工具包                | https://www.easy-es.cn/                                                                                        |

## 前端

| 插件                                | 说明               | 官网                                                     |
|:----------------------------------|:-----------------|:-------------------------------------------------------|
| vite                              | vitejs 构建        | https://www.vitejs.net/                                |
| vite-plugin-pages                 | 目录路由生成           | https://github.com/hannoeru/vite-plugin-pages          |
| react-router v6                   | 路由               | https://github.com/hannoeru/vite-plugin-pages          |
| antd                              | antd 前端组件        | https://ant-design.gitee.io/components/overview-cn/    |
| fa-cron-react-editor              | cron 编辑器         | https://github.com/xrutayisire/react-js-cron           |
| use-bus                           | bus 事件通知         | https://github.com/fabienjuif/use-bus                  |
| tailwindcss                       | tailwindcss      | https://tailwindcss.com                                |
| react-use                         | React Hooks — �  | https://github.com/streamich/react-use                 |
| ahooks                            | ahooks.js        | https://ahooks.js.org/                                 |
| tinymce                           | 富文本编辑器           | https://github.com/tinymce/tinymce                     |
| fontawesome                       | 图标库              | https://fontawesome.com/                               |
| dnd-kit                           | 拖动库              | https://dndkit.com/                                    |
| tree-node-cli                     | list dir as tree | https://github.com/yangshun/tree-node-cli              |
| react-grid-layout                 | 网格布局             | https://github.com/react-grid-layout/react-grid-layout |
| @react-pdf-viewer                 | pdf 查看           | https://github.com/react-grid-layout/react-grid-layout |
| @onlyoffice/document-editor-react | office 文件在线编辑    | https://api.onlyoffice.com/                            |
| @uiw/react-amap 高德地图              | 高德地图             | https://uiwjs.github.io/react-amap/                    |
| react-device-detect               | 浏览器判断            | https://github.com/duskload/react-device-detect/       |
| prismjs                           | 代码样式             | http://prismjs.com/                                       |

## Docker 部署环境文件

1. redis: `docker/redis/docker-compose.yml`
2. phpRedisAdmin: `docker/phpRedisAdmin/docker-compose.yml`

## 项目开发使用到的地址

1. ~~http://localhost/swagger-ui.html~~
2. druid 数据源：http://localhost/druid/index.html
3. 代码生成：http://localhost:7777

# 详细文档

## 前台

1. [升级 npm 依赖](frontend/fa-ui/doc/frontend/ncu.md)
1. [env 环境变量](frontend/fa-ui/doc/frontend/env.md)
1. [登录页面](frontend/fa-ui/doc/frontend/login.md)
1. [bus 事件总线](frontend/fa-ui/doc/frontend/bus.md)
1. [socketio](frontend/fa-ui/doc/frontend/socket.md)
1. [拖动排序](frontend/fa-ui/doc/frontend/dnd.md)
1. [CSS](frontend/fa-ui/doc/frontend/css.md)

## 后台

1. [数据库初始化](fa-core/doc/server/dbinit.md)
1. [后台约定的一些规则](fa-core/doc/server/common.md)
1. [API 路径定义](fa-core/doc/server/api.md)
1. [枚举](fa-core/doc/server/enum.md)
1. [注解](fa-core/doc/server/annotation.md)
1. [代码生成器](fa-core/doc/server/genetator.md)
1. [socketio](fa-core/doc/server/socket.md)
1. [nginx 部署](fa-core/doc/server/nginx.md)
1. [mybatisplus](fa-core/doc/server/mybatisplus.md)
1. [参考资料](fa-core/doc/server/ref.md)

# RoadMap

- [x] 账户表改为逻辑删除
- [x] 不能删除自身账户和 admin 账户
- [x] 权限 rbac_menu#link_url 不能重复
- [x] 优化权限菜单操作、展示效果
- [x] 删掉无用的 Bean 属性
- [x] 登录设备日志记录
- [x] 个人登录历史
- [ ] 在线账户管理
- [ ] 单点登录控制
- [x] 请求 URL 日志记录
- [x] 请求 URL 增加注解，拦截时获取注解说明
- [x] 权限使用注解拦截校验
- [x] 定时任务执行日志
- [x] 定时任务 corn 图形化选择
- [ ] 七牛云 demo 示例
- [ ] 阿里云 demo 示例
- [x] tinymce 编辑器集成
- [x] pdf 阅读器集成
- [x] 切换 MyBatis-Plus，delState 类型变更为 int
- [ ] SpringDoc：https://blog.csdn.net/wdj_yyds/article/details/125174042
- [x] 前端 tree 结构的根结点 ID 切换为 0，并使用统一的枚举值
- [x] 导出 Excel 需要适配 Enum 类型属性的转换
- [x] 剔除多余的 hooks 使用
- [x] socket 整理
- [x] socket 连接加入 auth
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
- [x] 图表 � 技术整理
- [x] 通用导入方法
- [ ] 多租户
- [ ] ES
- [ ] 流程引擎
- [ ] 报表功能
- [x] 系统配置-基础配置
- [x] 系统配置-文件配置
- [ ] 系统配置-邮件配置
- [ ] 系统配置-短信配置
- [ ] 短信验证码逻辑
- [ ] 短信发送历史记录
- [x] TabBar Extra Tools
- [x] Dashboard
- [x] Code Generator
- [x] Http Utils
- [x] Frontend use pnpm workspace.
- [x] APK 打包上传接口（用于 CI）.
- [x] APK 增加记录下载次数
- [x] Office 文件在线编辑
- [x] 数据库升级模块优化
- [ ] 队列DEMO-kafka
- [x] 亮色、暗色模式切换
- [x] 亮色、暗色模式各组件展示
- [ ] mybatis-plus动态指定表名DEMO
- [ ] 菜单布局适配手机
- [x] DOC-增加文档查看次数统计
- [x] DOC-编辑文档网页权限校验
- [ ] 大屏-常见大屏示例开发

# [CHANGELOG](./CHANGELOG.md)

# mvn 更新命令

1. `mvn versions:display-dependency-updates` scans a project's dependencies and produces a report of those dependencies which have newer versions available.
2. `mvn versions:display-plugin-updates` scans a project's plugins and produces a report of those plugins which have newer versions available.
3. `mvn versions:display-property-updates` scans a project and produces a report of those properties which are used to control artifact versions and which properies have newer versions available.
