-- ------------------------- info -------------------------
-- @@ver: 1_000_001
-- @@info: 测试升级添加表字段
-- ------------------------- info -------------------------

ALTER TABLE `demo_student` ADD COLUMN `info1` varchar(255) NULL COMMENT '信息字段1' AFTER `info`;