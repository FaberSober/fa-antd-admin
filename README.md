# Get Start
演示地址：http://fa.dward.cn/login
演示账户：admin/888888

## 项目说明
一个前后端分离的springboot项目，未使用微服务，部署简单。maven一键打包前后端代码，只需部署一个最终的jar来启动服务。适合小型项目。
- 前端：react18 + antd5.x + vite3(快速开发 + 打包生产)
- 后端：springboot2.4.x
- 环境：mysql5.7 + redis4

## 开发说明
1. 导入数据库文件(使用最新版本的)：`faber-admin/src/main/resources/data/sql/V1.0.x.sql`
   1. (可选)导入中国行政地区数据：`faber-admin/sql/base_area.sql.zip`
2. 启动后端服务：`faber-admin/src/main/java/com/faber/AdminBootstrap.java`
3. 启动前端服务，
   1. 进入前端项目地址：`faber-admin/src/main/frontend`
   2. 安装依赖：`yarn`
   3. 启动项目：`yarn dev`

## 打包部署
1. 在项目根目录下执行：`mvn clean package -Dmaven.test.skip=true`
2. 服务jar包为：`faber-admin/target/faber-admin.jar`
3. 启动jar包：`java -jar faber-admin/target/faber-admin.jar`
4. 访问地址：http://127.0.0.1

# 使用插件
## 后端
| 插件 | 说明 | 官网 |
| :--- | :--- | :--- |
| MyBatis-Plus | 数据库操作增强 | https://baomidou.com/ |
| easyexcel | excel操作 | https://easyexcel.opensource.alibaba.com/ |
| Spring Validation | 参数校验 | http://www.45fan.com/article.php?aid=1D2CNY5HBM62RmJc/ |
| guava | google工具包 | https://github.com/google/guava/ |
| hutool | 常用工具包 | https://hutool.cn/docs/ |
| hutool-crypto | 对称加密-SymmetricCrypto | https://www.hutool.cn/docs/#/crypto/%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86-SymmetricCrypto?id=%e4%bb%8b%e7%bb%8d |
| UserAgentUtil | HTTP接口客户端参数解析 | https://hutool.cn/docs/#/http/UA%E5%B7%A5%E5%85%B7%E7%B1%BB-UserAgentUtil/ |
| Redis Manager | Redis在线管理 | https://github.com/ngbdf/redis-manager/ |
| phpRedisAdmin | Redis在线管理 | https://github.com/erikdubbelboer/phpRedisAdmin/ |

## 前端
| 插件 | 说明 | 官网 |
| :--- | :--- | :--- |
| vite | vitejs构建 | https://www.vitejs.net/ |
| vite-plugin-pages | 目录路由生成 | https://github.com/hannoeru/vite-plugin-pages |
| react-router v6 | 路由 | https://github.com/hannoeru/vite-plugin-pages |
| antd | antd前端组件 | https://ant-design.gitee.io/components/overview-cn/ |
| fa-cron-react-editor | cron编辑器 | https://github.com/xrutayisire/react-js-cron |
| use-bus | bus事件通知 | https://github.com/fabienjuif/use-bus |
| tailwindcss | tailwindcss | https://tailwindcss.com |
| react-use | React Hooks — 👍 | https://github.com/streamich/react-use |
| ahooks | ahooks.js | https://ahooks.js.org/ |
| tinymce | 富文本编辑器 | https://github.com/tinymce/tinymce |

## Docker部署环境文件
1. redis: `docker/redis/docker-compose.yml`
2. phpRedisAdmin: `docker/phpRedisAdmin/docker-compose.yml`

## 项目开发使用到的地址
1. ~~http://localhost/swagger-ui.html~~
2. druid数据源：http://localhost/druid/index.html
3. 代码生成：http://localhost:7777

# 详细文档
## 前台
1. [升级npm依赖](./doc/frontend/ncu.md)
1. [登录页面](./doc/frontend/login.md)

## 后台
1. [后台约定的一些规则](./doc/server/common.md)
1. [枚举](./doc/server/enum.md)
1. [注解](./doc/server/annotation.md)
1. [代码生成器](./doc/server/genetator.md)


# RoadMap
- [X] 账户表改为逻辑删除
- [X] 不能删除自身账户和admin账户
- [X] 权限rbac_menu#link_url不能重复
- [X] 优化权限菜单操作、展示效果
- [X] 删掉无用的Bean属性
- [X] 登录设备日志记录
- [X] 请求URL日志记录
- [ ] 请求URL增加注解，拦截时获取注解说明
- [X] 权限使用注解拦截校验
- [ ] 单点登录控制
- [X] 定时任务执行日志
- [X] 定时任务corn图形化选择
- [ ] 表联合查询组合查询功能
- [ ] 七牛云demo示例
- [ ] 阿里云demo示例
- [X] tinymce编辑器集成
- [ ] pdf阅读器集成
- [X] 切换MyBatis-Plus，delState类型变更为int
- [ ] SpringDoc：https://blog.csdn.net/wdj_yyds/article/details/125174042
- [X] 前端tree结构的根结点ID切换为0，并使用统一的枚举值
- [X] 导出Excel需要适配Enum类型属性的转换
- [X] 剔除多余的hooks使用
- [ ] socket整理
- [X] 集成Spring Validation
- [ ] 集成redis缓存方案
- [X] 集成redis在线管理工具
- [ ] 组合查询功能模块整理
- [ ] 使用https访问后，druid访问nginx 302问题处理
- [x] BaseBiz查询分组List
- [x] 表格高度固定
- [ ] 数据库tinyint是否类字段在ORM映射中统一修改为Bool类型
- [ ] 数据库del_state字段名称统一修改为deleted，方便理解

# 更新日志
## 2022-09-14
1. 请求URL日志记录

## 2022-09-07
1. 增加定时任务执行日志

# 参考资料
[RABC 权限拦截设置](https://blog.csdn.net/ytsydmx/article/details/123801763)
[EasyExcel与@Accessors(chain = true)不兼容分析](https://blog.csdn.net/qq_28036249/article/details/108035369)
[Gson 与 FastJson 对比](https://blog.csdn.net/HA_LLL/article/details/121970037)
