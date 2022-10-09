# Get Start
演示地址：http://fa.dward.cn/login
演示账户：admin/888888

## 项目说明
一个前后端分离的springboot项目，未使用微服务，部署简单。maven一键打包前后端代码，只需部署一个最终的jar来启动服务。适合小型项目。
- 前端：react18 + antd4.x + vite3(快速开发 + 打包生产)
- 后端：springboot2.4.x
- 环境：mysql5.7 + redis4

## 开发说明
1. 导入数据库文件：`faber-admin/src/main/resources/data/sql/V1.0.0.sql`
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

## 项目开发使用到的地址
1. ~~http://localhost/swagger-ui.html~~
2. druid数据源：http://localhost/druid/index.html
3. 代码生成：http://localhost:7777

## 一些约定
1. tree结构数据，根结点的ID默认为0；

### 2. 枚举类型定义约定
```java
package com.faber.common.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum BoolEnum implements IEnum<Integer> {
   NO(0, "否"),
   YES(1, "是");

   @JsonValue
   @EnumValue
   private final Integer value;
   private final String desc;

   BoolEnum(Integer value, String desc) {
      this.value = value;
      this.desc = desc;
   }

}
```

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

## 后端注解
| 注解 | 说明 |
| :--- | :--- |
| @LogNoRet | 不记录系统日志，如查询类的page分页，返回信息太大，不记录到系统日志中 |

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
- [ ] tinymce编辑器集成
- [ ] pdf阅读器集成
- [X] 切换MyBatis-Plus，delState类型变更为int
- [ ] SpringDoc：https://blog.csdn.net/wdj_yyds/article/details/125174042
- [X] 前端tree结构的根结点ID切换为0，并使用统一的枚举值
- [X] 导出Excel需要适配Enum类型属性的转换
- [ ] 剔除多余的hooks使用
- [ ] socket整理
- [X] 集成Spring Validation
- [ ] 集成redis缓存方案

# 前端代码迁移
- [x] BaseBiz查询分组List
- [x] 表格高度固定

# 更新日志
## 2022-09-14
1. 请求URL日志记录

## 2022-09-07
1. 增加定时任务执行日志

# 参考资料
[RABC 权限拦截设置](https://blog.csdn.net/ytsydmx/article/details/123801763)
[EasyExcel与@Accessors(chain = true)不兼容分析](https://blog.csdn.net/qq_28036249/article/details/108035369)
[Gson 与 FastJson 对比](https://blog.csdn.net/HA_LLL/article/details/121970037)
