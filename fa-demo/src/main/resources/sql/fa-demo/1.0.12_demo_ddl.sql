-- ------------------------- info -------------------------
-- @@ver: 1_000_012
-- @@info: Student表字段修改
-- ------------------------- info -------------------------

ALTER TABLE `demo_student` 
MODIFY COLUMN `corp_id` int(11) NULL COMMENT '企业ID' AFTER `info_id`,
MODIFY COLUMN `tenant_id` int(11) NULL COMMENT '租户ID' AFTER `corp_id`;

ALTER TABLE `demo_student` ADD COLUMN `dict1` varchar(255) NULL COMMENT '字典值1' AFTER `info_id`;
ALTER TABLE `demo_student` ADD COLUMN `dict2` varchar(255) NULL COMMENT '字典值2' AFTER `dict1`;
ALTER TABLE `demo_student` ADD COLUMN `dict3` varchar(255) NULL COMMENT '字典值3' AFTER `dict2`;
