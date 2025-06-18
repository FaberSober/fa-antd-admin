-- ------------------------- info -------------------------
-- @@ver: 1_000_003
-- @@info: 修复crt_time字段更新自动更新
-- ------------------------- info -------------------------

ALTER TABLE `disk_store_bucket` MODIFY COLUMN `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER TABLE `disk_store_bucket_user` MODIFY COLUMN `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER TABLE `disk_store_file` MODIFY COLUMN `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER TABLE `disk_store_file_his` MODIFY COLUMN `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER TABLE `disk_store_file_tag` MODIFY COLUMN `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER TABLE `disk_store_tag` MODIFY COLUMN `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
