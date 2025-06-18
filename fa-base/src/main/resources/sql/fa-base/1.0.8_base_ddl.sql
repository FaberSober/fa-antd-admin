-- ------------------------- info -------------------------
-- @@ver: 1_000_008
-- @@info: 用户增加微信小程序信息字段
-- ------------------------- info -------------------------

ALTER TABLE `base_user` ADD COLUMN `wx_union_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '开放平台的唯一标识符' AFTER `api_token`;
ALTER TABLE `base_user` ADD COLUMN `wx_ma_openid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '微信小程序用户唯一标识' AFTER `wx_union_id`;
