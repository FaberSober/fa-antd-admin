-- ------------------------- info -------------------------
-- @@ver: 1_000_006
-- @@info: base_msg字段调整：buzz_type修改为字符串
-- ------------------------- info -------------------------

ALTER TABLE `base_msg` MODIFY COLUMN `buzz_type` varchar(255) NULL DEFAULT NULL COMMENT '业务类型';
