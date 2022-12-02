/*
 Navicat Premium Data Transfer

 Source Server         : localhost-dev-root
 Source Server Type    : MySQL
 Source Server Version : 50736
 Source Host           : localhost:3306
 Source Schema         : faber-admin-20221202

 Target Server Type    : MySQL
 Target Server Version : 50736
 File Encoding         : 65001

 Date: 02/12/2022 09:29:48
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
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除',
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
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除',
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
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=362 DEFAULT CHARSET=utf8mb4 COMMENT='文章-大纲';

-- ----------------------------
-- Records of article_outline
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
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除',
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
  `buzz_modal` varchar(255) NOT NULL COMMENT '业务模块',
  `type` tinyint(4) NOT NULL COMMENT '配置类型：1表格展示字段/2高级查询条件',
  `name` varchar(255) NOT NULL COMMENT '配置名称',
  `data` json NOT NULL COMMENT '配置JSON',
  `system` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否系统',
  `default_scene` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否默认',
  `hide` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否隐藏',
  `sort` int(11) NOT NULL COMMENT '排序ID',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-系统-配置表';

-- ----------------------------
-- Records of base_config
-- ----------------------------
BEGIN;
INSERT INTO `base_config` (`id`, `buzz_modal`, `type`, `name`, `data`, `system`, `default_scene`, `hide`, `sort`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (12, 'demo_student', 1, '表格字段展示配置', '{\"columns\": [{\"sort\": 0, \"width\": 70, \"dataIndex\": \"id\", \"tcChecked\": true, \"tcRequired\": false}, {\"sort\": 1, \"width\": 120, \"dataIndex\": \"name\", \"tcChecked\": true}, {\"sort\": 2, \"width\": 100, \"dataIndex\": \"age\", \"tcChecked\": true}, {\"sort\": 3, \"width\": 100, \"dataIndex\": \"sex\", \"tcChecked\": true}, {\"sort\": 4, \"width\": 200, \"dataIndex\": \"email\", \"tcChecked\": true}, {\"sort\": 5, \"width\": 120, \"dataIndex\": \"birthday\", \"tcChecked\": true}, {\"sort\": 6, \"dataIndex\": \"valid\", \"tcChecked\": true}, {\"sort\": 7, \"width\": 170, \"dataIndex\": \"crtTime\", \"tcChecked\": true}, {\"sort\": 8, \"width\": 120, \"dataIndex\": \"crtUser\"}, {\"sort\": 9, \"width\": 100, \"dataIndex\": \"crtName\", \"tcChecked\": false}, {\"sort\": 10, \"width\": 150, \"dataIndex\": \"crtHost\"}, {\"sort\": 11, \"width\": 170, \"dataIndex\": \"updTime\"}, {\"sort\": 12, \"width\": 120, \"dataIndex\": \"updUser\"}, {\"sort\": 13, \"width\": 100, \"dataIndex\": \"updName\"}, {\"sort\": 14, \"width\": 100, \"dataIndex\": \"updHost\"}, {\"sort\": 15, \"width\": 120, \"dataIndex\": \"opr\", \"tcRequired\": true}]}', 0, 0, 0, 0, '2022-12-01 10:52:46', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_config` (`id`, `buzz_modal`, `type`, `name`, `data`, `system`, `default_scene`, `hide`, `sort`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (13, 'demo_student', 2, '女生', '[{\"id\": \"3a590fb0-7124-11ed-84fa-03f76db8c03d\", \"type\": \"and\", \"condList\": [{\"id\": \"3a590fb1-7124-11ed-84fa-03f76db8c03d\", \"key\": \"sex\", \"opr\": \"eq\", \"name\": \"女\", \"title\": \"性别\", \"value\": \"0\"}]}]', 0, 0, 0, 0, '2022-12-01 11:00:06', '1', '超级管理员', '127.0.0.1', '2022-12-01 11:01:04', '1', '超级管理员', '127.0.0.1', 0);
INSERT INTO `base_config` (`id`, `buzz_modal`, `type`, `name`, `data`, `system`, `default_scene`, `hide`, `sort`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (14, 'demo_student', 2, '女生', '[{\"id\": \"3a590fb0-7124-11ed-84fa-03f76db8c03d\", \"type\": \"and\", \"condList\": [{\"id\": \"3a590fb1-7124-11ed-84fa-03f76db8c03d\", \"key\": \"sex\", \"opr\": \"eq\", \"name\": \"女\", \"title\": \"性别\", \"value\": \"0\"}, {\"id\": \"577992e0-7124-11ed-84fa-03f76db8c03d\", \"key\": \"id\", \"opr\": \"eq\", \"title\": \"ID\", \"value\": \"14\"}]}]', 0, 0, 0, 0, '2022-12-01 11:01:02', '1', '超级管理员', '127.0.0.1', '2022-12-01 11:01:02', '1', '超级管理员', '127.0.0.1', 1);
COMMIT;

-- ----------------------------
-- Table structure for base_department
-- ----------------------------
DROP TABLE IF EXISTS `base_department`;
CREATE TABLE `base_department` (
  `id` varchar(50) NOT NULL COMMENT 'ID',
  `name` varchar(255) NOT NULL COMMENT '部门名称',
  `description` varchar(255) DEFAULT NULL COMMENT '备注',
  `parent_id` varchar(50) NOT NULL COMMENT '父部门ID',
  `sort` int(11) DEFAULT '1' COMMENT '排序',
  `type` varchar(255) DEFAULT NULL COMMENT '类型',
  `manager_id` varchar(50) DEFAULT NULL COMMENT '负责人ID',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-部门';

-- ----------------------------
-- Records of base_department
-- ----------------------------
BEGIN;
INSERT INTO `base_department` (`id`, `name`, `description`, `parent_id`, `sort`, `type`, `manager_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES ('1', '办公室', '', '0', 1, NULL, '1', '2020-06-26 16:07:35', '1', 'admin', '123.116.43.116', '2020-06-26 16:07:35', '1', 'admin', '123.116.43.116', 0);
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
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(255) NOT NULL COMMENT '创建人ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建人',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建主机',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '最后更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '最后更新人ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '最后更新人',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '最后更新主机',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=161 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-字典值';

-- ----------------------------
-- Records of base_dict
-- ----------------------------
BEGIN;
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (9, 6, 0, '男', '1', 1, '', NULL, '2019-08-15 21:57:40', '1', 'admin', '127.0.0.1', '2019-10-30 16:41:57', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (10, 6, 0, '女', '0', 0, '', NULL, '2019-08-15 21:57:49', '1', 'admin', '127.0.0.1', '2019-10-30 16:42:01', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (11, 7, 0, '小学', '1', 1, '', NULL, '2019-08-15 21:59:01', '1', 'admin', '127.0.0.1', '2019-08-15 21:59:01', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (12, 7, 0, '中学', '2', 2, '', NULL, '2019-08-15 21:59:22', '1', 'admin', '127.0.0.1', '2019-08-15 21:59:22', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (13, 7, 0, '高中', '3', 3, '', NULL, '2019-08-15 21:59:30', '1', 'admin', '127.0.0.1', '2019-08-15 21:59:30', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (14, 7, 0, '大学', '4', 4, '', NULL, '2019-08-15 21:59:36', '1', 'admin', '127.0.0.1', '2019-08-15 21:59:36', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (15, 7, 0, '研究生', '5', 5, '', NULL, '2019-08-15 21:59:49', '1', 'admin', '127.0.0.1', '2019-08-15 21:59:49', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (16, 7, 0, '博士', '6', 6, '', NULL, '2019-08-15 21:59:56', '1', 'admin', '127.0.0.1', '2019-08-15 21:59:56', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (18, 8, 0, '群众', '1', 1, '', NULL, '2019-08-15 22:02:03', '1', 'admin', '127.0.0.1', '2019-08-15 22:02:03', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (19, 8, 0, '团员', '2', 2, '', NULL, '2019-08-15 22:02:16', '1', 'admin', '127.0.0.1', '2019-08-15 22:02:16', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20, 8, 0, '党员', '3', 3, '', NULL, '2019-08-15 22:02:22', '1', 'admin', '127.0.0.1', '2019-08-15 22:02:22', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (21, 9, 0, '领导', 'leader', 1, '', NULL, '2019-08-17 09:44:10', '1', 'admin', '127.0.0.1', '2019-08-17 09:44:10', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (22, 9, 0, '员工', 'member', 2, '', NULL, '2019-08-17 09:44:19', '1', 'admin', '127.0.0.1', '2019-08-17 09:44:19', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (23, 11, 0, '省', '0', 1, '省/直辖市，省/特区', NULL, '2019-08-21 10:14:07', '1', 'admin', '127.0.0.1', '2019-08-21 10:14:07', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (24, 11, 0, '市', '1', 2, '市/州，港澳辖区', NULL, '2019-08-21 10:14:43', '1', 'admin', '127.0.0.1', '2019-08-21 10:14:43', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (25, 11, 0, '县', '2', 3, '县/区，台湾市/县', NULL, '2019-08-21 10:15:14', '1', 'admin', '127.0.0.1', '2019-08-21 10:15:14', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (26, 11, 0, '乡', '3', 4, '乡/镇，台湾区/镇', NULL, '2019-08-21 10:15:43', '1', 'admin', '127.0.0.1', '2019-08-21 10:15:43', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (27, 11, 0, '村', '4', 5, '村/社区，台湾街道/村', NULL, '2019-08-21 10:16:08', '1', 'admin', '127.0.0.1', '2019-08-21 10:16:08', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (29, 13, 0, '有效', '1', 1, '', NULL, '2019-10-30 14:08:45', '1', 'admin', '127.0.0.1', '2019-10-30 14:08:53', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (30, 13, 0, '冻结', '0', 2, '', NULL, '2019-10-30 14:09:01', '1', 'admin', '127.0.0.1', '2019-10-30 14:09:01', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (31, 6, 0, '保密', '2', 2, '', NULL, '2019-10-30 15:44:11', '1', 'admin', '127.0.0.1', '2019-10-30 15:44:11', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (147, 49, 0, '是', '1', 1, NULL, NULL, '2020-11-05 15:21:51', '1', 'admin', '120.243.220.191', '2020-11-05 15:21:51', '1', 'admin', '120.243.220.191', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (148, 49, 0, '否', '0', 2, NULL, NULL, '2020-11-05 15:22:02', '1', 'admin', '120.243.220.191', '2020-11-05 15:22:02', '1', 'admin', '120.243.220.191', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (155, 54, 0, 'system:title', 'Fa Admin', 1, NULL, NULL, '2022-08-10 13:59:17', '1', 'admin', '127.0.0.1', '2022-08-10 13:59:17', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (156, 54, 1, 'system:logo', '818e4fdeb5a7a1e5cc0b492cc76a077a', 2, NULL, NULL, '2022-08-10 15:30:13', '1', 'admin', '127.0.0.1', '2022-08-10 15:30:13', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (157, 54, 1, 'system:portal:logoWithText', '0fea6b8a396a06a4c90776ded510bafe', 3, NULL, NULL, '2022-08-10 15:30:52', '1', 'admin', '127.0.0.1', '2022-08-10 15:30:52', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (158, 54, 0, 'system:portal:link', 'http://xxx.xxx.com', 4, NULL, NULL, '2022-08-10 15:31:11', '1', 'admin', '127.0.0.1', '2022-08-10 15:31:11', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (159, 54, 0, 'system:phpRedisAdmin', 'https://fa.dward.cn/phpRedisAdmin', 5, 'redis web管理页面', NULL, '2022-11-29 17:30:29', '1', '超级管理员', '127.0.0.1', '2022-11-29 17:35:30', '1', '超级管理员', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (160, 54, 0, 'system:subTitle', '简单、易维护的后台管理系统', 1, '网站副标题', NULL, '2022-12-01 16:06:48', '1', '超级管理员', '127.0.0.1', '2022-12-01 16:53:58', '1', '超级管理员', '221.231.188.211', 0);
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
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建人ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建人',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建主机',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '最后更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '最后更新人ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '最后更新人',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '最后更新主机',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-字典分类';

-- ----------------------------
-- Records of base_dict_type
-- ----------------------------
BEGIN;
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (2, 'common', '常用字典', 0, 1, NULL, '2019-08-15 21:03:17', '1', 'admin', '127.0.0.1', '2019-08-15 22:02:42', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (6, 'common_sex', '性别', 12, 0, NULL, '2019-08-15 21:56:54', '1', 'admin', '127.0.0.1', '2020-06-19 09:50:36', '1', 'admin', '114.242.249.111', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (7, 'common_education', '学历', 12, 2, NULL, '2019-08-15 21:58:47', '1', 'admin', '127.0.0.1', '2020-06-19 09:50:45', '1', 'admin', '114.242.249.111', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (8, 'common_politics', '政治面貌', 12, 3, NULL, '2019-08-15 22:01:51', '1', 'admin', '127.0.0.1', '2020-06-19 09:50:52', '1', 'admin', '114.242.249.111', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (9, 'group_user_type', '分组用户类型', 12, 4, NULL, '2019-08-17 09:43:54', '1', 'admin', '127.0.0.1', '2020-06-19 09:50:59', '1', 'admin', '114.242.249.111', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (10, 'common_area', '地区', 2, 1, NULL, '2019-08-21 10:13:03', '1', 'admin', '127.0.0.1', '2020-11-05 15:21:38', '1', 'admin', '120.243.220.191', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (11, 'common_area_level', '层级', 10, 1, NULL, '2019-08-21 10:13:38', '1', 'admin', '127.0.0.1', '2019-08-21 10:13:38', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (12, 'common_user', '账户字典', 2, 0, NULL, '2019-10-30 14:07:45', '1', 'admin', '127.0.0.1', '2019-10-30 14:07:45', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (13, 'common_user_status', '账户状态', 12, 1, NULL, '2019-10-30 14:08:08', '1', 'admin', '127.0.0.1', '2019-10-30 15:09:06', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20, 'sys_file_download', '系统文件下载', 2, 3, '系统文件下载：包括文件模板、常用文件', '2019-11-20 10:38:01', '1', 'admin', '127.0.0.1', '2021-03-25 11:40:35', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (48, 'base_dict', '基础字典', 2, 2, NULL, '2020-11-05 15:21:23', '1', 'admin', '120.243.220.191', '2020-11-05 15:21:38', '1', 'admin', '120.243.220.191', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (49, 'base_dict_bool', '是否', 48, 0, NULL, '2020-11-05 15:21:36', '1', 'admin', '120.243.220.191', '2021-03-25 11:40:35', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (54, 'system', '系统设置', 0, 100, NULL, '2022-08-10 13:58:21', '1', 'admin', '127.0.0.1', '2022-08-10 13:58:21', '1', 'admin', '127.0.0.1', 0);
COMMIT;

-- ----------------------------
-- Table structure for base_entity_log
-- ----------------------------
DROP TABLE IF EXISTS `base_entity_log`;
CREATE TABLE `base_entity_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `biz_type` varchar(255) NOT NULL COMMENT '业务类型',
  `biz_id` varchar(255) NOT NULL COMMENT '业务ID',
  `action` tinyint(4) NOT NULL COMMENT '动作1新增/2更新/3删除',
  `content` text COMMENT '动作内容',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(255) NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-实体变更日志';

-- ----------------------------
-- Records of base_entity_log
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for base_file_save
-- ----------------------------
DROP TABLE IF EXISTS `base_file_save`;
CREATE TABLE `base_file_save` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL COMMENT '文件名',
  `url` varchar(255) NOT NULL COMMENT 'url',
  `size` int(11) NOT NULL COMMENT '附件大小',
  `drive` tinyint(4) NOT NULL COMMENT '存储类型1本地/2七牛云/3阿里云/4腾讯云',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(255) NOT NULL COMMENT '创建用户',
  `crt_name` varchar(255) DEFAULT NULL,
  `crt_host` varchar(255) DEFAULT NULL,
  `upd_time` timestamp NULL DEFAULT NULL,
  `upd_user` varchar(255) DEFAULT NULL,
  `upd_name` varchar(255) DEFAULT NULL,
  `upd_host` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-用户文件表';

-- ----------------------------
-- Records of base_file_save
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for base_job
-- ----------------------------
DROP TABLE IF EXISTS `base_job`;
CREATE TABLE `base_job` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `job_name` varchar(255) DEFAULT NULL COMMENT '任务名称',
  `cron` varchar(255) DEFAULT NULL COMMENT 'cron表达式',
  `status` tinyint(1) DEFAULT NULL COMMENT '状态:0未启动false/1启动true',
  `clazz_path` varchar(255) DEFAULT NULL COMMENT '任务执行方法',
  `job_desc` varchar(255) DEFAULT NULL COMMENT '任务描述',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(255) NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) NOT NULL COMMENT '创建用户名称',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建用户IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户名称',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新用户IP',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-系统定时任务';

-- ----------------------------
-- Records of base_job
-- ----------------------------
BEGIN;
INSERT INTO `base_job` (`id`, `job_name`, `cron`, `status`, `clazz_path`, `job_desc`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (1, '测试任务1', '0 0/5 * * * ?', 0, 'com.faber.admin.config.quartz.customer.JobDemo1', '测试任务111111', '2022-09-29 15:46:31', '1', 'admin', '127.0.0.1', '2022-09-07 17:22:54', '1', 'admin', '127.0.0.1', 0);
COMMIT;

-- ----------------------------
-- Table structure for base_job_log
-- ----------------------------
DROP TABLE IF EXISTS `base_job_log`;
CREATE TABLE `base_job_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `job_id` int(11) NOT NULL COMMENT '任务ID',
  `begin_time` datetime NOT NULL COMMENT '创建时间',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `status` tinyint(4) NOT NULL COMMENT '执行结果：1-执行中/2-成功/9-失败',
  `duration` int(11) unsigned DEFAULT NULL COMMENT '执行花费时间',
  `err_msg` text COMMENT '错误日志',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='Demo-学生表';

-- ----------------------------
-- Records of base_job_log
-- ----------------------------
BEGIN;
INSERT INTO `base_job_log` (`id`, `job_id`, `begin_time`, `end_time`, `status`, `duration`, `err_msg`) VALUES (1, 1, '2022-11-21 21:40:41', '2022-11-21 21:40:41', 2, 0, NULL);
COMMIT;

-- ----------------------------
-- Table structure for base_log_api
-- ----------------------------
DROP TABLE IF EXISTS `base_log_api`;
CREATE TABLE `base_log_api` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '序号',
  `url` text NOT NULL COMMENT '请求URL',
  `method` varchar(10) NOT NULL COMMENT '请求类型',
  `agent` text COMMENT '访问客户端',
  `os` varchar(255) DEFAULT NULL COMMENT '操作系统',
  `browser` varchar(255) DEFAULT NULL COMMENT '浏览器',
  `version` varchar(255) DEFAULT NULL COMMENT '浏览器版本',
  `mobile` tinyint(1) DEFAULT NULL COMMENT '是否为移动终端',
  `duration` int(11) NOT NULL COMMENT '请求花费时间',
  `pro` varchar(10) DEFAULT NULL COMMENT '省',
  `city` varchar(10) DEFAULT NULL COMMENT '市',
  `addr` varchar(255) DEFAULT NULL COMMENT '地址',
  `request` longtext COMMENT '请求内容',
  `req_size` int(11) DEFAULT NULL COMMENT '请求体大小',
  `response` longtext COMMENT '返回内容',
  `ret_size` int(11) DEFAULT NULL COMMENT '返回内容大小',
  `ret_status` int(11) NOT NULL COMMENT '返回码',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '操作时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '操作人ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '操作人',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '操作主机',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8202 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-URL请求日志';

-- ----------------------------
-- Records of base_log_api
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for base_log_login
-- ----------------------------
DROP TABLE IF EXISTS `base_log_login`;
CREATE TABLE `base_log_login` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '序号',
  `agent` text COMMENT '访问客户端',
  `os` varchar(255) DEFAULT NULL COMMENT '操作系统',
  `browser` varchar(255) DEFAULT NULL COMMENT '浏览器',
  `version` varchar(255) DEFAULT NULL COMMENT '浏览器版本',
  `mobile` tinyint(1) DEFAULT NULL COMMENT '是否为移动终端',
  `pro` varchar(10) DEFAULT NULL COMMENT '省',
  `city` varchar(10) DEFAULT NULL COMMENT '市',
  `addr` varchar(255) DEFAULT NULL COMMENT '地址',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '操作时间',
  `crt_user` varchar(255) NOT NULL COMMENT '操作人ID',
  `crt_name` varchar(255) NOT NULL COMMENT '操作人',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '操作主机',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户名称',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新用户IP',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=257 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-登录日志';

-- ----------------------------
-- Records of base_log_login
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for base_msg
-- ----------------------------
DROP TABLE IF EXISTS `base_msg`;
CREATE TABLE `base_msg` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `from_user_name` varchar(255) NOT NULL COMMENT '来源用户',
  `from_user_id` varchar(50) NOT NULL COMMENT '来源用户ID',
  `to_user_name` varchar(255) NOT NULL COMMENT '接收用户',
  `to_user_id` varchar(50) NOT NULL COMMENT '接收用户ID',
  `content` longtext COMMENT '消息内容',
  `is_read` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否已读',
  `read_time` datetime DEFAULT NULL COMMENT '已读时间',
  `buzz_type` int(11) DEFAULT NULL COMMENT '业务类型',
  `buzz_id` varchar(255) DEFAULT NULL COMMENT '业务ID',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除',
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
  `status` tinyint(1) DEFAULT '1' COMMENT '是否有效',
  `strong_notice` tinyint(1) DEFAULT '0' COMMENT '是否强提醒',
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-通知与公告';

-- ----------------------------
-- Records of base_notice
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for base_rbac_menu
-- ----------------------------
DROP TABLE IF EXISTS `base_rbac_menu`;
CREATE TABLE `base_rbac_menu` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `parent_id` int(11) NOT NULL COMMENT '父级ID',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `sort` int(11) NOT NULL COMMENT '排序',
  `level` tinyint(4) NOT NULL COMMENT '菜单等级：0-模块/1-一级菜单/2-二级菜单/3-三级菜单/9-按钮',
  `icon` varchar(255) DEFAULT NULL COMMENT '图标标识',
  `status` tinyint(1) NOT NULL COMMENT '是否启用0-禁用/1-启用',
  `link_type` tinyint(4) NOT NULL COMMENT '链接类型【1-内部链接(默认)2-外部链接】',
  `link_url` varchar(255) NOT NULL COMMENT '链接地址【pathinfo#method】',
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-权限表';

-- ----------------------------
-- Records of base_rbac_menu
-- ----------------------------
BEGIN;
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (1, 0, '首页', 0, 0, 'fa-solid fa-house', 1, 1, '/admin/home', '2022-09-19 14:35:35', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (2, 1, '首页', 0, 1, 'fa-solid fa-house', 1, 1, '/admin/home/home', '2022-09-19 14:59:33', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (3, 0, '系统管理', 1, 0, 'fa-solid fa-gear', 1, 1, '/admin/system', '2022-09-19 16:56:23', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (4, 3, '智能人事', 0, 1, 'fa-solid fa-users', 1, 1, '/admin/system/hr', '2022-09-19 16:58:28', '1', '超级管理员1', '192.168.1.107', '2022-09-19 20:48:43', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (5, 3, '系统管理', 1, 1, 'fa-solid fa-gears', 1, 1, '/admin/system/base', '2022-09-19 16:58:56', '1', '超级管理员1', '192.168.1.107', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (6, 3, '个人中心', 2, 1, 'fa-solid fa-user', 1, 1, '/admin/system/account', '2022-09-19 16:59:40', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (7, 4, '用户管理', 0, 1, '', 1, 1, '/admin/system/hr/user', '2022-09-19 17:02:08', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:43', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (8, 4, '部门管理', 1, 1, '', 1, 1, '/admin/system/hr/department', '2022-09-19 17:02:30', '1', '超级管理员1', '127.0.0.1', '2022-09-25 09:49:26', '1', '超级管理员1', '192.168.58.1', 1);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (9, 4, '角色权限管理', 2, 1, '', 1, 1, '/admin/system/hr/role', '2022-09-19 17:12:26', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:43', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (10, 5, '菜单管理', 0, 1, NULL, 1, 1, '/admin/system/base/menu', '2022-09-19 17:14:17', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (11, 5, '字典管理', 1, 1, NULL, 1, 1, '/admin/system/base/dict', '2022-09-19 17:14:44', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (12, 5, '中国地区管理', 2, 1, NULL, 1, 1, '/admin/system/base/area', '2022-09-19 17:15:00', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (13, 5, '定时任务', 3, 1, NULL, 1, 1, '/admin/system/base/job', '2022-09-19 17:15:14', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (14, 5, '请求日志', 4, 1, NULL, 1, 1, '/admin/system/base/logApi', '2022-09-19 17:15:33', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (15, 5, '系统公告', 6, 1, NULL, 1, 1, '/admin/system/base/notice', '2022-09-19 17:16:13', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (16, 5, '登录日志', 5, 1, NULL, 1, 1, '/admin/system/base/logLogin', '2022-09-19 17:16:36', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (17, 6, '基本信息', 0, 1, NULL, 1, 1, '/admin/system/account/base', '2022-09-19 17:17:05', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (18, 6, '更新密码', 1, 1, NULL, 1, 1, '/admin/system/account/security', '2022-09-19 17:17:52', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (19, 6, '消息中心', 2, 1, NULL, 1, 1, '/admin/system/account/msg', '2022-09-19 17:18:06', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20, 2, '图标', 0, 1, '', 1, 1, '/admin/home/home/icon', '2022-09-24 20:53:41', '1', '超级管理员1', '192.168.58.1', '2022-09-24 21:56:00', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (21, 2, '权限测试', 1, 1, NULL, 1, 1, '/admin/home/home/authTest', '2022-09-29 15:57:14', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (22, 21, '权限按钮', 0, 9, NULL, 1, 1, '/admin/home/home/authTest@button1', '2022-09-29 15:59:22', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (23, 1, '通用组件', 1, 1, 'fa-solid fa-cubes', 1, 1, '/admin/home/biz', '2022-10-08 16:08:58', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (24, 23, '地址选择器', 0, 1, NULL, 1, 1, '/admin/home/biz/areaCascader', '2022-10-08 16:09:36', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (25, 23, '富文本编辑器', 1, 1, NULL, 1, 1, '/admin/home/biz/tinymce', '2022-10-12 10:46:49', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (26, 3, '系统监控', 3, 1, 'fa-solid fa-computer', 1, 1, '/admin/system/monitor', '2022-10-17 15:16:48', '1', '超级管理员', '114.222.120.178', '2022-10-17 15:19:11', '1', '超级管理员', '114.222.120.178', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (27, 26, '数据监控', 0, 1, NULL, 1, 1, '/admin/system/monitor/druid', '2022-10-17 15:17:29', '1', '超级管理员', '114.222.120.178', '2022-10-17 15:17:41', '1', '超级管理员', '114.222.120.178', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (28, 26, '服务监控', 1, 1, NULL, 1, 1, '/admin/system/monitor/server', '2022-10-17 15:23:40', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (29, 23, '文件上传', 2, 1, NULL, 1, 1, '/admin/home/biz/fileUploader', '2022-11-07 14:35:32', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (30, 26, 'Redis管理', 2, 1, NULL, 1, 1, '/admin/system/monitor/redis', '2022-11-29 17:33:43', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (31, 23, '级联选择', 4, 1, NULL, 1, 1, '/admin/home/biz/cascader', '2022-11-30 17:24:19', '1', '超级管理员', '221.231.188.211', '2022-11-30 21:52:00', '1', '超级管理员', '221.231.192.204', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (32, 23, '字典选择器', 3, 1, NULL, 1, 1, '/admin/home/biz/dict', '2022-11-30 17:24:51', '1', '超级管理员', '221.231.188.211', '2022-11-30 21:52:00', '1', '超级管理员', '221.231.192.204', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (33, 23, '拖动排序', 7, 1, NULL, 1, 1, '/admin/home/biz/drag', '2022-11-30 17:25:20', '1', '超级管理员', '221.231.188.211', '2022-11-30 21:51:43', '1', '超级管理员', '221.231.192.204', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (34, 23, '远程数据选择', 6, 1, NULL, 1, 1, '/admin/home/biz/select', '2022-11-30 17:28:24', '1', '超级管理员', '221.231.188.211', '2022-11-30 17:28:54', '1', '超级管理员', '221.231.188.211', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (35, 39, '表格查询', 9, 1, NULL, 1, 1, '/admin/home/table/table', '2022-11-30 17:29:33', '1', '超级管理员', '221.231.188.211', '2022-11-30 17:30:06', '1', '超级管理员', '221.231.188.211', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (36, 23, '远程数据Tree', 5, 1, NULL, 1, 1, '/admin/home/biz/tree', '2022-11-30 17:30:02', '1', '超级管理员', '221.231.188.211', '2022-11-30 17:30:06', '1', '超级管理员', '221.231.188.211', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (37, 39, '组合查询', 8, 1, NULL, 1, 1, '/admin/home/table/conditionQuery', '2022-11-30 17:30:51', '1', '超级管理员', '221.231.188.211', '2022-11-30 17:30:53', '1', '超级管理员', '221.231.188.211', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (38, 23, 'PDF预览', 10, 1, NULL, 1, 1, '/admin/home/biz/pdfView', '2022-11-30 17:31:35', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (39, 1, '表格查询', 2, 1, 'fa-solid fa-table', 1, 1, '/admin/home/table', '2022-11-30 21:53:21', '1', '超级管理员', '192.168.58.1', '2022-11-30 21:54:57', '1', '超级管理员', '192.168.58.1', 0);
COMMIT;

-- ----------------------------
-- Table structure for base_rbac_role
-- ----------------------------
DROP TABLE IF EXISTS `base_rbac_role`;
CREATE TABLE `base_rbac_role` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(255) NOT NULL COMMENT '角色名称',
  `remarks` varchar(255) DEFAULT NULL COMMENT '角色描述',
  `status` tinyint(1) NOT NULL COMMENT '是否启用',
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-角色表';

-- ----------------------------
-- Records of base_rbac_role
-- ----------------------------
BEGIN;
INSERT INTO `base_rbac_role` (`id`, `name`, `remarks`, `status`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (1, '超级管理员', '超级管理员', 1, '2022-09-19 17:34:00', '1', '超级管理员1', '127.0.0.1', '2022-09-19 17:34:14', '1', '超级管理员1', '127.0.0.1', 0);
INSERT INTO `base_rbac_role` (`id`, `name`, `remarks`, `status`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (2, '业务管理员', '业务管理员', 1, '2022-09-28 15:04:59', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
COMMIT;

-- ----------------------------
-- Table structure for base_rbac_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `base_rbac_role_menu`;
CREATE TABLE `base_rbac_role_menu` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `role_id` int(11) NOT NULL COMMENT '角色ID',
  `menu_id` int(11) NOT NULL COMMENT '权限ID',
  `half_checked` tinyint(1) NOT NULL COMMENT '是否半勾选0-否/1-是',
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=479 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-角色权限对应表';

-- ----------------------------
-- Records of base_rbac_role_menu
-- ----------------------------
BEGIN;
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (123, 1, 5, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (124, 1, 10, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (125, 1, 11, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (126, 1, 12, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (127, 1, 13, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (128, 1, 14, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (129, 1, 15, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (130, 1, 16, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (131, 1, 7, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (132, 1, 9, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (133, 1, 17, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (134, 1, 19, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (135, 1, 18, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (136, 1, 6, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (137, 1, 1, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (138, 1, 2, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (139, 1, 20, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (140, 1, 4, 1, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (141, 1, 3, 1, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (142, 2, 1, 0, '2022-09-28 15:15:55', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (143, 2, 2, 0, '2022-09-28 15:15:55', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (144, 2, 20, 0, '2022-09-28 15:15:55', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (145, 1, 5, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (146, 1, 10, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (147, 1, 11, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (148, 1, 12, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (149, 1, 13, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (150, 1, 14, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (151, 1, 15, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (152, 1, 16, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (153, 1, 7, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (154, 1, 9, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (155, 1, 17, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (156, 1, 19, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (157, 1, 18, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (158, 1, 6, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (159, 1, 20, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (160, 1, 4, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (161, 1, 3, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (162, 1, 21, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (163, 1, 2, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (164, 1, 1, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (165, 1, 5, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (166, 1, 10, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (167, 1, 11, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (168, 1, 12, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (169, 1, 13, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (170, 1, 14, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (171, 1, 15, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (172, 1, 16, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (173, 1, 7, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (174, 1, 9, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (175, 1, 17, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (176, 1, 19, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (177, 1, 18, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (178, 1, 6, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (179, 1, 20, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (180, 1, 4, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (181, 1, 3, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (182, 1, 22, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (183, 1, 21, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (184, 1, 2, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (185, 1, 1, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (186, 2, 20, 0, '2022-09-30 15:10:06', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (187, 2, 21, 0, '2022-09-30 15:10:06', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (188, 2, 22, 0, '2022-09-30 15:10:06', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (189, 2, 2, 0, '2022-09-30 15:10:06', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (190, 2, 1, 0, '2022-09-30 15:10:06', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (191, 1, 5, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (192, 1, 10, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (193, 1, 11, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (194, 1, 12, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (195, 1, 13, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (196, 1, 14, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (197, 1, 15, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (198, 1, 16, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (199, 1, 7, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (200, 1, 9, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (201, 1, 17, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (202, 1, 19, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (203, 1, 18, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (204, 1, 6, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (205, 1, 20, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (206, 1, 4, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (207, 1, 3, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (208, 1, 22, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (209, 1, 21, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (210, 1, 2, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (211, 1, 23, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (212, 1, 24, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (213, 1, 1, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (214, 1, 5, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (215, 1, 10, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (216, 1, 11, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (217, 1, 12, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (218, 1, 13, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (219, 1, 14, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (220, 1, 15, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (221, 1, 16, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (222, 1, 7, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (223, 1, 9, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (224, 1, 17, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (225, 1, 19, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (226, 1, 18, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (227, 1, 6, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (228, 1, 20, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (229, 1, 4, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (230, 1, 3, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (231, 1, 22, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (232, 1, 21, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (233, 1, 2, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (234, 1, 23, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (235, 1, 24, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (236, 1, 25, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (237, 1, 1, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (238, 1, 5, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (239, 1, 10, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (240, 1, 11, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (241, 1, 12, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (242, 1, 13, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (243, 1, 14, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (244, 1, 15, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (245, 1, 16, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (246, 1, 7, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (247, 1, 9, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (248, 1, 17, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (249, 1, 19, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (250, 1, 18, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (251, 1, 6, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (252, 1, 20, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (253, 1, 4, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (254, 1, 22, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (255, 1, 21, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (256, 1, 2, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (257, 1, 23, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (258, 1, 24, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (259, 1, 25, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (260, 1, 1, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (261, 1, 26, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (262, 1, 27, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (263, 1, 3, 0, '2022-10-17 15:17:49', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (264, 1, 5, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (265, 1, 10, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (266, 1, 11, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (267, 1, 12, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (268, 1, 13, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (269, 1, 14, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (270, 1, 15, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (271, 1, 16, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (272, 1, 7, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (273, 1, 9, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (274, 1, 17, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (275, 1, 19, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (276, 1, 18, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (277, 1, 6, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (278, 1, 20, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (279, 1, 4, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (280, 1, 22, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (281, 1, 21, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (282, 1, 2, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (283, 1, 23, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (284, 1, 24, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (285, 1, 25, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (286, 1, 1, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (287, 1, 26, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (288, 1, 27, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (289, 1, 28, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (290, 1, 3, 0, '2022-10-17 16:37:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (291, 2, 20, 0, '2022-11-02 21:27:06', '1', '超级管理员', '182.243.206.198', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (292, 2, 21, 0, '2022-11-02 21:27:06', '1', '超级管理员', '182.243.206.198', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (293, 2, 22, 0, '2022-11-02 21:27:06', '1', '超级管理员', '182.243.206.198', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (294, 2, 2, 0, '2022-11-02 21:27:06', '1', '超级管理员', '182.243.206.198', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (295, 2, 1, 0, '2022-11-02 21:27:06', '1', '超级管理员', '182.243.206.198', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (296, 1, 5, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (297, 1, 10, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (298, 1, 11, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (299, 1, 12, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (300, 1, 13, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (301, 1, 14, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (302, 1, 15, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (303, 1, 16, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (304, 1, 7, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (305, 1, 9, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (306, 1, 17, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (307, 1, 19, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (308, 1, 18, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (309, 1, 6, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (310, 1, 20, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (311, 1, 4, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (312, 1, 22, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (313, 1, 21, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (314, 1, 2, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (315, 1, 26, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (316, 1, 27, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (317, 1, 28, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (318, 1, 3, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (319, 1, 23, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (320, 1, 24, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (321, 1, 25, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (322, 1, 29, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (323, 1, 1, 0, '2022-11-07 14:35:43', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (324, 1, 5, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (325, 1, 10, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (326, 1, 11, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (327, 1, 12, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (328, 1, 13, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (329, 1, 14, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (330, 1, 15, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (331, 1, 16, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (332, 1, 7, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (333, 1, 9, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (334, 1, 17, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (335, 1, 19, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (336, 1, 18, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (337, 1, 6, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (338, 1, 20, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (339, 1, 4, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (340, 1, 22, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (341, 1, 21, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (342, 1, 2, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (343, 1, 26, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (344, 1, 27, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (345, 1, 28, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (346, 1, 3, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (347, 1, 24, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (348, 1, 25, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (349, 1, 29, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (350, 1, 23, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (351, 1, 1, 0, '2022-11-07 14:37:18', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (352, 2, 20, 0, '2022-11-19 16:21:36', '1', '超级管理员', '111.224.222.105', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (353, 2, 21, 0, '2022-11-19 16:21:36', '1', '超级管理员', '111.224.222.105', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (354, 2, 22, 0, '2022-11-19 16:21:36', '1', '超级管理员', '111.224.222.105', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (355, 2, 2, 0, '2022-11-19 16:21:36', '1', '超级管理员', '111.224.222.105', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (356, 2, 1, 0, '2022-11-19 16:21:36', '1', '超级管理员', '111.224.222.105', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (357, 2, 20, 0, '2022-11-21 21:26:49', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (358, 2, 21, 0, '2022-11-21 21:26:49', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (359, 2, 22, 0, '2022-11-21 21:26:49', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (360, 2, 2, 0, '2022-11-21 21:26:49', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (361, 2, 23, 0, '2022-11-21 21:26:49', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (362, 2, 24, 0, '2022-11-21 21:26:49', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (363, 2, 25, 0, '2022-11-21 21:26:49', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (364, 2, 29, 0, '2022-11-21 21:26:49', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (365, 2, 1, 0, '2022-11-21 21:26:49', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (366, 1, 20, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (367, 1, 22, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (368, 1, 21, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (369, 1, 2, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (370, 1, 24, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (371, 1, 25, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (372, 1, 29, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (373, 1, 23, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (374, 1, 1, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (375, 1, 3, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (376, 1, 4, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (377, 1, 5, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (378, 1, 6, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (379, 1, 26, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (380, 1, 7, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (381, 1, 9, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (382, 1, 10, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (383, 1, 11, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (384, 1, 12, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (385, 1, 13, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (386, 1, 14, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (387, 1, 16, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (388, 1, 15, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (389, 1, 17, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (390, 1, 18, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (391, 1, 19, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (392, 1, 27, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (393, 1, 28, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (394, 1, 30, 0, '2022-11-29 17:33:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (395, 1, 3, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (396, 1, 4, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (397, 1, 5, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (398, 1, 6, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (399, 1, 26, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (400, 1, 7, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (401, 1, 9, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (402, 1, 10, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (403, 1, 11, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (404, 1, 12, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (405, 1, 13, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (406, 1, 14, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (407, 1, 16, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (408, 1, 15, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (409, 1, 17, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (410, 1, 18, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (411, 1, 19, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (412, 1, 27, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (413, 1, 28, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (414, 1, 30, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (415, 1, 1, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (416, 1, 2, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (417, 1, 23, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (418, 1, 20, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (419, 1, 21, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (420, 1, 24, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (421, 1, 25, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (422, 1, 29, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (423, 1, 31, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (424, 1, 32, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (425, 1, 33, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (426, 1, 34, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (427, 1, 36, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (428, 1, 37, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (429, 1, 35, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (430, 1, 38, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (431, 1, 22, 0, '2022-11-30 17:31:46', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 1);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (432, 2, 20, 0, '2022-11-30 21:34:06', '1', '超级管理员', '14.205.12.128', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (433, 2, 21, 0, '2022-11-30 21:34:06', '1', '超级管理员', '14.205.12.128', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (434, 2, 22, 0, '2022-11-30 21:34:06', '1', '超级管理员', '14.205.12.128', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (435, 2, 2, 0, '2022-11-30 21:34:06', '1', '超级管理员', '14.205.12.128', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (436, 2, 23, 0, '2022-11-30 21:34:06', '1', '超级管理员', '14.205.12.128', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (437, 2, 24, 0, '2022-11-30 21:34:06', '1', '超级管理员', '14.205.12.128', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (438, 2, 25, 0, '2022-11-30 21:34:06', '1', '超级管理员', '14.205.12.128', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (439, 2, 29, 0, '2022-11-30 21:34:06', '1', '超级管理员', '14.205.12.128', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (440, 2, 1, 0, '2022-11-30 21:34:06', '1', '超级管理员', '14.205.12.128', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (441, 1, 3, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (442, 1, 4, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (443, 1, 5, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (444, 1, 6, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (445, 1, 26, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (446, 1, 7, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (447, 1, 9, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (448, 1, 10, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (449, 1, 11, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (450, 1, 12, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (451, 1, 13, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (452, 1, 14, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (453, 1, 16, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (454, 1, 15, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (455, 1, 17, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (456, 1, 18, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (457, 1, 19, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (458, 1, 27, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (459, 1, 28, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (460, 1, 30, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (461, 1, 1, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (462, 1, 2, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (463, 1, 23, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (464, 1, 39, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (465, 1, 20, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (466, 1, 21, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (467, 1, 24, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (468, 1, 25, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (469, 1, 29, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (470, 1, 32, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (471, 1, 31, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (472, 1, 36, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (473, 1, 34, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (474, 1, 33, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (475, 1, 38, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (476, 1, 37, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (477, 1, 35, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (478, 1, 22, 0, '2022-11-30 21:54:11', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
COMMIT;

-- ----------------------------
-- Table structure for base_rbac_user_role
-- ----------------------------
DROP TABLE IF EXISTS `base_rbac_user_role`;
CREATE TABLE `base_rbac_user_role` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` varchar(64) NOT NULL COMMENT '用户ID',
  `role_id` int(11) NOT NULL COMMENT '角色ID',
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-用户角色关联表';

-- ----------------------------
-- Records of base_rbac_user_role
-- ----------------------------
BEGIN;
INSERT INTO `base_rbac_user_role` (`id`, `user_id`, `role_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (1, '1', 1, NULL, NULL, NULL, NULL, '2022-09-28 16:04:42', '1', '超级管理员', '127.0.0.1', 1);
INSERT INTO `base_rbac_user_role` (`id`, `user_id`, `role_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (6, '1', 1, '2022-09-28 16:04:42', '1', '超级管理员', '127.0.0.1', '2022-09-28 16:22:50', '1', '超级管理员', '127.0.0.1', 1);
INSERT INTO `base_rbac_user_role` (`id`, `user_id`, `role_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (7, '1', 2, '2022-09-28 16:04:42', '1', '超级管理员', '127.0.0.1', '2022-09-28 16:22:50', '1', '超级管理员', '127.0.0.1', 1);
INSERT INTO `base_rbac_user_role` (`id`, `user_id`, `role_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (8, '1', 1, '2022-09-28 16:22:50', '1', '超级管理员', '127.0.0.1', '2022-09-28 16:22:55', '1', '超级管理员', '127.0.0.1', 1);
INSERT INTO `base_rbac_user_role` (`id`, `user_id`, `role_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (9, '1', 2, '2022-09-28 16:22:50', '1', '超级管理员', '127.0.0.1', '2022-09-28 16:22:55', '1', '超级管理员', '127.0.0.1', 1);
INSERT INTO `base_rbac_user_role` (`id`, `user_id`, `role_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (10, '1', 1, '2022-09-28 16:22:55', '1', '超级管理员', '127.0.0.1', '2022-09-30 10:33:21', '1', '超级管理员', '127.0.0.1', 1);
INSERT INTO `base_rbac_user_role` (`id`, `user_id`, `role_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (11, '1', 2, '2022-09-28 16:22:55', '1', '超级管理员', '127.0.0.1', '2022-09-30 10:33:21', '1', '超级管理员', '127.0.0.1', 1);
INSERT INTO `base_rbac_user_role` (`id`, `user_id`, `role_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (12, '1', 1, '2022-09-30 10:33:21', '1', '超级管理员', '127.0.0.1', '2022-09-30 14:56:46', '1', '超级管理员', '127.0.0.1', 1);
INSERT INTO `base_rbac_user_role` (`id`, `user_id`, `role_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (13, 'f4af6517b073a51afa2306f1b533c43a', 2, '2022-09-30 14:31:29', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_user_role` (`id`, `user_id`, `role_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (14, '8129d223a0da896c3cad2001f796c7f4', 2, '2022-09-30 14:56:26', '1', '超级管理员', '127.0.0.1', '2022-10-09 14:20:22', '1', '超级管理员', '127.0.0.1', 1);
INSERT INTO `base_rbac_user_role` (`id`, `user_id`, `role_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (15, '1', 1, '2022-09-30 14:56:46', '1', '超级管理员', '127.0.0.1', '2022-10-09 14:15:30', '1', '超级管理员', '114.222.120.65', 1);
INSERT INTO `base_rbac_user_role` (`id`, `user_id`, `role_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (16, '1', 1, '2022-10-09 14:15:30', '1', '超级管理员', '114.222.120.65', '2022-10-09 14:15:43', '1', '超级管理员', '114.222.120.65', 1);
INSERT INTO `base_rbac_user_role` (`id`, `user_id`, `role_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (17, '1', 2, '2022-10-09 14:15:43', '1', '超级管理员', '114.222.120.65', '2022-10-09 14:15:46', '1', '超级管理员', '114.222.120.65', 1);
INSERT INTO `base_rbac_user_role` (`id`, `user_id`, `role_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (18, '1', 2, '2022-10-09 14:15:46', '1', '超级管理员', '114.222.120.65', '2022-10-09 14:15:51', '1', '超级管理员', '114.222.120.65', 1);
INSERT INTO `base_rbac_user_role` (`id`, `user_id`, `role_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (19, '1', 1, '2022-10-09 14:15:51', '1', '超级管理员', '114.222.120.65', '2022-10-09 14:20:09', '1', '超级管理员', '127.0.0.1', 1);
INSERT INTO `base_rbac_user_role` (`id`, `user_id`, `role_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20, '1', 1, '2022-10-09 14:20:09', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_user_role` (`id`, `user_id`, `role_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (21, '8129d223a0da896c3cad2001f796c7f4', 1, '2022-10-09 14:20:22', '1', '超级管理员', '127.0.0.1', '2022-10-09 14:20:28', '1', '超级管理员', '127.0.0.1', 1);
INSERT INTO `base_rbac_user_role` (`id`, `user_id`, `role_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (22, '8129d223a0da896c3cad2001f796c7f4', 2, '2022-10-09 14:20:28', '1', '超级管理员', '127.0.0.1', '2022-11-16 09:24:38', '1', '超级管理员', '114.222.229.224', 1);
INSERT INTO `base_rbac_user_role` (`id`, `user_id`, `role_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (23, '8129d223a0da896c3cad2001f796c7f4', 2, '2022-11-16 09:24:38', '1', '超级管理员', '114.222.229.224', '2022-11-16 09:24:44', '1', '超级管理员', '114.222.229.224', 1);
INSERT INTO `base_rbac_user_role` (`id`, `user_id`, `role_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (24, '8129d223a0da896c3cad2001f796c7f4', 1, '2022-11-16 09:24:38', '1', '超级管理员', '114.222.229.224', '2022-11-16 09:24:44', '1', '超级管理员', '114.222.229.224', 1);
INSERT INTO `base_rbac_user_role` (`id`, `user_id`, `role_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (25, '8129d223a0da896c3cad2001f796c7f4', 1, '2022-11-16 09:24:44', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 0);
COMMIT;

-- ----------------------------
-- Table structure for base_sms_code
-- ----------------------------
DROP TABLE IF EXISTS `base_sms_code`;
CREATE TABLE `base_sms_code` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `phone` varchar(15) NOT NULL COMMENT '手机号',
  `code` varchar(6) NOT NULL COMMENT '短信验证码',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-短信验证码';

-- ----------------------------
-- Records of base_sms_code
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for base_system_update_log
-- ----------------------------
DROP TABLE IF EXISTS `base_system_update_log`;
CREATE TABLE `base_system_update_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `ver` int(11) NOT NULL COMMENT '版本号',
  `ver_no` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT '版本编码',
  `remark` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '备注信息',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '升级日期',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-系统版本更新日志表';

-- ----------------------------
-- Records of base_system_update_log
-- ----------------------------
BEGIN;
INSERT INTO `base_system_update_log` (`id`, `ver`, `ver_no`, `remark`, `crt_time`) VALUES (1, 1, 'V1.0.0', '初始化V1.0.0版本', '2022-08-23 10:37:30');
COMMIT;

-- ----------------------------
-- Table structure for base_user
-- ----------------------------
DROP TABLE IF EXISTS `base_user`;
CREATE TABLE `base_user` (
  `id` varchar(50) NOT NULL COMMENT 'ID',
  `department_id` varchar(50) NOT NULL COMMENT '部门ID',
  `username` varchar(255) NOT NULL COMMENT '账户',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `name` varchar(255) NOT NULL COMMENT '姓名',
  `tel` varchar(20) DEFAULT NULL COMMENT '手机号',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `sex` tinyint(4) DEFAULT NULL COMMENT '性别0-女1-男2-未知',
  `address` varchar(255) DEFAULT NULL COMMENT '地址',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱',
  `status` tinyint(1) NOT NULL COMMENT '状态：1-有效/0-锁定',
  `role_names` varchar(255) DEFAULT NULL COMMENT '角色名称',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `img` varchar(255) DEFAULT NULL COMMENT '头像URL',
  `api_token` varchar(255) DEFAULT NULL COMMENT 'api token',
  `crt_time` datetime DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` datetime DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-用户';

-- ----------------------------
-- Records of base_user
-- ----------------------------
BEGIN;
INSERT INTO `base_user` (`id`, `department_id`, `username`, `password`, `name`, `tel`, `birthday`, `sex`, `address`, `email`, `status`, `role_names`, `description`, `img`, `api_token`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES ('1', '1', 'admin', '$2a$12$7NC7F4kdFrmqRPnocvDGpuJ392qGz/K4d7GdNbB2CSnn/CDkOAiBC', '超级管理员', '13811112222', '2000-01-01', 1, '南京市、江宁区、将军大道', 'faberxu@gmail.com', 1, '超级管理员', '个人简介', '/api/admin/fileSave/getFile/4ccb565528768d3770047d9926df5005', 'd1d6e6d1ebcb4437bd082c3046671582', '2022-09-22 21:55:23', '1', 'admin', '127.0.0.1', '2022-08-12 10:49:58', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_user` (`id`, `department_id`, `username`, `password`, `name`, `tel`, `birthday`, `sex`, `address`, `email`, `status`, `role_names`, `description`, `img`, `api_token`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES ('8129d223a0da896c3cad2001f796c7f4', '1', 'test01', '$2a$12$J/H.OFSWxxLFhCLSGiMEN.xGEjdqxBZT9eKMG/aETkhcsmP.D56Yu', '测试账户01', '13800001234', NULL, 2, NULL, NULL, 1, '超级管理员', NULL, NULL, NULL, '2022-09-30 14:56:25', '1', '超级管理员', '127.0.0.1', '2022-11-17 15:57:50', '1', '超级管理员', '122.233.177.233', 1);
COMMIT;

-- ----------------------------
-- Table structure for demo_student
-- ----------------------------
DROP TABLE IF EXISTS `demo_student`;
CREATE TABLE `demo_student` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(255) NOT NULL COMMENT '学生名',
  `age` int(3) DEFAULT NULL COMMENT '年龄',
  `sex` tinyint(4) DEFAULT NULL COMMENT '性别',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `valid` tinyint(1) DEFAULT '1' COMMENT '账户是否有效',
  `info_id` int(11) DEFAULT NULL COMMENT '补充信息ID',
  `tenant_id` int(11) DEFAULT NULL COMMENT '租户ID',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COMMENT='Demo-学生表';

-- ----------------------------
-- Records of demo_student
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for demo_student_info
-- ----------------------------
DROP TABLE IF EXISTS `demo_student_info`;
CREATE TABLE `demo_student_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `info1` varchar(255) DEFAULT NULL COMMENT '补充信息1',
  `info2` varchar(255) DEFAULT NULL COMMENT '补充信息2',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COMMENT='Demo-学生表-扩充信息表';

-- ----------------------------
-- Records of demo_student_info
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for demo_tree
-- ----------------------------
DROP TABLE IF EXISTS `demo_tree`;
CREATE TABLE `demo_tree` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `parent_id` int(11) NOT NULL COMMENT '上级节点',
  `name` varchar(255) DEFAULT NULL COMMENT '名称',
  `sort` int(11) DEFAULT '0' COMMENT '排序ID',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建人ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建人',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建主机',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '最后更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '最后更新人ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '最后更新人',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '最后更新主机',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COMMENT='DEMO-Tree结构数据';

-- ----------------------------
-- Records of demo_tree
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
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除',
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
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COMMENT='云盘/文件';

-- ----------------------------
-- Records of disk_file
-- ----------------------------
BEGIN;
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
