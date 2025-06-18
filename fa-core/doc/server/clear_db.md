# 清空数据库日志、逻辑删除等数据

```sql
-- 清理日志表
truncate base_job_log;
truncate base_log_api;

-- 清理权限已删除的数据
delete from base_rbac_role_menu where deleted = true;
delete from base_rbac_user_role where deleted = true;
```