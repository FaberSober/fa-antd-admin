-- ------------------------- info -------------------------
-- @@ver: 1_000_001
-- @@info: 修复crt_time字段更新自动更新
-- ------------------------- info -------------------------

ALTER TABLE `app_apk` MODIFY COLUMN `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER TABLE `app_apk_crash` MODIFY COLUMN `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER TABLE `app_apk_version` MODIFY COLUMN `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';

ALTER TABLE `app_apk_crash` MODIFY COLUMN `crash_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '崩溃时间' AFTER `detail`;
