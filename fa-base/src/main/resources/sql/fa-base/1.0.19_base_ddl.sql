-- ------------------------- info -------------------------
-- @@ver: 1_000_019
-- @@info: 菜单：增加“日志监控”功能菜单页面
-- ------------------------- info -------------------------

INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (12040400, 12040000, '日志监控', 3, 1, NULL, 1, 1, '/admin/system/monitor/logmonitor', '2024-11-27 17:41:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
