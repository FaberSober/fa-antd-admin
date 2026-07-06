# DDL 参考

## 基线

编写或修改 SQL 前，先查看相似脚本：

- `fa-base/src/main/resources/sql/fa-base`
- 重点看 `fa-base/src/main/resources/sql/fa-base/1.0.0_base_ddl.sql`

默认使用 MySQL 5.7 兼容语法，优先采用：

```sql
CREATE TABLE IF NOT EXISTS `table_name` (
  ...
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='中文表注释';
```

维护已有 `utf8` 老表时，除非任务明确要求字符集迁移，否则保留现有风格，不主动统一改造。

## 审计字段

需要完整审计信息的普通业务表，默认使用以下字段，并保持字段名、类型、默认值、注释一致：

```sql
`crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
`crt_user` varchar(32) NOT NULL COMMENT '创建用户ID',
`crt_name` varchar(255) NOT NULL COMMENT '创建用户',
`crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
`upd_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
`upd_user` varchar(32) DEFAULT NULL COMMENT '更新用户ID',
`upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
`upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
`deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
```

日志表、纯关联日志、系统升级记录等表，如果相邻先例只保留部分审计字段，可以保持一致。逻辑删除字段统一使用 `deleted`，不要改成 `is_deleted` 或 `del_flag`。

## 主键与字段类型

不要把所有新表主键统一成 `BIGINT`。

- 配置、字典、菜单、角色、日志类表常见 `int(11)` 或 `int(11) unsigned AUTO_INCREMENT`。
- 用户、部门、文件等表常见 `varchar(32)`。
- 部分历史基础表可能使用 `mediumint` 或 `bigint unsigned`。
- 类外键字段应匹配被关联表的真实主键类型。

默认不添加数据库外键约束，优先通过业务约束和索引控制关联关系。

## 命名与索引

优先复用已有字段名，例如 `status`、`sort`、`sort_id`、`description`、`remark`、`parent_id`、`user_id`、`xxx_user`。布尔语义字段使用 `tinyint(1)`，并在中文注释里写清楚 `0/1` 含义。

每张表至少包含主键。唯一索引、普通索引按业务唯一性和查询条件决定，不要为了“规范化”给每个字段都建索引。索引名保持简洁，并与相邻脚本兼容；相邻脚本使用 `USING BTREE` 时继续保留该风格。

## 菜单 SQL

为前端页面生成菜单数据时，先参考 `fa-base/src/main/resources/sql/fa-base/1.0.0_base_ddl.sql` 中 `base_rbac_menu` 的字段顺序和“首页”菜单记录。默认字段顺序保持：

```sql
id, parent_id, name, sort, level, icon, status, link_type, link_url,
crt_time, crt_user, crt_name, crt_host, upd_time, upd_user, upd_name, upd_host, deleted
```

生成前必须先搜索已有菜单 ID 和路径，避免与基础脚本、历史版本脚本冲突：

- 先确认挂载父菜单，例如“首页”通常为 `10000000`。
- 检查同父级已有段位，例如 `10010000`、`10020000` 是否已被使用，再选择未占用的新段位。
- 子菜单 ID 使用父级段位递增，例如模块 `10030000`，分组 `10030100`，页面 `10030101`。
- `link_url` 必须与前端页面目录路径一致，例如 `pages/admin/hqd/permit/licenseApplication/index.tsx` 对应 `/admin/hqd/permit/licenseApplication`。

菜单层级按页面复杂度生成：

- 顶层业务入口挂到指定父菜单下，`level` 通常为 `1`。
- 业务分组作为中间菜单，例如“事前许可”“事中称重”。
- 具体页面作为叶子菜单，名称使用页面业务名。
- 按同级显示顺序设置 `sort`，从 `0` 开始递增。
- 图标仅给业务入口或分组配置；叶子菜单没有明确需求时使用 `NULL`。

SQL 方言必须跟随目标版本脚本：

- MySQL 脚本沿用反引号、`status`/`deleted` 使用 `1`/`0`，时间可沿用相邻脚本的字符串或函数。
- PostgreSQL 脚本不使用反引号；如果目标库中 `status`、`deleted` 是 `boolean`，必须使用 `true`/`false`，不能写 `1`/`0`。
- PostgreSQL 菜单初始化推荐使用 `ON CONFLICT (id) DO NOTHING`，保证版本脚本重复执行时不会因菜单已存在失败。

PostgreSQL 示例：

```sql
INSERT INTO base_rbac_menu (id, parent_id, name, sort, level, icon, status, link_type, link_url, crt_time, crt_user, crt_name, crt_host, upd_time, upd_user, upd_name, upd_host, deleted)
VALUES
  (10030000, 10000000, '业务模块', 2, 1, 'mdi:database-outline', true, 1, '/admin/biz', CURRENT_TIMESTAMP, '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, false),
  (10030100, 10030000, '业务分组', 0, 1, 'mdi:file-document-edit-outline', true, 1, '/admin/biz/group', CURRENT_TIMESTAMP, '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, false),
  (10030101, 10030100, '业务页面', 0, 1, NULL, true, 1, '/admin/biz/group/page', CURRENT_TIMESTAMP, '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, false)
ON CONFLICT (id) DO NOTHING;
```
