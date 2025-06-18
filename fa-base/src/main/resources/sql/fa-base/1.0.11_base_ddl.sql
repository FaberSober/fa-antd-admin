-- ------------------------- info -------------------------
-- @@ver: 1_000_011
-- @@info: 增加系统新闻表
-- ------------------------- info -------------------------

CREATE TABLE IF NOT EXISTS `base_sys_news` (
   `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
   `title` varchar(50) NOT NULL COMMENT '标题',
   `content` longtext COMMENT '内容',
   `cover` varchar(32) DEFAULT NULL COMMENT '封面',
   `author` varchar(255) DEFAULT NULL COMMENT '作者',
   `pub_time` timestamp NULL DEFAULT NULL COMMENT '发布时间',
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
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-系统-新闻';
