-- ------------------------- info -------------------------
-- @@ver: 1_000_023
-- @@info: base_msg表增加字段：type消息来源类型，buzz_content业务JSON数据
-- ------------------------- info -------------------------

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 增加type字段：消息来源1-系统消息\2-流程消息
ALTER TABLE `base_msg` ADD COLUMN `type` tinyint(4) NOT NULL DEFAULT 1 COMMENT '消息来源：1-系统消息，2-流程消息' AFTER `read_time`;

-- 增加buzz_content字段：业务JSON数据，使用text进行存储
ALTER TABLE `base_msg` ADD COLUMN `buzz_content` text NULL COMMENT '业务JSON数据' AFTER `buzz_id`;

SET FOREIGN_KEY_CHECKS = 1;