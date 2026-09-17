# 测试、构建与部署

归并自 `test.md`、`genetator.md`、`mvn.md`、`git.md`、`docker.md`、`deploy.md`、`win自启动设置.md`、`nginx.md`、`clear_db.md`、`dir.md` 和 `log.md`。

## 目录

- 最小验证与测试
- 代码生成器
- Maven 与依赖检查
- Git submodule
- 打包与部署
- Nginx
- Windows 自启动
- 运维 SQL

## 最小验证与测试

遵守仓库默认：不要运行全量测试，除非用户明确要求。优先按风险选择：

1. 检查变更文件 import、泛型、注解、路径和配置键。
2. 编译目标 Maven 模块及必要依赖。
3. 运行与变更直接相关的测试类或测试方法。
4. 只有用户明确要求时运行全量测试/完整打包。

Spring Boot 测试应用的包路径必须覆盖被扫描代码。现有测试通常使用根包 `com.faber` 下的 `FaTestApp`：

```java
@ExtendWith(SpringExtension.class)
@SpringBootTest(
        classes = FaTestApp.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
class FaAppTest {
    @Test
    void testGetUser() {
        // arrange / act / assert
    }
}
```

跟随目标模块现有 JUnit 版本和注解，不混用 JUnit 4/5 生命周期。测试必须包含断言，不只打印结果。

## 代码生成器

需要单表脚手架时可启动仓库当前 generator 模块并使用其页面生成。历史文档中的模块名、端口和输出目录可能已变化，先查看 generator 的当前配置。

生成后只增量合入需要的文件，并人工核对：

- 包名、模块名、表名、主键类型和 API 路径。
- Entity 基类/注解、Mapper 基类、Biz/Controller 继承。
- 是否重复生成基类已有 CRUD。
- 前端 service/type/路由是否适配当前 feature 结构。
- 无用模板代码、错误 import 和旧框架写法是否已删除。

生成代码不是最终规范，必须与相邻手写模块对齐。

## Maven 与依赖检查

只在用户要求检查升级时运行 Versions Plugin：

```shell
mvn versions:display-dependency-updates
mvn versions:display-plugin-updates
mvn versions:display-property-updates
```

这些命令只报告候选版本，不授权升级。升级前检查父 POM/BOM、Spring Boot 兼容矩阵和多模块影响。普通代码改动使用目标模块的编译或指定测试命令，不默认执行 `mvn package`。

## Git submodule

仓库若实际使用 submodule，再按需求执行：

```shell
git submodule update --init --recursive
```

删除 submodule 涉及工作树、`.gitmodules`、索引和 `.git/modules` 多处状态，属于破坏性操作；只有用户明确要求且确认目标后才执行。不要机械照搬历史 `deinit` 说明。

## 打包与部署

打包、镜像发布、远程部署都会改变外部状态，必须来自用户明确请求。

- Maven 打包可能联动前端构建；先检查当前 POM profile 和插件生命周期。
- Docker 发布前确认 registry、tag、登录身份和 POM 中镜像插件目标；不擅自取消注释 `push` goal。
- 历史 `FaDeploySimpleTest`/`FaDeployHelper` 只作项目线索，使用前审查其目标主机、跳过测试和 shell 调用。
- 环境地址、账号、证书、token 使用部署配置或密钥系统，不写入脚本和文档。
- 日志链路追踪优先复用当前 trace/request ID 机制，不为单个问题引入新的全局组件。

## Nginx

按部署形态选择：

- 前后端同一 Spring Boot 服务：`location /` 反代后端。
- 前后端分离：静态目录作为 `root`，SPA 使用 `try_files $uri /index.html`；仅 `/api/` 等后端路径反代。
- WebSocket/Socket.IO：使用 HTTP/1.1，并传递 `Upgrade` 和 `Connection` 请求头，设置合理读超时。

所有示例都必须替换域名、端口、证书路径和 allowlist。不要复制历史配置中的宽泛正则、`client_max_body_size 0`、旧 TLS 协议或环境专属地址；使用当前安全基线，限制上传体积，启用现代 TLS，并用 `nginx -t` 验证后再加载。

## Windows 自启动

Windows 环境可选择启动目录中的 bat/vbs，或使用 WinSW 注册服务。生产环境优先受控服务方式：

- 可执行文件、XML、JAR 使用一致且唯一的服务名。
- Java 路径、JVM 参数、工作目录和日志滚动使用目标机器实际值。
- 配置失败重启、停止超时和 Automatic start mode。
- 安装、启动、停止、删除服务通常需要管理员权限，执行前确认服务 ID，避免影响同名服务。

不要把历史示例的个人路径、内存参数或固定延迟直接用于目标机器。

## 运维 SQL

`TRUNCATE`、物理 `DELETE` 和清理逻辑删除数据均为破坏性操作。只有用户明确要求、确认环境/库/表并具备备份或恢复方案后才执行。

历史文档列出的日志表包括 `base_job_log`、`base_log_api`，权限关联表包括 `base_rbac_role_menu`、`base_rbac_user_role`。这些名称只作定位线索；执行前必须用当前 schema 验证表、条件、行数和租户范围。优先先跑等价 `SELECT COUNT(*)`，不要在未确认环境中直接 `TRUNCATE`。
