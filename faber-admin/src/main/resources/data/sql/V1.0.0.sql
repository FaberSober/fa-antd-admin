/*
 Navicat Premium Data Transfer

 Source Server         : faber-admin-dev-127.0.0.1
 Source Server Type    : MySQL
 Source Server Version : 50727
 Source Host           : 127.0.0.1:3306
 Source Schema         : faber_admin

 Target Server Type    : MySQL
 Target Server Version : 50727
 File Encoding         : 65001

 Date: 17/08/2022 15:30:50
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for article_book
-- ----------------------------
DROP TABLE IF EXISTS `article_book`;
CREATE TABLE `article_book` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `no` varchar(50) DEFAULT NULL COMMENT '编号',
  `name` varchar(50) NOT NULL COMMENT '书名',
  `biz_type` varchar(255) DEFAULT NULL COMMENT '业务类型',
  `biz_id` varchar(255) DEFAULT NULL COMMENT '业务ID',
  `cover` varchar(255) DEFAULT NULL COMMENT '封面图',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `pub` tinyint(1) DEFAULT NULL COMMENT '是否发布',
  `pub_time` datetime DEFAULT NULL COMMENT '发布时间',
  `crt_time` datetime DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` datetime DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` enum('0','1') DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  `del_time` datetime DEFAULT NULL COMMENT '删除时间',
  `del_user` varchar(255) DEFAULT NULL COMMENT '删除用户ID',
  `del_name` varchar(255) DEFAULT NULL COMMENT '删除用户',
  `del_host` varchar(255) DEFAULT NULL COMMENT '删除IP',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COMMENT='文章-书本';

-- ----------------------------
-- Records of article_book
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for article_detail
-- ----------------------------
DROP TABLE IF EXISTS `article_detail`;
CREATE TABLE `article_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `outline_id` int(11) DEFAULT NULL COMMENT '大纲ID',
  `detail` longtext COMMENT 'html文本',
  `crt_time` datetime DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` datetime DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` enum('0','1') DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  `del_time` datetime DEFAULT NULL COMMENT '删除时间',
  `del_user` varchar(255) DEFAULT NULL COMMENT '删除用户ID',
  `del_name` varchar(255) DEFAULT NULL COMMENT '删除用户',
  `del_host` varchar(255) DEFAULT NULL COMMENT '删除IP',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=328 DEFAULT CHARSET=utf8mb4 COMMENT='文章-详情';

-- ----------------------------
-- Records of article_detail
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for article_outline
-- ----------------------------
DROP TABLE IF EXISTS `article_outline`;
CREATE TABLE `article_outline` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `book_id` int(11) NOT NULL COMMENT '书本ID',
  `detail_id` int(11) DEFAULT NULL COMMENT '详情ID',
  `parent_id` int(11) NOT NULL COMMENT '父级节点',
  `no` varchar(50) DEFAULT NULL COMMENT '章节号',
  `title` varchar(255) NOT NULL COMMENT '标题',
  `icon` varchar(255) DEFAULT NULL COMMENT '图标',
  `sort` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
  `crt_time` datetime DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` datetime DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` enum('0','1') DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  `del_time` datetime DEFAULT NULL COMMENT '删除时间',
  `del_user` varchar(255) DEFAULT NULL COMMENT '删除用户ID',
  `del_name` varchar(255) DEFAULT NULL COMMENT '删除用户',
  `del_host` varchar(255) DEFAULT NULL COMMENT '删除IP',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=362 DEFAULT CHARSET=utf8mb4 COMMENT='文章-大纲';

-- ----------------------------
-- Records of article_outline
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for base_area
-- ----------------------------
DROP TABLE IF EXISTS `base_area`;
CREATE TABLE `base_area` (
  `id` mediumint(7) unsigned NOT NULL AUTO_INCREMENT,
  `level` tinyint(1) unsigned NOT NULL COMMENT '层级',
  `parent_code` bigint(14) unsigned NOT NULL DEFAULT '0' COMMENT '父级行政代码',
  `area_code` bigint(14) unsigned NOT NULL DEFAULT '0' COMMENT '行政代码',
  `zip_code` mediumint(6) unsigned zerofill NOT NULL DEFAULT '000000' COMMENT '邮政编码',
  `city_code` char(6) NOT NULL DEFAULT '' COMMENT '区号',
  `name` varchar(50) NOT NULL DEFAULT '' COMMENT '名称',
  `short_name` varchar(50) NOT NULL DEFAULT '' COMMENT '简称',
  `merger_name` varchar(50) NOT NULL DEFAULT '' COMMENT '组合名',
  `pinyin` varchar(30) NOT NULL DEFAULT '' COMMENT '拼音',
  `lng` decimal(10,6) NOT NULL DEFAULT '0.000000' COMMENT '经度',
  `lat` decimal(10,6) NOT NULL DEFAULT '0.000000' COMMENT '纬度',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idx` (`area_code`) USING BTREE,
  KEY `pidx` (`parent_code`) USING BTREE,
  KEY `level` (`level`) USING BTREE,
  KEY `name` (`name`) USING BTREE,
  KEY `level_name` (`level`,`name`) USING BTREE,
  KEY `short_name` (`short_name`) USING BTREE,
  KEY `level_short_name` (`level`,`short_name`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=778094 DEFAULT CHARSET=utf8 COMMENT='BASE-中国行政地区表';

-- ----------------------------
-- Records of base_area
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for base_biz_file
-- ----------------------------
DROP TABLE IF EXISTS `base_biz_file`;
CREATE TABLE `base_biz_file` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) DEFAULT NULL COMMENT '附件URL',
  `biz_id` varchar(255) DEFAULT NULL COMMENT '业务ID',
  `biz_type` varchar(255) DEFAULT NULL COMMENT '业务类型',
  `crt_time` datetime DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` datetime DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` enum('0','1') DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  `del_time` datetime DEFAULT NULL COMMENT '删除时间',
  `del_user` varchar(255) DEFAULT NULL COMMENT '删除用户ID',
  `del_name` varchar(255) DEFAULT NULL COMMENT '删除用户',
  `del_host` varchar(255) DEFAULT NULL COMMENT '删除IP',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-通用-业务附件';

-- ----------------------------
-- Records of base_biz_file
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for base_config
-- ----------------------------
DROP TABLE IF EXISTS `base_config`;
CREATE TABLE `base_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `buzz_modal` varchar(255) DEFAULT NULL COMMENT '业务模块',
  `type` varchar(255) DEFAULT NULL COMMENT '配置类型',
  `name` varchar(255) DEFAULT NULL COMMENT '配置名称',
  `data` text COMMENT '配置JSON',
  `system` enum('0','1') DEFAULT '0' COMMENT '是否系统',
  `default_scene` enum('0','1') DEFAULT '0' COMMENT '是否默认',
  `hide` enum('0','1') DEFAULT '0' COMMENT '是否隐藏',
  `sort` int(11) DEFAULT NULL COMMENT '排序ID',
  `belong_user_id` varchar(36) DEFAULT NULL COMMENT '所属用户ID',
  `crt_time` datetime DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` datetime DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` enum('0','1') DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  `del_time` datetime DEFAULT NULL COMMENT '删除时间',
  `del_user` varchar(255) DEFAULT NULL COMMENT '删除用户ID',
  `del_name` varchar(255) DEFAULT NULL COMMENT '删除用户',
  `del_host` varchar(255) DEFAULT NULL COMMENT '删除IP',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-系统-配置表';

-- ----------------------------
-- Records of base_config
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for base_department
-- ----------------------------
DROP TABLE IF EXISTS `base_department`;
CREATE TABLE `base_department` (
  `id` varchar(50) NOT NULL COMMENT 'ID',
  `name` varchar(255) DEFAULT NULL COMMENT '部门名称',
  `description` varchar(255) DEFAULT NULL COMMENT '备注',
  `parent_id` varchar(50) DEFAULT NULL COMMENT '父部门ID',
  `sort` int(11) DEFAULT '1' COMMENT '排序',
  `type` varchar(255) DEFAULT NULL COMMENT '类型',
  `manager_id` varchar(50) DEFAULT NULL COMMENT '负责人ID',
  `crt_time` datetime DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` datetime DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` enum('0','1') DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  `del_time` datetime DEFAULT NULL COMMENT '删除时间',
  `del_user` varchar(255) DEFAULT NULL COMMENT '删除用户ID',
  `del_name` varchar(255) DEFAULT NULL COMMENT '删除用户',
  `del_host` varchar(255) DEFAULT NULL COMMENT '删除IP',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-部门';

-- ----------------------------
-- Records of base_department
-- ----------------------------
BEGIN;
INSERT INTO `base_department` (`id`, `name`, `description`, `parent_id`, `sort`, `type`, `manager_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES ('1', '办公室', NULL, '-1', 1, NULL, NULL, '2020-06-26 16:07:35', '1', 'admin', '123.116.43.116', '2020-06-26 16:07:35', '1', 'admin', '123.116.43.116', '0', NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for base_dict
-- ----------------------------
DROP TABLE IF EXISTS `base_dict`;
CREATE TABLE `base_dict` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `type` int(11) DEFAULT NULL COMMENT '字典分组',
  `category` tinyint(1) DEFAULT '0' COMMENT '字典类型：0-文本/1-文件',
  `text` varchar(255) DEFAULT NULL COMMENT '字典文本',
  `value` varchar(255) DEFAULT NULL COMMENT '字典值',
  `sort` int(11) DEFAULT '0' COMMENT '排序',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `color` varchar(50) DEFAULT NULL COMMENT '颜色',
  `crt_time` datetime DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建人ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建人',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建主机',
  `upd_time` datetime DEFAULT NULL COMMENT '最后更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '最后更新人ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '最后更新人',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '最后更新主机',
  `del_state` enum('0','1') DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  `del_time` datetime DEFAULT NULL COMMENT '删除时间',
  `del_user` varchar(255) DEFAULT NULL COMMENT '删除用户ID',
  `del_name` varchar(255) DEFAULT NULL COMMENT '删除用户',
  `del_host` varchar(255) DEFAULT NULL COMMENT '删除IP',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=159 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-字典值';

-- ----------------------------
-- Records of base_dict
-- ----------------------------
BEGIN;
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (3, 1, 0, 'server_invoke_path_url', 'http://localhost/druid/index.html', 1, 'druid monitor', NULL, '2019-07-03 22:56:47', NULL, NULL, '192.168.199.122', '2019-08-14 15:50:52', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (9, 6, 0, '男', '1', 1, '', NULL, '2019-08-15 21:57:40', '1', 'admin', '127.0.0.1', '2019-10-30 16:41:57', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (10, 6, 0, '女', '2', 2, '', NULL, '2019-08-15 21:57:49', '1', 'admin', '127.0.0.1', '2019-10-30 16:42:01', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (11, 7, 0, '小学', '1', 1, '', NULL, '2019-08-15 21:59:01', '1', 'admin', '127.0.0.1', '2019-08-15 21:59:01', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (12, 7, 0, '中学', '2', 2, '', NULL, '2019-08-15 21:59:22', '1', 'admin', '127.0.0.1', '2019-08-15 21:59:22', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (13, 7, 0, '高中', '3', 3, '', NULL, '2019-08-15 21:59:30', '1', 'admin', '127.0.0.1', '2019-08-15 21:59:30', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (14, 7, 0, '大学', '4', 4, '', NULL, '2019-08-15 21:59:36', '1', 'admin', '127.0.0.1', '2019-08-15 21:59:36', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (15, 7, 0, '研究生', '5', 5, '', NULL, '2019-08-15 21:59:49', '1', 'admin', '127.0.0.1', '2019-08-15 21:59:49', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (16, 7, 0, '博士', '6', 6, '', NULL, '2019-08-15 21:59:56', '1', 'admin', '127.0.0.1', '2019-08-15 21:59:56', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (18, 8, 0, '群众', '1', 1, '', NULL, '2019-08-15 22:02:03', '1', 'admin', '127.0.0.1', '2019-08-15 22:02:03', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (19, 8, 0, '团员', '2', 2, '', NULL, '2019-08-15 22:02:16', '1', 'admin', '127.0.0.1', '2019-08-15 22:02:16', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (20, 8, 0, '党员', '3', 3, '', NULL, '2019-08-15 22:02:22', '1', 'admin', '127.0.0.1', '2019-08-15 22:02:22', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (21, 9, 0, '领导', 'leader', 1, '', NULL, '2019-08-17 09:44:10', '1', 'admin', '127.0.0.1', '2019-08-17 09:44:10', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (22, 9, 0, '员工', 'member', 2, '', NULL, '2019-08-17 09:44:19', '1', 'admin', '127.0.0.1', '2019-08-17 09:44:19', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (23, 11, 0, '省', '0', 1, '省/直辖市，省/特区', NULL, '2019-08-21 10:14:07', '1', 'admin', '127.0.0.1', '2019-08-21 10:14:07', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (24, 11, 0, '市', '1', 2, '市/州，港澳辖区', NULL, '2019-08-21 10:14:43', '1', 'admin', '127.0.0.1', '2019-08-21 10:14:43', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (25, 11, 0, '县', '2', 3, '县/区，台湾市/县', NULL, '2019-08-21 10:15:14', '1', 'admin', '127.0.0.1', '2019-08-21 10:15:14', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (26, 11, 0, '乡', '3', 4, '乡/镇，台湾区/镇', NULL, '2019-08-21 10:15:43', '1', 'admin', '127.0.0.1', '2019-08-21 10:15:43', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (27, 11, 0, '村', '4', 5, '村/社区，台湾街道/村', NULL, '2019-08-21 10:16:08', '1', 'admin', '127.0.0.1', '2019-08-21 10:16:08', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (28, 1, 0, 'camunda_platform', 'http://localhost:8080/camunda-welcome/', 2, 'Camunda Platform', NULL, '2019-09-09 06:06:44', '1', 'admin', '127.0.0.1', '2019-09-09 06:06:44', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (29, 13, 0, '有效', '1', 1, '', NULL, '2019-10-30 14:08:45', '1', 'admin', '127.0.0.1', '2019-10-30 14:08:53', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (30, 13, 0, '冻结', '2', 2, '', NULL, '2019-10-30 14:09:01', '1', 'admin', '127.0.0.1', '2019-10-30 14:09:01', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (31, 6, 0, '保密', '0', 0, '', NULL, '2019-10-30 15:44:11', '1', 'admin', '127.0.0.1', '2019-10-30 15:44:11', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (147, 49, 0, '是', '1', 1, NULL, NULL, '2020-11-05 15:21:51', '1', 'admin', '120.243.220.191', '2020-11-05 15:21:51', '1', 'admin', '120.243.220.191', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (148, 49, 0, '否', '0', 2, NULL, NULL, '2020-11-05 15:22:02', '1', 'admin', '120.243.220.191', '2020-11-05 15:22:02', '1', 'admin', '120.243.220.191', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (155, 54, 0, 'system:title', '后台管理系统', 1, NULL, NULL, '2022-08-10 13:59:17', '1', 'admin', '127.0.0.1', '2022-08-10 13:59:17', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (156, 54, 1, 'system:logo', 'http://kgcesi.dward.cn/dict/file/dict/202208/logo_20220810152923.png', 2, NULL, NULL, '2022-08-10 15:30:13', '1', 'admin', '127.0.0.1', '2022-08-10 15:30:13', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (157, 54, 1, 'system:portal:logoWithText', 'http://kgcesi.dward.cn/dict/file/dict/202208/logo_20220810153050.png', 3, NULL, NULL, '2022-08-10 15:30:52', '1', 'admin', '127.0.0.1', '2022-08-10 15:30:52', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (158, 54, 0, 'system:portal:link', 'http://xxx.xxx.com', 4, NULL, NULL, '2022-08-10 15:31:11', '1', 'admin', '127.0.0.1', '2022-08-10 15:31:11', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for base_dict_type
-- ----------------------------
DROP TABLE IF EXISTS `base_dict_type`;
CREATE TABLE `base_dict_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `code` varchar(255) DEFAULT NULL COMMENT '编码',
  `name` varchar(255) DEFAULT NULL COMMENT '名称',
  `parent_id` int(11) NOT NULL COMMENT '上级节点',
  `sort_id` int(11) DEFAULT '0' COMMENT '排序ID',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `crt_time` datetime DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建人ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建人',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建主机',
  `upd_time` datetime DEFAULT NULL COMMENT '最后更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '最后更新人ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '最后更新人',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '最后更新主机',
  `del_state` enum('0','1') DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  `del_time` datetime DEFAULT NULL COMMENT '删除时间',
  `del_user` varchar(255) DEFAULT NULL COMMENT '删除用户ID',
  `del_name` varchar(255) DEFAULT NULL COMMENT '删除用户',
  `del_host` varchar(255) DEFAULT NULL COMMENT '删除IP',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-字典分类';

-- ----------------------------
-- Records of base_dict_type
-- ----------------------------
BEGIN;
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (1, 'sys_monitor_module', '系统监控模块', -1, 99, '系统监控模块，如druid、health', '2019-07-03 22:50:49', NULL, NULL, '192.168.199.122', '2019-10-31 16:05:06', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (2, 'test', '常用字典', -1, 1, NULL, '2019-08-15 21:03:17', '1', 'admin', '127.0.0.1', '2019-08-15 22:02:42', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (6, 'common_sex', '性别', 12, 1, NULL, '2019-08-15 21:56:54', '1', 'admin', '127.0.0.1', '2020-06-19 09:50:36', '1', 'admin', '114.242.249.111', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (7, 'common_education', '学历', 12, 2, NULL, '2019-08-15 21:58:47', '1', 'admin', '127.0.0.1', '2020-06-19 09:50:45', '1', 'admin', '114.242.249.111', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (8, 'common_politics', '政治面貌', 12, 3, NULL, '2019-08-15 22:01:51', '1', 'admin', '127.0.0.1', '2020-06-19 09:50:52', '1', 'admin', '114.242.249.111', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (9, 'group_user_type', '分组用户类型', 12, 4, NULL, '2019-08-17 09:43:54', '1', 'admin', '127.0.0.1', '2020-06-19 09:50:59', '1', 'admin', '114.242.249.111', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (10, 'common_area', '地区', 2, 1, NULL, '2019-08-21 10:13:03', '1', 'admin', '127.0.0.1', '2020-11-05 15:21:38', '1', 'admin', '120.243.220.191', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (11, 'common_area_level', '层级', 10, 1, NULL, '2019-08-21 10:13:38', '1', 'admin', '127.0.0.1', '2019-08-21 10:13:38', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (12, 'common_user', '账户字典', 2, 0, NULL, '2019-10-30 14:07:45', '1', 'admin', '127.0.0.1', '2019-10-30 14:07:45', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (13, 'common_user_status', '账户状态', 12, 1, NULL, '2019-10-30 14:08:08', '1', 'admin', '127.0.0.1', '2019-10-30 15:09:06', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (20, 'sys_file_download', '系统文件下载', 2, 3, '系统文件下载：包括文件模板、常用文件', '2019-11-20 10:38:01', '1', 'admin', '127.0.0.1', '2021-03-25 11:40:35', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (48, 'base_dict', '基础字典', 2, 2, NULL, '2020-11-05 15:21:23', '1', 'admin', '120.243.220.191', '2020-11-05 15:21:38', '1', 'admin', '120.243.220.191', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (49, 'base_dict_bool', '是否', 48, 0, NULL, '2020-11-05 15:21:36', '1', 'admin', '120.243.220.191', '2021-03-25 11:40:35', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (54, 'system', '系统设置', -1, 100, NULL, '2022-08-10 13:58:21', '1', 'admin', '127.0.0.1', '2022-08-10 13:58:21', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for base_element
-- ----------------------------
DROP TABLE IF EXISTS `base_element`;
CREATE TABLE `base_element` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `block_id` int(11) NOT NULL COMMENT '所属模块ID',
  `code` varchar(255) NOT NULL COMMENT '资源编码',
  `type` varchar(255) DEFAULT NULL COMMENT '资源类型',
  `name` varchar(255) NOT NULL COMMENT '资源名称',
  `uri` varchar(255) DEFAULT NULL COMMENT '资源路径',
  `menu_id` varchar(255) NOT NULL COMMENT '资源关联菜单',
  `parent_id` varchar(255) DEFAULT NULL,
  `path` varchar(2000) DEFAULT NULL COMMENT '资源树状检索路径',
  `method` varchar(10) DEFAULT NULL COMMENT '资源请求类型',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `crt_time` datetime DEFAULT NULL,
  `crt_user` varchar(255) DEFAULT NULL,
  `crt_name` varchar(255) DEFAULT NULL,
  `crt_host` varchar(255) DEFAULT NULL,
  `upd_time` datetime DEFAULT NULL,
  `upd_user` varchar(255) DEFAULT NULL,
  `upd_name` varchar(255) DEFAULT NULL,
  `upd_host` varchar(255) DEFAULT NULL,
  `del_state` enum('0','1') NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  `del_time` datetime DEFAULT NULL COMMENT '删除时间',
  `del_user` varchar(255) DEFAULT NULL COMMENT '删除用户ID',
  `del_name` varchar(255) DEFAULT NULL COMMENT '删除用户',
  `del_host` varchar(255) DEFAULT NULL COMMENT '删除IP',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=153 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-权限资源：页面按钮';

-- ----------------------------
-- Records of base_element
-- ----------------------------
BEGIN;
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (3, 4, 'userManager:btn_add', 'button', '新增', '/admin/user', '1', NULL, NULL, 'POST', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (4, 4, 'userManager:btn_edit', 'button', '编辑', '/admin/user/{*}', '1', NULL, NULL, 'PUT', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (5, 4, 'userManager:btn_del', 'button', '删除', '/admin/user/{*}', '1', NULL, NULL, 'DELETE', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (10, 4, 'menuManager:btn_add', 'button', '新增', '/admin/menu/{*}', '6', NULL, NULL, 'POST', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (11, 4, 'menuManager:btn_edit', 'button', '编辑', '/admin/menu/{*}', '6', '', '', 'PUT', '', '2017-06-24 00:00:00', '', '', '', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (12, 4, 'menuManager:btn_del', 'button', '删除', '/admin/menu/{*}', '6', '', '', 'DELETE', '', '2017-06-24 00:00:00', '', '', '', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (13, 4, 'menuManager:btn_element_add', 'button', '新增元素', '/admin/element', '6', NULL, NULL, 'POST', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (14, 4, 'menuManager:btn_element_edit', 'button', '编辑元素', '/admin/element/{*}', '6', NULL, NULL, 'PUT', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (15, 4, 'menuManager:btn_element_del', 'button', '删除元素', '/admin/element/{*}', '6', NULL, NULL, 'DELETE', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (16, 4, 'groupManager:btn_add', 'button', '新增', '/admin/group', '7', NULL, NULL, 'POST', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (17, 4, 'groupManager:btn_edit', 'button', '编辑', '/admin/group/{*}', '7', NULL, NULL, 'PUT', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (18, 4, 'groupManager:btn_del', 'button', '删除', '/admin/group/{*}', '7', NULL, NULL, 'DELETE', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (20, 4, 'groupManager:btn_resourceManager', 'button', '分配权限', '/admin/group/{*}/authority', '7', NULL, NULL, 'GET', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (21, 4, 'groupManager:menu', 'uri', '分配菜单', '/admin/group/{*}/authority/menu', '7', NULL, NULL, 'POST', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (22, 4, 'groupManager:element', 'uri', '分配资源', '/admin/group/{*}/authority/element', '7', NULL, NULL, 'POST', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (23, 4, 'userManager:view', 'uri', '查看', '/admin/user/{*}', '1', '', '', 'GET', '', '2017-06-26 00:00:00', '', '', '', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (56, 4, 'dictManager:dictType:btn_add', 'button', '新增字典分组', '/admin/dictType/{*}', '36', NULL, NULL, 'PUT', '', '2019-08-15 21:28:46', '1', 'admin', '127.0.0.1', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (57, 4, 'dictManager:dictType:btn_edit', 'button', '编辑字典分组', '/admin/dictType/{*}', '36', NULL, NULL, 'POST', '', '2019-08-15 21:29:00', '1', 'admin', '127.0.0.1', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (58, 4, 'dictManager:dictType:btn_del', 'button', '删除字典分组', '/admin/dictType/{*}', '36', NULL, NULL, 'DELETE', '', '2019-08-15 21:29:12', '1', 'admin', '127.0.0.1', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (59, 4, 'dictManager:btn_add', 'button', '新增字典值', '/admin/dict/{*}', '36', NULL, NULL, 'PUT', '', '2019-08-15 21:29:44', '1', 'admin', '127.0.0.1', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (60, 4, 'dictManager:btn_edit', 'button', '编辑字典值', '/admin/dict/{*}', '36', NULL, NULL, 'POST', '', '2019-08-15 21:29:53', '1', 'admin', '127.0.0.1', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (61, 4, 'dictManager:btn_del', 'button', '删除字典值', '/admin/dict/{*}', '36', NULL, NULL, 'DELETE', '', '2019-08-15 21:30:02', '1', 'admin', '127.0.0.1', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (62, 4, 'groupManager:groupUser:btn_add', 'button', '新增分组员工', '/admin/groupUser/{*}', '7', NULL, NULL, 'PUT', '', '2019-08-17 11:07:30', '1', 'admin', '127.0.0.1', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (63, 4, 'groupManager:groupUser:btn_edit', 'button', '编辑分组员工', '/admin/groupUser/{*}', '7', NULL, NULL, 'POST', '', '2019-08-17 11:07:41', '1', 'admin', '127.0.0.1', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (64, 4, 'groupManager:groupUser:btn_del', 'button', '删除分组员工', '/admin/groupUser/{*}', '7', NULL, NULL, 'DELETE', '', '2019-08-17 11:07:54', '1', 'admin', '127.0.0.1', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (68, 4, 'areaManager:btn_add', 'button', '新增地区', '/admin/area/{*}', '41', NULL, NULL, 'POST', '', '2019-08-21 10:06:29', '1', 'admin', '127.0.0.1', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (69, 4, 'areaManager:btn_edit', 'button', '编辑地区', '/admin/area/{*}', '41', NULL, NULL, 'PUT', '', '2019-08-21 10:06:40', '1', 'admin', '127.0.0.1', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (70, 4, 'areaManager:btn_del', 'button', '删除地区', '/admin/area/{*}', '41', NULL, NULL, 'DELETE', '', '2019-08-21 10:06:55', '1', 'admin', '127.0.0.1', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (71, 4, 'jobManager:btn_add', 'button', '新增定时任务', '/admin/job/{*}', '42', NULL, NULL, 'POST', '', '2019-08-21 15:08:22', '1', 'admin', '127.0.0.1', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (72, 4, 'jobManager:btn_edit', 'button', '编辑定时任务', '/admin/job/{*}', '42', NULL, NULL, 'PUT', '', '2019-08-21 15:08:32', '1', 'admin', '127.0.0.1', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (73, 4, 'jobManager:btn_del', 'button', '删除定时任务', '/admin/job/{*}', '42', NULL, NULL, 'DELETE', '', '2019-08-21 15:08:44', '1', 'admin', '127.0.0.1', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (74, 4, 'jobManager:btn_toggle', 'button', '启动定时任务', '/admin/job/{*}/startJob', '42', NULL, NULL, 'GET', '', '2019-08-21 15:09:07', '1', 'admin', '127.0.0.1', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (75, 4, 'jobManager:btn_toggle', 'button', '停止定时任务', '/admin/job/{*}/endJob', '42', NULL, NULL, 'GET', '', '2019-08-21 15:09:36', '1', 'admin', '127.0.0.1', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_element` (`id`, `block_id`, `code`, `type`, `name`, `uri`, `menu_id`, `parent_id`, `path`, `method`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (88, 4, 'userManager:btn_reset_pwd', 'button', '重置密码', '/admin/user/resetPwd', '1', NULL, NULL, 'POST', '', '2019-10-30 14:30:32', '1', 'admin', '127.0.0.1', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for base_file
-- ----------------------------
DROP TABLE IF EXISTS `base_file`;
CREATE TABLE `base_file` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) DEFAULT NULL COMMENT '文件名',
  `url` varchar(255) DEFAULT NULL COMMENT 'url',
  `size` int(11) DEFAULT NULL COMMENT '附件大小',
  `crt_time` datetime DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_name` varchar(255) DEFAULT NULL,
  `crt_host` varchar(255) DEFAULT NULL,
  `upd_time` datetime DEFAULT NULL,
  `upd_user` varchar(255) DEFAULT NULL,
  `upd_name` varchar(255) DEFAULT NULL,
  `upd_host` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-用户文件表';

-- ----------------------------
-- Records of base_file
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for base_group
-- ----------------------------
DROP TABLE IF EXISTS `base_group`;
CREATE TABLE `base_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `code` varchar(255) DEFAULT NULL COMMENT '角色编码',
  `name` varchar(255) DEFAULT NULL COMMENT '角色名称',
  `parent_id` int(11) NOT NULL COMMENT '上级节点',
  `path` varchar(2000) DEFAULT NULL COMMENT '树状关系',
  `type` char(1) DEFAULT NULL COMMENT '类型',
  `group_type` int(11) NOT NULL COMMENT '角色组类型',
  `sort` int(11) DEFAULT NULL COMMENT '排序ID',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `crt_time` datetime DEFAULT NULL,
  `crt_user` varchar(255) DEFAULT NULL,
  `crt_name` varchar(255) DEFAULT NULL,
  `crt_host` varchar(255) DEFAULT NULL,
  `upd_time` datetime DEFAULT NULL,
  `upd_user` varchar(255) DEFAULT NULL,
  `upd_name` varchar(255) DEFAULT NULL,
  `upd_host` varchar(255) DEFAULT NULL,
  `del_state` enum('0','1') DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  `del_time` datetime DEFAULT NULL COMMENT '删除时间',
  `del_user` varchar(255) DEFAULT NULL COMMENT '删除用户ID',
  `del_name` varchar(255) DEFAULT NULL COMMENT '删除用户',
  `del_host` varchar(255) DEFAULT NULL COMMENT '删除IP',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-角色';

-- ----------------------------
-- Records of base_group
-- ----------------------------
BEGIN;
INSERT INTO `base_group` (`id`, `code`, `name`, `parent_id`, `path`, `type`, `group_type`, `sort`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (1, 'adminRole', '管理员', -1, '/adminRole', NULL, 1, NULL, '超级管理员，不可删除', NULL, NULL, NULL, NULL, '2020-06-27 15:37:23', '1', 'admin', '123.116.43.116', '0', NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for base_group_type
-- ----------------------------
DROP TABLE IF EXISTS `base_group_type`;
CREATE TABLE `base_group_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `code` varchar(255) DEFAULT NULL COMMENT '编码',
  `name` varchar(255) DEFAULT NULL COMMENT '类型名称',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `crt_time` datetime DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建人ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建人',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建主机',
  `upd_time` datetime DEFAULT NULL COMMENT '最后更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '最后更新人ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '最后更新人',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '最后更新主机',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-角色类型';

-- ----------------------------
-- Records of base_group_type
-- ----------------------------
BEGIN;
INSERT INTO `base_group_type` (`id`, `code`, `name`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`) VALUES (1, 'role', '系统角色', 'role', NULL, NULL, NULL, NULL, '2020-03-26 11:27:45', '1', 'admin', '127.0.0.1');
COMMIT;

-- ----------------------------
-- Table structure for base_group_user
-- ----------------------------
DROP TABLE IF EXISTS `base_group_user`;
CREATE TABLE `base_group_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `group_id` int(11) DEFAULT NULL COMMENT '分组ID',
  `user_id` varchar(50) DEFAULT NULL COMMENT '用户ID',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `type` varchar(50) DEFAULT NULL COMMENT '分类',
  `crt_time` datetime DEFAULT NULL,
  `crt_user` varchar(255) DEFAULT NULL,
  `crt_name` varchar(255) DEFAULT NULL,
  `crt_host` varchar(255) DEFAULT NULL,
  `upd_time` datetime DEFAULT NULL,
  `upd_user` varchar(255) DEFAULT NULL,
  `upd_name` varchar(255) DEFAULT NULL,
  `upd_host` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_group_id_user_id` (`group_id`,`user_id`) USING BTREE COMMENT '角色ID&用户ID'
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-领导类型角色关联';

-- ----------------------------
-- Records of base_group_user
-- ----------------------------
BEGIN;
INSERT INTO `base_group_user` (`id`, `group_id`, `user_id`, `description`, `type`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`) VALUES (35, 26, '7', NULL, 'leader', '2019-11-04 11:10:06', '1', 'admin', '127.0.0.1', '2019-11-04 11:10:06', '1', 'admin', '127.0.0.1');
INSERT INTO `base_group_user` (`id`, `group_id`, `user_id`, `description`, `type`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`) VALUES (36, 1, '1', NULL, NULL, '2022-08-12 10:49:58', '1', 'admin', '127.0.0.1', '2022-08-12 10:49:58', '1', 'admin', '127.0.0.1');
COMMIT;

-- ----------------------------
-- Table structure for base_job
-- ----------------------------
DROP TABLE IF EXISTS `base_job`;
CREATE TABLE `base_job` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_name` varchar(255) DEFAULT NULL COMMENT '任务名称',
  `cron` varchar(255) DEFAULT NULL COMMENT 'cron表达式',
  `status` char(1) DEFAULT NULL COMMENT '状态:0未启动false/1启动true',
  `clazz_path` varchar(255) DEFAULT NULL COMMENT '任务执行方法',
  `job_desc` varchar(255) DEFAULT NULL COMMENT '任务描述',
  `crt_time` datetime DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户名称',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建用户IP',
  `upd_time` datetime DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户名称',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新用户IP',
  `del_state` enum('0','1') DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  `del_time` datetime DEFAULT NULL COMMENT '删除时间',
  `del_user` varchar(255) DEFAULT NULL COMMENT '删除用户ID',
  `del_name` varchar(255) DEFAULT NULL COMMENT '删除用户',
  `del_host` varchar(255) DEFAULT NULL COMMENT '删除IP',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-系统定时任务';

-- ----------------------------
-- Records of base_job
-- ----------------------------
BEGIN;
INSERT INTO `base_job` (`id`, `job_name`, `cron`, `status`, `clazz_path`, `job_desc`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (1, '测试任务1', '0 */1 * * * ?', '0', 'com.faber.admin.config.quartz.customer.JobDemo1', '测试任务111111', '2019-08-21 15:20:22', '1', 'admin', '127.0.0.1', '2019-08-21 15:45:29', '1', 'admin', '127.0.0.1', '0', '2020-06-02 11:39:47', '1', 'admin', '182.48.107.122');
COMMIT;

