-- ------------------------- info -------------------------
-- @@ver: 1_000_003
-- @@info: 增加演示模块"地图"
-- ------------------------- info -------------------------

INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20060000, 20000000, '地图', 3, 1, 'map', 1, 1, '/admin/demo/map', '2023-02-23 10:48:58', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);

INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20060100, 20060000, '高德地图', 0, 1, NULL, 1, 1, '/admin/demo/map/amap', '2023-02-23 10:49:05', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);

INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20060101, 20060100, '基础地图', 0, 1, NULL, 1, 1, '/admin/demo/map/amap/basic', '2023-02-23 10:49:05', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);

