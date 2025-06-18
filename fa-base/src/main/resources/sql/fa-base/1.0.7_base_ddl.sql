-- ------------------------- info -------------------------
-- @@ver: 1_000_007
-- @@info: 增加菜单：首页/监控页
-- ------------------------- info -------------------------

INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (10020000, 10000000, '监控页', 0, 1, 'chart-line', 1, 1, '/admin/home/monitor', '2023-07-15 16:07:53', '1', '超级管理员1', '127.0.0.1', NULL, NULL, NULL, NULL, 0);