-- ----------------------------
-- Table structure for base_menu
-- ----------------------------
DROP TABLE IF EXISTS `base_menu`;
CREATE TABLE `base_menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `block_id` int(11) NOT NULL COMMENT '所属模块ID',
  `code` varchar(255) NOT NULL COMMENT '菜单编码',
  `title` varchar(255) NOT NULL COMMENT '菜单名称',
  `parent_id` int(11) NOT NULL COMMENT '父级节点',
  `href` varchar(255) DEFAULT NULL COMMENT '资源路径',
  `icon` varchar(255) DEFAULT NULL COMMENT '图标',
  `type` char(10) DEFAULT NULL COMMENT '类型：menu、dirt',
  `order_num` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `path` varchar(500) DEFAULT NULL COMMENT '菜单上下级关系',
  `enabled` char(1) DEFAULT NULL COMMENT '启用禁用',
  `crt_time` datetime DEFAULT NULL,
  `crt_user` varchar(255) DEFAULT NULL,
  `crt_name` varchar(255) DEFAULT NULL,
  `crt_host` varchar(255) DEFAULT NULL,
  `upd_time` datetime DEFAULT NULL,
  `upd_user` varchar(255) DEFAULT NULL,
  `upd_name` varchar(255) DEFAULT NULL,
  `upd_host` varchar(255) DEFAULT NULL,
  `del_state` enum('0','1') NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  `del_time` datetime DEFAULT NULL COMMENT '删除时间',
  `del_user` varchar(255) DEFAULT NULL COMMENT '删除用户ID',
  `del_name` varchar(255) DEFAULT NULL COMMENT '删除用户',
  `del_host` varchar(255) DEFAULT NULL COMMENT '删除IP',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-权限菜单：侧栏菜单';

-- ----------------------------
-- Records of base_menu
-- ----------------------------
BEGIN;
INSERT INTO `base_menu` (`id`, `block_id`, `code`, `title`, `parent_id`, `href`, `icon`, `type`, `order_num`, `description`, `path`, `enabled`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (1, 4, 'system:base:user', '用户管理', 70, '/admin/user', 'fa-user', 'menu', 0, '描述111', '/adminSys/baseManager/userManager', NULL, NULL, NULL, NULL, NULL, '2020-03-26 10:57:54', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_menu` (`id`, `block_id`, `code`, `title`, `parent_id`, `href`, `icon`, `type`, `order_num`, `description`, `path`, `enabled`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (5, 4, 'system', '系统管理', 85, '/admin', 'setting', 'menu', 0, '', '/adminSys/baseManager', NULL, NULL, NULL, NULL, NULL, '2020-08-09 21:46:20', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_menu` (`id`, `block_id`, `code`, `title`, `parent_id`, `href`, `icon`, `type`, `order_num`, `description`, `path`, `enabled`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (6, 4, 'system:base:menuManager', '菜单管理', 5, '/admin/menu', 'category', 'menu', 0, '', '/adminSys/baseManager/menuManager', NULL, NULL, NULL, NULL, NULL, '2020-07-13 10:57:52', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_menu` (`id`, `block_id`, `code`, `title`, `parent_id`, `href`, `icon`, `type`, `order_num`, `description`, `path`, `enabled`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (7, 4, 'system:base:groupAuthManage', '角色权限管理', 70, '/admin/group', 'group_fill', 'menu', 0, '', '/adminSys/baseManager/groupManager', NULL, NULL, NULL, NULL, NULL, '2020-03-26 10:57:58', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_menu` (`id`, `block_id`, `code`, `title`, `parent_id`, `href`, `icon`, `type`, `order_num`, `description`, `path`, `enabled`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (36, 4, 'system:base:dict', '字典管理', 5, '/system/base/dict', 'fa-user', 'menu', 3, NULL, '/adminSys/baseManager/dict', NULL, '2019-07-03 22:47:37', '1', 'admin', '192.168.199.122', '2020-07-13 10:57:52', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_menu` (`id`, `block_id`, `code`, `title`, `parent_id`, `href`, `icon`, `type`, `order_num`, `description`, `path`, `enabled`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (41, 4, 'system:base:area', '中国地区', 5, '/admin/area', 'fa-area', 'menu', 1, NULL, '/adminSys/baseManager/system:base:area', NULL, '2019-08-21 10:05:41', '1', 'admin', '127.0.0.1', '2020-07-13 10:57:52', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_menu` (`id`, `block_id`, `code`, `title`, `parent_id`, `href`, `icon`, `type`, `order_num`, `description`, `path`, `enabled`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (42, 4, 'system:base:job', '定时任务', 5, '/admin/job', 'fa-task', 'menu', 5, NULL, '/adminSys/baseManager/system:base:job', NULL, '2019-08-21 15:07:52', '1', 'admin', '127.0.0.1', '2020-07-13 10:57:52', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_menu` (`id`, `block_id`, `code`, `title`, `parent_id`, `href`, `icon`, `type`, `order_num`, `description`, `path`, `enabled`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (70, 4, 'human_manage', '智能人事', 84, '/human_manage', 'fa', 'menu', 0, NULL, '/human_manage', NULL, '2020-03-26 10:53:06', '1', 'admin', '127.0.0.1', '2020-06-25 15:54:51', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_menu` (`id`, `block_id`, `code`, `title`, `parent_id`, `href`, `icon`, `type`, `order_num`, `description`, `path`, `enabled`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (84, 4, 'top-human-manage', '智能人事', -1, NULL, NULL, 'dirt', 1, '顶部菜单-智能人事', '/top-human-manage', NULL, '2020-06-25 15:54:47', '1', 'admin', '127.0.0.1', '2020-09-13 15:02:12', '1', 'admin', '180.110.162.173', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_menu` (`id`, `block_id`, `code`, `title`, `parent_id`, `href`, `icon`, `type`, `order_num`, `description`, `path`, `enabled`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (85, 4, 'top-system-setting', '系统配置', -1, NULL, NULL, 'dirt', 2, '顶部菜单-系统配置', '/top-system-setting', NULL, '2020-06-25 15:55:15', '1', 'admin', '127.0.0.1', '2020-09-13 15:02:12', '1', 'admin', '180.110.162.173', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_menu` (`id`, `block_id`, `code`, `title`, `parent_id`, `href`, `icon`, `type`, `order_num`, `description`, `path`, `enabled`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (98, 5, 'top-home-manage', '首页', -1, NULL, NULL, 'menu', 0, NULL, '/top-kg-manage', NULL, '2020-09-21 15:47:05', '1', 'admin', '127.0.0.1', '2022-08-17 15:19:29', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_menu` (`id`, `block_id`, `code`, `title`, `parent_id`, `href`, `icon`, `type`, `order_num`, `description`, `path`, `enabled`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (99, 5, 'home', '首页', 98, NULL, NULL, 'menu', 0, NULL, '/top-kg-manage/kg:datasource', NULL, '2020-09-21 15:47:19', '1', 'admin', '127.0.0.1', '2022-08-17 15:20:25', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_menu` (`id`, `block_id`, `code`, `title`, `parent_id`, `href`, `icon`, `type`, `order_num`, `description`, `path`, `enabled`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (100, 5, 'home.dashboard', '工作台', 99, NULL, NULL, 'menu', 0, NULL, '/top-kg-manage/kg:datasource/kg:datasource:structured', NULL, '2020-09-21 15:47:30', '1', 'admin', '127.0.0.1', '2022-08-17 15:20:37', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_menu` (`id`, `block_id`, `code`, `title`, `parent_id`, `href`, `icon`, `type`, `order_num`, `description`, `path`, `enabled`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (119, 4, 'top-myCenter', '个人中心', -1, NULL, NULL, 'menu', 3, NULL, NULL, NULL, '2022-08-12 10:59:35', '1', 'admin', '127.0.0.1', '2022-08-12 10:59:35', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_menu` (`id`, `block_id`, `code`, `title`, `parent_id`, `href`, `icon`, `type`, `order_num`, `description`, `path`, `enabled`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (120, 4, 'account', '个人中心', 119, NULL, NULL, 'menu', 0, NULL, NULL, NULL, '2022-08-12 11:00:12', '1', 'admin', '127.0.0.1', '2022-08-12 11:00:12', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_menu` (`id`, `block_id`, `code`, `title`, `parent_id`, `href`, `icon`, `type`, `order_num`, `description`, `path`, `enabled`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (121, 4, 'myCenter:base', '基本信息', 120, NULL, NULL, 'menu', 0, NULL, NULL, NULL, '2022-08-12 11:00:26', '1', 'admin', '127.0.0.1', '2022-08-12 11:01:14', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_menu` (`id`, `block_id`, `code`, `title`, `parent_id`, `href`, `icon`, `type`, `order_num`, `description`, `path`, `enabled`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (122, 4, 'myCenter:security', '更新密码', 120, NULL, NULL, 'menu', 1, NULL, NULL, NULL, '2022-08-12 11:00:38', '1', 'admin', '127.0.0.1', '2022-08-12 11:01:07', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_menu` (`id`, `block_id`, `code`, `title`, `parent_id`, `href`, `icon`, `type`, `order_num`, `description`, `path`, `enabled`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (123, 4, 'myCenter:msg', '消息中心', 120, NULL, NULL, 'menu', 2, NULL, NULL, NULL, '2022-08-12 11:00:57', '1', 'admin', '127.0.0.1', '2022-08-12 11:00:57', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for base_menu_block
-- ----------------------------
DROP TABLE IF EXISTS `base_menu_block`;
CREATE TABLE `base_menu_block` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(255) DEFAULT NULL COMMENT '模块名称',
  `no` varchar(255) DEFAULT NULL COMMENT '模块编码',
  `sort` int(11) DEFAULT NULL COMMENT '排序',
  `crt_time` datetime DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` datetime DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` enum('0','1') DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  `del_time` datetime DEFAULT NULL COMMENT '删除时间',
  `del_user` varchar(255) DEFAULT NULL COMMENT '删除用户ID',
  `del_name` varchar(255) DEFAULT NULL COMMENT '删除用户',
  `del_host` varchar(255) DEFAULT NULL COMMENT '删除IP',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-菜单模块';

-- ----------------------------
-- Records of base_menu_block
-- ----------------------------
BEGIN;
INSERT INTO `base_menu_block` (`id`, `name`, `no`, `sort`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (4, '系统管理', 'system', 20, '2021-11-20 16:37:41', '1', 'admin', '127.0.0.1', '2021-11-20 17:24:50', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
INSERT INTO `base_menu_block` (`id`, `name`, `no`, `sort`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES (5, '首页', 'home', 10, '2021-11-20 16:39:15', '1', 'admin', '127.0.0.1', '2022-08-17 15:18:19', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for base_msg
-- ----------------------------
DROP TABLE IF EXISTS `base_msg`;
CREATE TABLE `base_msg` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `from_user_id` varchar(50) DEFAULT NULL COMMENT '消息来源用户ID',
  `to_user_id` varchar(50) DEFAULT NULL COMMENT '接收用户ID',
  `content` longtext COMMENT '消息内容',
  `is_read` enum('0','1') DEFAULT '0' COMMENT '是否已读',
  `read_time` datetime DEFAULT NULL COMMENT '已读时间',
  `buzz_type` int(11) DEFAULT NULL COMMENT '业务类型',
  `buzz_id` varchar(255) DEFAULT NULL COMMENT '业务ID',
  `crt_time` datetime NOT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` datetime DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` enum('0','1') NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  `del_time` datetime DEFAULT NULL COMMENT '删除时间',
  `del_user` varchar(255) DEFAULT NULL COMMENT '删除用户ID',
  `del_name` varchar(255) DEFAULT NULL COMMENT '删除用户',
  `del_host` varchar(255) DEFAULT NULL COMMENT '删除IP',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-消息';

-- ----------------------------
-- Records of base_msg
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for base_notice
-- ----------------------------
DROP TABLE IF EXISTS `base_notice`;
CREATE TABLE `base_notice` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `title` varchar(50) DEFAULT NULL COMMENT '标题',
  `content` varchar(255) DEFAULT NULL COMMENT '内容',
  `status` enum('1','0') DEFAULT '1' COMMENT '状态：1-有效、2-失效',
  `strong_notice` enum('1','0') DEFAULT '0' COMMENT '是否强提醒',
  `crt_time` datetime DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` datetime DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` enum('0','1') DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  `del_time` datetime DEFAULT NULL COMMENT '删除时间',
  `del_user` varchar(255) DEFAULT NULL COMMENT '删除用户ID',
  `del_name` varchar(255) DEFAULT NULL COMMENT '删除用户',
  `del_host` varchar(255) DEFAULT NULL COMMENT '删除IP',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-通知与公告';

-- ----------------------------
-- Records of base_notice
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for base_resource_authority
-- ----------------------------
DROP TABLE IF EXISTS `base_resource_authority`;
CREATE TABLE `base_resource_authority` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `authority_id` varchar(255) DEFAULT NULL COMMENT '角色ID',
  `authority_type` varchar(255) DEFAULT NULL COMMENT '角色类型',
  `resource_id` varchar(255) DEFAULT NULL COMMENT '资源ID',
  `resource_type` varchar(255) DEFAULT NULL COMMENT '资源类型',
  `parent_id` varchar(255) DEFAULT NULL COMMENT '父节点ID',
  `path` varchar(2000) DEFAULT NULL COMMENT '路径',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `crt_time` datetime DEFAULT NULL,
  `crt_user` varchar(255) DEFAULT NULL,
  `crt_name` varchar(255) DEFAULT NULL,
  `crt_host` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2798 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-角色权限关联';

-- ----------------------------
-- Records of base_resource_authority
-- ----------------------------
BEGIN;
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (287, '1', 'group', '5', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (289, '1', 'group', '10', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (290, '1', 'group', '11', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (291, '1', 'group', '12', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (294, '1', 'group', '5', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (296, '1', 'group', '10', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (297, '1', 'group', '11', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (298, '1', 'group', '12', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (300, '1', 'group', '12', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (301, '1', 'group', '10', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (302, '1', 'group', '11', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (303, '1', 'group', '13', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (304, '1', 'group', '14', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (305, '1', 'group', '15', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (306, '1', 'group', '10', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (307, '1', 'group', '11', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (308, '1', 'group', '12', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (309, '1', 'group', '13', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (310, '1', 'group', '14', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (312, '1', 'group', '15', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (313, '1', 'group', '16', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (314, '1', 'group', '17', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (315, '1', 'group', '18', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (317, '1', 'group', '20', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (318, '1', 'group', '21', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (319, '1', 'group', '22', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (371, '1', 'group', '23', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (375, '1', 'group', '23', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (378, '1', 'group', '5', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (380, '1', 'group', '11', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (381, '1', 'group', '14', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (382, '1', 'group', '13', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (383, '1', 'group', '15', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (384, '1', 'group', '12', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (386, '1', 'group', '10', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (388, '1', 'group', '16', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (389, '1', 'group', '18', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (390, '1', 'group', '17', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (392, '1', 'group', '20', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (394, '1', 'group', '22', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (395, '1', 'group', '21', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (775, '1', 'group', '4', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (981, '9', 'group', '23', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (982, '9', 'group', '1', 'menu', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (985, '9', 'group', '5', 'menu', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (986, '1', 'group', '3', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (991, '-1', 'group', '3', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (992, '-1', 'group', '4', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (993, '-1', 'group', '5', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (994, '-1', 'group', '23', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (995, '-1', 'group', '1', 'menu', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (998, '-1', 'group', '5', 'menu', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1003, '23', 'group', '23', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1008, '23', 'group', '5', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1009, '23', 'group', '4', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1086, '23', 'group', '3', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1087, '23', 'group', '23', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1088, '23', 'group', '5', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1089, '23', 'group', '4', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1090, '23', 'group', '3', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1101, '3', 'group', '1', 'menu', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1104, '3', 'group', '5', 'menu', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1121, '10', 'group', '23', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1122, '10', 'group', '1', 'menu', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1125, '10', 'group', '5', 'menu', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1126, '10', 'group', '6', 'menu', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1135, '23', 'group', '15', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1136, '23', 'group', '13', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1137, '23', 'group', '12', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1138, '23', 'group', '11', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1139, '23', 'group', '10', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1140, '23', 'group', '1', 'menu', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1143, '23', 'group', '5', 'menu', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1144, '23', 'group', '6', 'menu', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1220, '1', 'group', '60', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1221, '1', 'group', '61', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1222, '1', 'group', '58', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1223, '1', 'group', '57', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1224, '1', 'group', '59', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1225, '1', 'group', '56', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1239, '1', 'group', '63', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1240, '1', 'group', '62', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1253, '1', 'group', '64', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1295, '1', 'group', '70', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1296, '1', 'group', '68', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1297, '1', 'group', '69', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1312, '1', 'group', '75', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1313, '1', 'group', '74', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1314, '1', 'group', '73', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1315, '1', 'group', '72', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1316, '1', 'group', '71', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (1634, '1', 'group', '88', 'button', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (2696, '1', 'group', '70', 'menu', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (2703, '1', 'group', '36', 'menu', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (2708, '1', 'group', '1', 'menu', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (2709, '1', 'group', '5', 'menu', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (2710, '1', 'group', '6', 'menu', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (2711, '1', 'group', '7', 'menu', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (2717, '1', 'group', '41', 'menu', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (2719, '1', 'group', '42', 'menu', '-1', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (2727, '1', 'group', '84', 'menu', '-1', NULL, NULL, '2020-06-26 16:07:18', '1', 'admin', '123.116.43.116');
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (2728, '1', 'group', '85', 'menu', '-1', NULL, NULL, '2020-06-26 16:07:18', '1', 'admin', '123.116.43.116');
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (2756, '1', 'group', '98', 'menu', '-1', NULL, NULL, '2020-09-21 15:49:09', '1', 'admin', '127.0.0.1');
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (2757, '1', 'group', '99', 'menu', '-1', NULL, NULL, '2020-09-21 15:49:09', '1', 'admin', '127.0.0.1');
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (2792, '1', 'group', '119', 'menu', '-1', NULL, NULL, '2022-08-12 11:01:26', '1', 'admin', '127.0.0.1');
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (2793, '1', 'group', '120', 'menu', '-1', NULL, NULL, '2022-08-12 11:01:26', '1', 'admin', '127.0.0.1');
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (2794, '1', 'group', '121', 'menu', '-1', NULL, NULL, '2022-08-12 11:01:26', '1', 'admin', '127.0.0.1');
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (2795, '1', 'group', '122', 'menu', '-1', NULL, NULL, '2022-08-12 11:01:26', '1', 'admin', '127.0.0.1');
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (2796, '1', 'group', '123', 'menu', '-1', NULL, NULL, '2022-08-12 11:01:26', '1', 'admin', '127.0.0.1');
INSERT INTO `base_resource_authority` (`id`, `authority_id`, `authority_type`, `resource_id`, `resource_type`, `parent_id`, `path`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`) VALUES (2797, '1', 'group', '100', 'menu', '-1', NULL, NULL, '2022-08-17 15:21:22', '1', 'admin', '127.0.0.1');
COMMIT;

-- ----------------------------
-- Table structure for base_sms_code
-- ----------------------------
DROP TABLE IF EXISTS `base_sms_code`;
CREATE TABLE `base_sms_code` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `phone` varchar(15) NOT NULL COMMENT '手机号',
  `code` varchar(6) NOT NULL COMMENT '短信验证码',
  `crt_time` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Demo-学生表';

-- ----------------------------
-- Records of base_sms_code
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for base_user
-- ----------------------------
DROP TABLE IF EXISTS `base_user`;
CREATE TABLE `base_user` (
  `id` varchar(50) NOT NULL COMMENT 'ID',
  `department_id` varchar(50) DEFAULT NULL COMMENT '部门ID',
  `username` varchar(255) DEFAULT NULL COMMENT '账户',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `name` varchar(255) DEFAULT NULL COMMENT '姓名',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `address` varchar(255) DEFAULT NULL COMMENT '地址',
  `mobile_phone` varchar(255) DEFAULT NULL COMMENT '手机号',
  `tel_phone` varchar(255) DEFAULT NULL COMMENT '废弃',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱',
  `sex` char(1) DEFAULT NULL COMMENT '性别',
  `type` char(1) DEFAULT NULL COMMENT '类型',
  `status` char(1) DEFAULT NULL COMMENT '状态：1-有效/2-锁定',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `img` varchar(255) DEFAULT NULL COMMENT '头像URL',
  `api_token` varchar(255) DEFAULT NULL COMMENT 'api token',
  `crt_time` datetime DEFAULT NULL,
  `crt_user` varchar(255) DEFAULT NULL,
  `crt_name` varchar(255) DEFAULT NULL,
  `crt_host` varchar(255) DEFAULT NULL,
  `upd_time` datetime DEFAULT NULL,
  `upd_user` varchar(255) DEFAULT NULL,
  `upd_name` varchar(255) DEFAULT NULL,
  `upd_host` varchar(255) DEFAULT NULL,
  `del_state` enum('0','1') DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  `del_time` datetime DEFAULT NULL,
  `del_user` varchar(255) DEFAULT NULL,
  `del_name` varchar(255) DEFAULT NULL,
  `del_host` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-用户';

-- ----------------------------
-- Records of base_user
-- ----------------------------
BEGIN;
INSERT INTO `base_user` (`id`, `department_id`, `username`, `password`, `name`, `birthday`, `address`, `mobile_phone`, `tel_phone`, `email`, `sex`, `type`, `status`, `description`, `img`, `api_token`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`, `del_time`, `del_user`, `del_name`, `del_host`) VALUES ('1', '1', 'admin', '$2a$12$l2aZhURchpyLFvxMLG7L9O6tZw3vHkklJtC5eoi.XJEnB3yERRgFy', '超级管理员1', NULL, '南京市、江宁区、将军大道', '13811112222', NULL, 'faber@gmail.com', '1', NULL, '1', '', 'http://ztfp-test-file.dward.cn/static/upload/user/img/9362eee0-fd56-11e9-8980-39c97916451b/头像.jpg', 'd1d6e6d1ebcb4437bd082c3046671582', NULL, NULL, NULL, NULL, '2022-08-12 10:49:58', '1', 'admin', '127.0.0.1', '0', NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for demo_student
-- ----------------------------
DROP TABLE IF EXISTS `demo_student`;
CREATE TABLE `demo_student` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(255) DEFAULT NULL COMMENT '学生名',
  `age` int(3) DEFAULT NULL COMMENT '年龄',
  `sex` varchar(255) DEFAULT NULL COMMENT '性别',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `crt_time` datetime DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` datetime DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` enum('0','1') NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  `del_time` datetime DEFAULT NULL COMMENT '删除时间',
  `del_user` varchar(255) DEFAULT NULL COMMENT '删除用户ID',
  `del_name` varchar(255) DEFAULT NULL COMMENT '删除用户',
  `del_host` varchar(255) DEFAULT NULL COMMENT '删除IP',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='Demo-学生表';

-- ----------------------------
-- Records of demo_student
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for disk_dir
-- ----------------------------
DROP TABLE IF EXISTS `disk_dir`;
CREATE TABLE `disk_dir` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(255) DEFAULT NULL COMMENT '文件夹名称',
  `parent_id` int(11) NOT NULL COMMENT '父级节点',
  `crt_time` datetime DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` datetime DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` enum('0','1') DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  `del_time` datetime DEFAULT NULL COMMENT '删除时间',
  `del_user` varchar(255) DEFAULT NULL COMMENT '删除用户ID',
  `del_name` varchar(255) DEFAULT NULL COMMENT '删除用户',
  `del_host` varchar(255) DEFAULT NULL COMMENT '删除IP',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COMMENT='云盘/文件夹';

-- ----------------------------
-- Records of disk_dir
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for disk_file
-- ----------------------------
DROP TABLE IF EXISTS `disk_file`;
CREATE TABLE `disk_file` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `dir_id` int(11) NOT NULL COMMENT '文件夹ID',
  `name` varchar(255) DEFAULT NULL COMMENT '文件名称',
  `type` varchar(255) DEFAULT NULL COMMENT '文件类型',
  `url` varchar(255) DEFAULT NULL COMMENT '文件URL',
  `size` int(11) DEFAULT NULL COMMENT '文件大小(B)',
  `crt_time` datetime DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` datetime DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` enum('0','1') DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  `del_time` datetime DEFAULT NULL COMMENT '删除时间',
  `del_user` varchar(255) DEFAULT NULL COMMENT '删除用户ID',
  `del_name` varchar(255) DEFAULT NULL COMMENT '删除用户',
  `del_host` varchar(255) DEFAULT NULL COMMENT '删除IP',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COMMENT='云盘/文件';

-- ----------------------------
-- Records of disk_file
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for gate_log
-- ----------------------------
DROP TABLE IF EXISTS `gate_log`;
CREATE TABLE `gate_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '序号',
  `menu` varchar(255) DEFAULT NULL COMMENT '菜单',
  `opt` varchar(255) DEFAULT NULL COMMENT '操作',
  `uri` varchar(255) DEFAULT NULL COMMENT '资源路径',
  `crt_time` datetime DEFAULT NULL COMMENT '操作时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '操作人ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '操作人',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '操作主机',
  `original_url` varchar(1000) DEFAULT NULL COMMENT '访问完整url',
  `body` text COMMENT '请求内容',
  `response` text COMMENT '返回内容',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2774 DEFAULT CHARSET=utf8mb4 COMMENT='LOG-操作日志';

-- ----------------------------
-- Records of gate_log
-- ----------------------------
BEGIN;
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
