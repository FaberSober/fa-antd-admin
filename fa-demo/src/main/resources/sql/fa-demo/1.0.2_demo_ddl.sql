-- ------------------------- info -------------------------
-- @@ver: 1_000_002
-- @@info: 增加演示模块"在线文档"
-- ------------------------- info -------------------------

INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20050000, 20000000, '在线文档', 3, 1, 'book', 1, 1, '/admin/demo/doc', '2023-02-23 10:48:58', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);

INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20050100, 20050000, '上传office', 0, 1, NULL, 1, 1, '/admin/demo/doc/upload', '2023-02-23 10:49:05', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20050200, 20050000, 'Word', 1, 1, NULL, 1, 1, '/admin/demo/doc/doc', '2023-02-23 10:49:05', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20050300, 20050000, 'Excel', 2, 1, NULL, 1, 1, '/admin/demo/doc/excel', '2023-02-23 10:49:05', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20050400, 20050000, 'PPT', 3, 1, NULL, 1, 1, '/admin/demo/doc/ppt', '2023-02-23 10:49:05', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);

