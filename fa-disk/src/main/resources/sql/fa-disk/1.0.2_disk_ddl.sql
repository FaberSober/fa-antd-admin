-- ------------------------- info -------------------------
-- @@ver: 1_000_002
-- @@info: 文档增加历史记录信息
-- ------------------------- info -------------------------

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

ALTER TABLE `disk_store_file_his` ADD COLUMN `change_file_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'Office文件变更内容zip包文件ID（适用于onlyoffice）' AFTER `file_save_id`;

ALTER TABLE `disk_store_file_his` ADD COLUMN `ver` int(11) NOT NULL COMMENT '版本号' AFTER `file_name`;

SET FOREIGN_KEY_CHECKS=1;
