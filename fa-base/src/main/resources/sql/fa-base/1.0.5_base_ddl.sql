-- ------------------------- info -------------------------
-- @@ver: 1_000_005
-- @@info: base_file_biz字段调整：biz_id非必填、type必填
-- ------------------------- info -------------------------

ALTER TABLE `base_file_biz` MODIFY COLUMN `biz_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '业务ID' AFTER `main_biz_id`;
ALTER TABLE `base_file_biz` MODIFY COLUMN `type` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '业务类型' AFTER `biz_id`;
