-- ------------------------- info -------------------------
-- @@ver: 1_000_020
-- @@info: 菜单：base_rbac_menu增加字段：“模块”
-- ------------------------- info -------------------------

ALTER TABLE `base_rbac_menu` ADD COLUMN `scope` tinyint(4) NULL DEFAULT 1 COMMENT '模块：1-web/2-app' AFTER `parent_id`;
UPDATE base_rbac_menu SET scope = 1 WHERE scope IS NULL;
# ALTER TABLE `base_rbac_menu` MODIFY COLUMN `scope` tinyint(4) NOT NULL COMMENT '模块：1-web/2-app' AFTER `parent_id`;
