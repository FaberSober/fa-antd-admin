-- ------------------------- info -------------------------
-- @@ver: 1_000_009
-- @@info: 用户增加工作状态字段
-- ------------------------- info -------------------------

ALTER TABLE `base_user` ADD COLUMN `work_status` tinyint(4) NULL DEFAULT NULL COMMENT '工作状态：0-在职/1-请假/2-离职' AFTER `wx_ma_openid`;