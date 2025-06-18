-- file_save add md5 column
ALTER TABLE `base_file_save` ADD COLUMN `md5` varchar(32) NULL DEFAULT NULL COMMENT '文件MD5' AFTER `attr`;
ALTER TABLE `base_file_save` MODIFY COLUMN `content_type` varchar(255) NOT NULL COMMENT 'MIME类型' AFTER `ext`;