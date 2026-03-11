-- ------------------------- info -------------------------
-- @@ver: 1_000_003
-- @@info: add menu
-- ------------------------- info -------------------------

SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO `fa_admin_dev1`.`base_rbac_menu` (`id`, `parent_id`, `scope`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (22020001, 13000000, 1, '表单管理', 4, 1, 'mdi:form-select', 1, 1, '/admin/flow/manage/form', '2025-12-16 16:00:27', '1', '超级管理员', '192.168.5.88', '2025-12-16 16:00:27', '1', '超级管理员', '127.0.0.1', 0);

INSERT INTO `fa_admin_dev1`.`base_rbac_menu` (`id`, `parent_id`, `scope`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (22020002, 10000000, 1, '功能示例', 3, 1, 'mdi:ev-plug-chademo', 1, 1, '/admin/flow/view/form', '2025-12-27 22:27:16', '1', '超级管理员', '169.254.143.154', '2025-12-27 22:27:15', '1', '超级管理员', '127.0.0.1', 0);

SET FOREIGN_KEY_CHECKS = 1;
