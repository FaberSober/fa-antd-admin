-- ------------------------- info -------------------------
-- @@ver: 1_000_001
-- @@info: add menu
-- ------------------------- info -------------------------

SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `scope`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (22020005, 10000000, 1, '媒体中心', 4, 1, 'mdi:multimedia', 1, 1, '/admin/media', '2026-01-07 14:11:24', '1', '超级管理员', '192.168.5.88', '2026-01-07 14:11:24', '1', '超级管理员', '127.0.0.1', 0);

INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `scope`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (22020006, 22020005, 1, '视频中心', 0, 1, 'mdi:message-video', 1, 1, '/admin/media/video/list', '2026-01-07 14:11:39', '1', '超级管理员', '192.168.5.88', '2026-01-07 14:11:39', '1', '超级管理员', '127.0.0.1', 0);

SET FOREIGN_KEY_CHECKS = 1;
