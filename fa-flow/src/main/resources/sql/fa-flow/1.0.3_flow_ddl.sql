-- ------------------------- info -------------------------
-- @@ver: 1_000_003
-- @@info: add menu
-- ------------------------- info -------------------------

SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO `fa_admin_dev1`.`base_rbac_menu` (`id`, `parent_id`, `scope`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (22020001, 13000000, 1, '表单管理', 4, 1, 'mdi:form-select', 1, 1, '/admin/flow/manage/form', '2025-12-16 16:00:27', '1', '超级管理员', '192.168.5.88', '2025-12-16 16:00:27', '1', '超级管理员', '127.0.0.1', 0);

INSERT INTO `fa_admin_dev1`.`base_rbac_menu` (`id`, `parent_id`, `scope`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (22020002, 10000000, 1, '功能示例', 3, 1, 'mdi:ev-plug-chademo', 1, 1, '/admin/flow/view/form', '2025-12-27 22:27:16', '1', '超级管理员', '169.254.143.154', '2025-12-27 22:27:15', '1', '超级管理员', '127.0.0.1', 0);

INSERT INTO `fa_admin_dev1`.`base_rbac_menu` (`id`, `parent_id`, `scope`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (22020003, 22020002, 1, '请假示例', 0, 1, 'mdi:time-to-leave', 1, 4, '/admin/flow/view/form/3', '2025-12-27 22:27:33', '1', '超级管理员', '169.254.143.154', '2025-12-27 22:27:33', '1', '超级管理员', '169.254.143.154', 0);

INSERT INTO `fa_admin_dev1`.`base_rbac_menu` (`id`, `parent_id`, `scope`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (22020004, 22020002, 1, '订单示例', 1, 1, 'mdi:money-usd', 1, 4, '/admin/flow/view/form/2', '2025-12-27 22:28:08', '1', '超级管理员', '169.254.143.154', '2025-12-27 22:28:07', '1', '超级管理员', '192.168.5.176', 0);

INSERT INTO `fa_admin_dev1`.`base_rbac_menu` (`id`, `parent_id`, `scope`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (22020007, 22020002, 1, '测试单表管理', 2, 1, 'mdi:file-table-box-outline', 1, 4, '/admin/flow/view/form/4', '2026-02-05 17:26:09', '1', '超级管理员', '127.0.0.1', '2026-02-05 17:26:08', '1', '超级管理员', '127.0.0.1', 0);

INSERT INTO `fa_admin_dev1`.`base_rbac_menu` (`id`, `parent_id`, `scope`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (22020008, 22020002, 1, '测试关联子表', 3, 1, 'mdi:file-table-box-multiple-outline', 1, 4, '/admin/flow/view/form/5', '2026-02-07 20:30:35', '1', '超级管理员', '26.26.26.1', '2026-02-07 20:30:34', '1', '超级管理员', '127.0.0.1', 0);

SET FOREIGN_KEY_CHECKS = 1;
