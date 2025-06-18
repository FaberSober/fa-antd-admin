-- ------------------------- info -------------------------
-- @@ver: 1_000_004
-- @@info: APP版本增加字段：force_update强制更新
-- ------------------------- info -------------------------

ALTER TABLE `app_apk_version` ADD COLUMN `force_update` tinyint(1) NULL COMMENT '强制更新' AFTER `download_num`;
