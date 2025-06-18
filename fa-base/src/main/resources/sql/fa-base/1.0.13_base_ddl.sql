-- ------------------------- info -------------------------
-- @@ver: 1_000_013
-- @@info: 增加用户设备表
-- ------------------------- info -------------------------

CREATE TABLE IF NOT EXISTS `base_user_device` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` varchar(32) NOT NULL COMMENT '所属用户ID',
  `device_id` varchar(255) NOT NULL COMMENT '设备ID',
  `model` varchar(255) DEFAULT NULL COMMENT '设备型号',
  `manufacturer` varchar(255) DEFAULT NULL COMMENT '设备厂商',
  `os` varchar(255) DEFAULT NULL COMMENT '系统',
  `os_version` varchar(255) DEFAULT NULL COMMENT '系统版本号',
  `enable` tinyint(1) NOT NULL COMMENT '是否允许访问',
  `last_online_time` timestamp NULL DEFAULT NULL COMMENT '最后在线时间',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `upd_user` varchar(32) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-用户设备';
