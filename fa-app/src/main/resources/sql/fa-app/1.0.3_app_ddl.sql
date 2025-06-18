-- ------------------------- info -------------------------
-- @@ver: 1_000_003
-- @@info: 增加全部APP管理菜单
-- ------------------------- info -------------------------

INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (21030000, 21000000, '全部APP版本', 0, 1, 'store', 1, 1, '/admin/app/app/allApk', '2023-08-10 11:23:14', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);

