-- ------------------------- info -------------------------
-- @@ver: 1_000_009
-- @@info: 增加"异常捕捉"菜单页面
-- ------------------------- info -------------------------

-- 修复之前的‘文件读取保存’菜单id
UPDATE `base_rbac_menu` SET id = 20020500 WHERE id = 20030500;

INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20030500, 20030000, '异常捕捉', 4, 1, NULL, 1, 1, '/admin/demo/biz/errorCatch', '2025-02-28 19:30:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
