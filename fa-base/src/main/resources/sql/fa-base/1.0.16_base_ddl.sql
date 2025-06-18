-- ------------------------- info -------------------------
-- @@ver: 1_000_016
-- @@info: base_file_biz通用业务附件表增加sort排序字段
-- ------------------------- info -------------------------

ALTER TABLE `base_file_biz` ADD COLUMN `sort` int(11) NULL COMMENT '排序' AFTER `ext`;
