-- ------------------------- info -------------------------
-- @@ver: 1_000_015
-- @@info: 增加"MapBox"菜单页面
-- ------------------------- info -------------------------

INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20060200, 20060000, 'MapBox', 2, 1, NULL, true, 1, '/admin/demo/map/mapbox', '2025-12-24 11:00:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, false);