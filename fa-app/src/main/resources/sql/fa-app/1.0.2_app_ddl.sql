-- ------------------------- info -------------------------
-- @@ver: 1_000_002
-- @@info: 增加下载次数记录
-- ------------------------- info -------------------------

ALTER TABLE `app_apk` ADD COLUMN `download_num` int(11) UNSIGNED NULL DEFAULT 0 COMMENT '下载次数' AFTER `size`;
ALTER TABLE `app_apk_version` ADD COLUMN `download_num` int(11) UNSIGNED NULL DEFAULT 0 COMMENT '下载次数' AFTER `size`;

UPDATE app_apk SET download_num = 0 WHERE download_num IS NULL;
UPDATE app_apk_version SET download_num = 0 WHERE download_num IS NULL;
