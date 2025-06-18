-- ------------------------- info -------------------------
-- @@ver: 1_000_015
-- @@info: base_notice系统公告content字段格式修改为text，不限制长度
-- ------------------------- info -------------------------

ALTER TABLE `base_notice` MODIFY COLUMN `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '内容' AFTER `title`;
