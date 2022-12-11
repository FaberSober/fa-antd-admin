/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50734
 Source Host           : localhost:3306
 Source Schema         : faber_admin_20221211

 Target Server Type    : MySQL
 Target Server Version : 50734
 File Encoding         : 65001

 Date: 11/12/2022 14:29:17
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for article_book
-- ----------------------------
DROP TABLE IF EXISTS `article_book`;
CREATE TABLE `article_book`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '编号',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '书名',
  `biz_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '业务类型',
  `biz_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '业务ID',
  `cover` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '封面图',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '描述',
  `pub` tinyint(1) NULL DEFAULT NULL COMMENT '是否发布',
  `pub_time` datetime(0) NULL DEFAULT NULL COMMENT '发布时间',
  `crt_time` timestamp(0) NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '文章-书本' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for article_detail
-- ----------------------------
DROP TABLE IF EXISTS `article_detail`;
CREATE TABLE `article_detail`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `outline_id` int(11) NULL DEFAULT NULL COMMENT '大纲ID',
  `detail` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT 'html文本',
  `crt_time` timestamp(0) NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 328 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '文章-详情' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for article_outline
-- ----------------------------
DROP TABLE IF EXISTS `article_outline`;
CREATE TABLE `article_outline`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `book_id` int(11) NOT NULL COMMENT '书本ID',
  `detail_id` int(11) NULL DEFAULT NULL COMMENT '详情ID',
  `parent_id` int(11) NOT NULL COMMENT '父级节点',
  `no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '章节号',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '标题',
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '图标',
  `sort` int(11) NOT NULL DEFAULT 0 COMMENT '排序',
  `crt_time` timestamp(0) NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 362 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '文章-大纲' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for base_biz_file
-- ----------------------------
DROP TABLE IF EXISTS `base_biz_file`;
CREATE TABLE `base_biz_file`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '附件URL',
  `biz_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '业务ID',
  `biz_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '业务类型',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `crt_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-通用-业务附件' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for base_config
-- ----------------------------
DROP TABLE IF EXISTS `base_config`;
CREATE TABLE `base_config`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `buzz_modal` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '业务模块',
  `type` tinyint(4) NOT NULL COMMENT '配置类型：1表格展示字段/2高级查询条件',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '配置名称',
  `data` json NOT NULL COMMENT '配置JSON',
  `system` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否系统',
  `default_scene` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否默认',
  `hide` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否隐藏',
  `sort` int(11) NOT NULL COMMENT '排序ID',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `crt_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-系统-配置表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for base_department
-- ----------------------------
DROP TABLE IF EXISTS `base_department`;
CREATE TABLE `base_department`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '部门名称',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备注',
  `parent_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '父部门ID',
  `sort` int(11) NULL DEFAULT 1 COMMENT '排序',
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '类型',
  `manager_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '负责人ID',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `crt_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-部门' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of base_department
-- ----------------------------
INSERT INTO `base_department` VALUES ('1', '办公室', '', '0', 1, NULL, '1', '2020-06-26 16:07:35', '1', 'admin', '123.116.43.116', '2020-06-26 16:07:35', '1', 'admin', '123.116.43.116', 0);
INSERT INTO `base_department` VALUES ('c1eafdca1d4bd02b90c4cd15e3528e66', '部门1', NULL, '1', 0, NULL, NULL, '2022-12-08 17:19:03', '1', '超级管理员', '127.0.0.1', '2022-12-08 21:49:02', '1', '超级管理员', '221.231.169.192', 0);

-- ----------------------------
-- Table structure for base_dict
-- ----------------------------
DROP TABLE IF EXISTS `base_dict`;
CREATE TABLE `base_dict`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '编码',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '名称',
  `parent_id` int(11) NOT NULL COMMENT '上级节点',
  `sort_id` int(11) NULL DEFAULT 0 COMMENT '排序ID',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '描述',
  `options` json NULL COMMENT '字典数组{value:1,label:名称,deleted:是否删除}',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `crt_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建人ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建人',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建主机',
  `upd_time` timestamp(0) NULL DEFAULT NULL COMMENT '最后更新时间',
  `upd_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '最后更新人ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '最后更新人',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '最后更新主机',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 55 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-字典分类' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of base_dict
-- ----------------------------
INSERT INTO `base_dict` VALUES (2, 'common', '常用字典', 0, 3, NULL, '[]', '2022-12-10 18:29:12', '1', 'admin', '127.0.0.1', '2022-12-10 18:29:13', '1', '超级管理员', '192.168.58.1', 1);
INSERT INTO `base_dict` VALUES (6, 'common_sex', '性别', 12, 0, NULL, '[{\"id\": 1, \"label\": \"女\", \"value\": \"0\", \"deleted\": false}, {\"id\": 2, \"label\": \"男\", \"value\": \"1\", \"deleted\": false}, {\"id\": 3, \"label\": \"保密\", \"value\": \"2\", \"deleted\": false}]', '2022-12-10 09:56:02', '1', 'admin', '127.0.0.1', '2020-06-19 09:50:36', '1', 'admin', '114.242.249.111', 0);
INSERT INTO `base_dict` VALUES (7, 'common_education', '学历', 12, 2, NULL, '[{\"id\": 0, \"label\": \"小学\", \"value\": \"1\", \"deleted\": false}, {\"id\": 1, \"label\": \"中学\", \"value\": \"2\", \"deleted\": false}, {\"id\": 2, \"label\": \"高中\", \"value\": \"3\", \"deleted\": false}, {\"id\": 3, \"label\": \"大学\", \"value\": \"4\", \"deleted\": false}, {\"id\": 4, \"label\": \"研究生\", \"value\": \"5\", \"deleted\": false}, {\"id\": 5, \"label\": \"博士\", \"value\": \"6\", \"deleted\": false}]', '2022-12-10 09:56:03', '1', 'admin', '127.0.0.1', '2020-06-19 09:50:45', '1', 'admin', '114.242.249.111', 0);
INSERT INTO `base_dict` VALUES (8, 'common_politics', '政治面貌', 12, 3, NULL, '[{\"id\": 0, \"label\": \"群众\", \"value\": \"1\", \"deleted\": false}, {\"id\": 1, \"label\": \"团员\", \"value\": \"2\", \"deleted\": false}, {\"id\": 2, \"label\": \"党员\", \"value\": \"3\", \"deleted\": false}]', '2022-12-10 09:56:05', '1', 'admin', '127.0.0.1', '2020-06-19 09:50:52', '1', 'admin', '114.242.249.111', 0);
INSERT INTO `base_dict` VALUES (9, 'group_user_type', '分组用户类型', 12, 4, NULL, '[{\"id\": 0, \"label\": \"领导\", \"value\": \"leader\", \"deleted\": false}, {\"id\": 1, \"label\": \"员工\", \"value\": \"member\", \"deleted\": false}]', '2022-12-10 09:56:05', '1', 'admin', '127.0.0.1', '2020-06-19 09:50:59', '1', 'admin', '114.242.249.111', 0);
INSERT INTO `base_dict` VALUES (10, 'common_area', '地区', 0, 1, NULL, '[]', '2022-12-10 09:56:07', '1', 'admin', '127.0.0.1', '2020-11-05 15:21:38', '1', 'admin', '120.243.220.191', 0);
INSERT INTO `base_dict` VALUES (11, 'common_area_level', '层级', 10, 1, NULL, '[{\"id\": 0, \"label\": \"省\", \"value\": \"0\", \"deleted\": false}, {\"id\": 1, \"label\": \"市\", \"value\": \"1\", \"deleted\": false}, {\"id\": 2, \"label\": \"县\", \"value\": \"2\", \"deleted\": false}, {\"id\": 3, \"label\": \"乡\", \"value\": \"3\", \"deleted\": false}, {\"id\": 4, \"label\": \"村\", \"value\": \"4\", \"deleted\": false}]', '2022-12-10 09:56:08', '1', 'admin', '127.0.0.1', '2019-08-21 10:13:38', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` VALUES (12, 'common_user', '账户字典', 0, 0, NULL, '[]', '2022-12-10 09:56:09', '1', 'admin', '127.0.0.1', '2019-10-30 14:07:45', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` VALUES (13, 'common_user_status', '账户状态', 12, 1, NULL, '[{\"id\": 0, \"label\": \"有效\", \"value\": \"1\", \"deleted\": false}, {\"id\": 1, \"label\": \"冻结\", \"value\": \"0\", \"deleted\": false}]', '2022-12-10 09:56:10', '1', 'admin', '127.0.0.1', '2019-10-30 15:09:06', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` VALUES (20, 'sys_file_download', '系统文件下载', 0, 4, '系统文件下载：包括文件模板、常用文件', '[]', '2022-12-10 18:29:15', '1', 'admin', '127.0.0.1', '2022-12-10 18:29:16', '1', '超级管理员', '192.168.58.1', 1);
INSERT INTO `base_dict` VALUES (48, 'base_dict', '基础字典', 0, 2, NULL, '[]', '2022-12-10 09:56:12', '1', 'admin', '120.243.220.191', '2020-11-05 15:21:38', '1', 'admin', '120.243.220.191', 0);
INSERT INTO `base_dict` VALUES (49, 'base_dict_bool', '是否', 48, 0, NULL, '[{\"id\": 0, \"label\": \"是\", \"value\": \"1\", \"deleted\": false}, {\"id\": 1, \"label\": \"否\", \"value\": \"0\", \"deleted\": false}]', '2022-12-10 09:56:13', '1', 'admin', '120.243.220.191', '2021-03-25 11:40:35', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` VALUES (54, 'system', '系统设置', 0, 5, NULL, '[{\"id\": 0, \"label\": \"system:title\", \"value\": \"Fa Admin\", \"deleted\": false}, {\"id\": 1, \"label\": \"system:logo\", \"value\": \"818e4fdeb5a7a1e5cc0b492cc76a077a\", \"deleted\": false}, {\"id\": 2, \"label\": \"system:portal:logoWithText\", \"value\": \"0fea6b8a396a06a4c90776ded510bafe\", \"deleted\": false}, {\"id\": 3, \"label\": \"system:portal:link\", \"value\": \"http://xxx.xxx.com\", \"deleted\": false}, {\"id\": 4, \"label\": \"system:phpRedisAdmin\", \"value\": \"https://fa.dward.cn/phpRedisAdmin\", \"deleted\": false}, {\"id\": 5, \"label\": \"system:subTitle\", \"value\": \"简单、易维护的后台管理系统\", \"deleted\": false}, {\"id\": 6, \"label\": \"system:socketUrl\", \"value\": \"fa.socket.dward.cn\", \"deleted\": false}]', '2022-12-10 09:56:14', '1', 'admin', '127.0.0.1', '2022-08-10 13:58:21', '1', 'admin', '127.0.0.1', 0);

-- ----------------------------
-- Table structure for base_entity_log
-- ----------------------------
DROP TABLE IF EXISTS `base_entity_log`;
CREATE TABLE `base_entity_log`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `biz_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '业务类型',
  `biz_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '业务ID',
  `action` tinyint(4) NOT NULL COMMENT '动作1新增/2更新/3删除',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '动作内容',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `crt_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-实体变更日志' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for base_file_save
-- ----------------------------
DROP TABLE IF EXISTS `base_file_save`;
CREATE TABLE `base_file_save`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '文件名',
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'url',
  `size` int(11) NOT NULL COMMENT '附件大小',
  `drive` tinyint(4) NOT NULL COMMENT '存储类型1本地/2七牛云/3阿里云/4腾讯云',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `crt_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `upd_time` timestamp(0) NULL DEFAULT NULL,
  `upd_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-用户文件表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for base_job
-- ----------------------------
DROP TABLE IF EXISTS `base_job`;
CREATE TABLE `base_job`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `job_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '任务名称',
  `cron` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'cron表达式',
  `status` tinyint(1) NOT NULL COMMENT '状态:0未启动false/1启动true',
  `clazz_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '任务执行方法',
  `job_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '任务描述',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `crt_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户名称',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建用户IP',
  `upd_time` timestamp(0) NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户名称',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-系统定时任务' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of base_job
-- ----------------------------
INSERT INTO `base_job` VALUES (1, '测试任务1', '0 0/5 * * * ?', 0, 'com.faber.admin.config.quartz.customer.JobDemo1', '测试任务111111', '2022-09-29 15:46:31', '1', 'admin', '127.0.0.1', '2022-09-07 17:22:54', '1', 'admin', '127.0.0.1', 0);

-- ----------------------------
-- Table structure for base_job_log
-- ----------------------------
DROP TABLE IF EXISTS `base_job_log`;
CREATE TABLE `base_job_log`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `job_id` int(11) NOT NULL COMMENT '任务ID',
  `begin_time` datetime(0) NOT NULL COMMENT '创建时间',
  `end_time` datetime(0) NULL DEFAULT NULL COMMENT '结束时间',
  `status` tinyint(4) NOT NULL COMMENT '执行结果：1-执行中/2-成功/9-失败',
  `duration` int(11) UNSIGNED NOT NULL COMMENT '执行花费时间',
  `err_msg` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '错误日志',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Demo-学生表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for base_log_api
-- ----------------------------
DROP TABLE IF EXISTS `base_log_api`;
CREATE TABLE `base_log_api`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '序号',
  `url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '请求URL',
  `method` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '请求类型',
  `agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '访问客户端',
  `os` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '操作系统',
  `browser` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '浏览器',
  `version` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '浏览器版本',
  `mobile` tinyint(1) NULL DEFAULT NULL COMMENT '是否为移动终端',
  `duration` int(11) NOT NULL COMMENT '请求花费时间',
  `pro` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '省',
  `city` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '市',
  `addr` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '地址',
  `request` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '请求内容',
  `req_size` int(11) NULL DEFAULT NULL COMMENT '请求体大小',
  `response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '返回内容',
  `ret_size` int(11) NULL DEFAULT NULL COMMENT '返回内容大小',
  `ret_status` int(11) NOT NULL COMMENT '返回码',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '操作时间',
  `crt_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '操作人ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '操作人',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '操作主机',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16658 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-URL请求日志' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for base_log_login
-- ----------------------------
DROP TABLE IF EXISTS `base_log_login`;
CREATE TABLE `base_log_login`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '序号',
  `agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '访问客户端',
  `os` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '操作系统',
  `browser` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '浏览器',
  `version` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '浏览器版本',
  `mobile` tinyint(1) NULL DEFAULT NULL COMMENT '是否为移动终端',
  `pro` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '省',
  `city` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '市',
  `addr` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '地址',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '操作时间',
  `crt_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '操作人ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '操作人',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '操作主机',
  `upd_time` timestamp(0) NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户名称',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 303 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-登录日志' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for base_msg
-- ----------------------------
DROP TABLE IF EXISTS `base_msg`;
CREATE TABLE `base_msg`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `from_user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '来源用户',
  `from_user_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '来源用户ID',
  `to_user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '接收用户',
  `to_user_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '接收用户ID',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '消息内容',
  `is_read` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否已读',
  `read_time` datetime(0) NULL DEFAULT NULL COMMENT '已读时间',
  `buzz_type` int(11) NULL DEFAULT NULL COMMENT '业务类型',
  `buzz_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '业务ID',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `crt_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-消息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for base_notice
-- ----------------------------
DROP TABLE IF EXISTS `base_notice`;
CREATE TABLE `base_notice`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '标题',
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '内容',
  `status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否有效',
  `strong_notice` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否强提醒',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `crt_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-通知与公告' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for base_rbac_menu
-- ----------------------------
DROP TABLE IF EXISTS `base_rbac_menu`;
CREATE TABLE `base_rbac_menu`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `parent_id` int(11) NOT NULL COMMENT '父级ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '名称',
  `sort` int(11) NOT NULL COMMENT '排序',
  `level` tinyint(4) NOT NULL COMMENT '菜单等级：0-模块/1-一级菜单/2-二级菜单/3-三级菜单/9-按钮',
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '图标标识',
  `status` tinyint(1) NOT NULL COMMENT '是否启用0-禁用/1-启用',
  `link_type` tinyint(4) NOT NULL COMMENT '链接类型【1-内部链接(默认)2-外部链接】',
  `link_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '链接地址【pathinfo#method】',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `crt_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 43 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-权限表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of base_rbac_menu
-- ----------------------------
INSERT INTO `base_rbac_menu` VALUES (1, 0, '首页', 0, 0, 'fa-solid fa-house', 1, 1, '/admin/home', '2022-09-19 14:35:35', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (2, 1, '首页', 0, 1, 'fa-solid fa-house', 1, 1, '/admin/home/home', '2022-09-19 14:59:33', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (3, 0, '系统管理', 1, 0, 'fa-solid fa-gear', 1, 1, '/admin/system', '2022-09-19 16:56:23', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (4, 3, '智能人事', 0, 1, 'fa-solid fa-users', 1, 1, '/admin/system/hr', '2022-09-19 16:58:28', '1', '超级管理员1', '192.168.1.107', '2022-09-19 20:48:43', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (5, 3, '系统管理', 1, 1, 'fa-solid fa-gears', 1, 1, '/admin/system/base', '2022-09-19 16:58:56', '1', '超级管理员1', '192.168.1.107', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (6, 3, '个人中心', 2, 1, 'fa-solid fa-user', 1, 1, '/admin/system/account', '2022-09-19 16:59:40', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (7, 4, '用户管理', 0, 1, '', 1, 1, '/admin/system/hr/user', '2022-09-19 17:02:08', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:43', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (8, 4, '部门管理', 1, 1, '', 1, 1, '/admin/system/hr/department', '2022-09-19 17:02:30', '1', '超级管理员1', '127.0.0.1', '2022-09-25 09:49:26', '1', '超级管理员1', '192.168.58.1', 1);
INSERT INTO `base_rbac_menu` VALUES (9, 4, '角色权限管理', 2, 1, '', 1, 1, '/admin/system/hr/role', '2022-09-19 17:12:26', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:43', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (10, 5, '菜单管理', 0, 1, NULL, 1, 1, '/admin/system/base/menu', '2022-09-19 17:14:17', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (11, 5, '字典管理', 1, 1, NULL, 1, 1, '/admin/system/base/dict', '2022-09-19 17:14:44', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (12, 5, '中国地区管理', 2, 1, NULL, 1, 1, '/admin/system/base/area', '2022-09-19 17:15:00', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (13, 5, '定时任务', 3, 1, NULL, 1, 1, '/admin/system/base/job', '2022-09-19 17:15:14', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (14, 5, '请求日志', 4, 1, NULL, 1, 1, '/admin/system/base/logApi', '2022-09-19 17:15:33', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (15, 5, '系统公告', 6, 1, NULL, 1, 1, '/admin/system/base/notice', '2022-09-19 17:16:13', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (16, 5, '登录日志', 5, 1, NULL, 1, 1, '/admin/system/base/logLogin', '2022-09-19 17:16:36', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (17, 6, '基本信息', 0, 1, NULL, 1, 1, '/admin/system/account/base', '2022-09-19 17:17:05', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (18, 6, '更新密码', 1, 1, NULL, 1, 1, '/admin/system/account/security', '2022-09-19 17:17:52', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (19, 6, '消息中心', 2, 1, NULL, 1, 1, '/admin/system/account/msg', '2022-09-19 17:18:06', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (20, 2, '图标', 0, 1, '', 1, 1, '/admin/home/home/icon', '2022-09-24 20:53:41', '1', '超级管理员1', '192.168.58.1', '2022-09-24 21:56:00', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (21, 2, '权限测试', 1, 1, NULL, 1, 1, '/admin/home/home/authTest', '2022-09-29 15:57:14', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` VALUES (22, 21, '权限按钮', 0, 9, NULL, 1, 1, '/admin/home/home/authTest@button1', '2022-09-29 15:59:22', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` VALUES (23, 1, '通用组件', 1, 1, 'fa-solid fa-cubes', 1, 1, '/admin/home/biz', '2022-10-08 16:08:58', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` VALUES (24, 23, '地址选择器', 0, 1, NULL, 1, 1, '/admin/home/biz/areaCascader', '2022-10-08 16:09:36', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` VALUES (25, 23, '富文本编辑器', 1, 1, NULL, 1, 1, '/admin/home/biz/tinymce', '2022-10-12 10:46:49', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` VALUES (26, 3, '系统监控', 3, 1, 'fa-solid fa-computer', 1, 1, '/admin/system/monitor', '2022-10-17 15:16:48', '1', '超级管理员', '114.222.120.178', '2022-10-17 15:19:11', '1', '超级管理员', '114.222.120.178', 0);
INSERT INTO `base_rbac_menu` VALUES (27, 26, '数据监控', 0, 1, NULL, 1, 1, '/admin/system/monitor/druid', '2022-10-17 15:17:29', '1', '超级管理员', '114.222.120.178', '2022-10-17 15:17:41', '1', '超级管理员', '114.222.120.178', 0);
INSERT INTO `base_rbac_menu` VALUES (28, 26, '服务监控', 1, 1, NULL, 1, 1, '/admin/system/monitor/server', '2022-10-17 15:23:40', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` VALUES (29, 23, '文件上传', 2, 1, NULL, 1, 1, '/admin/home/biz/fileUploader', '2022-11-07 14:35:32', '1', '超级管理员', '114.222.229.224', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` VALUES (30, 26, 'Redis管理', 2, 1, NULL, 1, 1, '/admin/system/monitor/redis', '2022-11-29 17:33:43', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` VALUES (31, 23, '级联选择', 4, 1, NULL, 1, 1, '/admin/home/biz/cascader', '2022-11-30 17:24:19', '1', '超级管理员', '221.231.188.211', '2022-11-30 21:52:00', '1', '超级管理员', '221.231.192.204', 0);
INSERT INTO `base_rbac_menu` VALUES (32, 23, '字典选择器', 3, 1, NULL, 1, 1, '/admin/home/biz/dict', '2022-11-30 17:24:51', '1', '超级管理员', '221.231.188.211', '2022-11-30 21:52:00', '1', '超级管理员', '221.231.192.204', 0);
INSERT INTO `base_rbac_menu` VALUES (33, 23, '拖动排序', 7, 1, NULL, 1, 1, '/admin/home/biz/drag', '2022-11-30 17:25:20', '1', '超级管理员', '221.231.188.211', '2022-11-30 21:51:43', '1', '超级管理员', '221.231.192.204', 0);
INSERT INTO `base_rbac_menu` VALUES (34, 23, '远程数据选择', 6, 1, NULL, 1, 1, '/admin/home/biz/select', '2022-11-30 17:28:24', '1', '超级管理员', '221.231.188.211', '2022-11-30 17:28:54', '1', '超级管理员', '221.231.188.211', 0);
INSERT INTO `base_rbac_menu` VALUES (35, 39, '表格查询', 0, 1, NULL, 1, 1, '/admin/home/table/table', '2022-11-30 17:29:33', '1', '超级管理员', '221.231.188.211', '2022-11-30 17:30:06', '1', '超级管理员', '221.231.188.211', 0);
INSERT INTO `base_rbac_menu` VALUES (36, 23, '远程数据Tree', 5, 1, NULL, 1, 1, '/admin/home/biz/tree', '2022-11-30 17:30:02', '1', '超级管理员', '221.231.188.211', '2022-11-30 17:30:06', '1', '超级管理员', '221.231.188.211', 0);
INSERT INTO `base_rbac_menu` VALUES (37, 39, '组合查询', 1, 1, NULL, 1, 1, '/admin/home/table/conditionQuery', '2022-11-30 17:30:51', '1', '超级管理员', '221.231.188.211', '2022-11-30 17:30:53', '1', '超级管理员', '221.231.188.211', 0);
INSERT INTO `base_rbac_menu` VALUES (38, 23, 'PDF预览', 10, 1, NULL, 1, 1, '/admin/home/biz/pdfView', '2022-11-30 17:31:35', '1', '超级管理员', '221.231.188.211', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` VALUES (39, 1, '表格查询', 2, 1, 'fa-solid fa-table', 1, 1, '/admin/home/table', '2022-11-30 21:53:21', '1', '超级管理员', '192.168.58.1', '2022-11-30 21:54:57', '1', '超级管理员', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (40, 1, '进阶功能', 3, 0, 'fa-solid fa-rocket', 1, 1, '/admin/home/advance', '2022-12-06 13:54:24', '1', '超级管理员', '127.0.0.1', '2022-12-06 13:54:47', '1', '超级管理员', '127.0.0.1', 0);
INSERT INTO `base_rbac_menu` VALUES (41, 40, 'socket连接', 0, 1, NULL, 1, 1, '/admin/home/advance/socket', '2022-12-06 13:55:15', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` VALUES (42, 40, 'redis缓存', 1, 1, NULL, 1, 1, '/admin/home/advance/redis', '2022-12-07 21:36:18', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);

-- ----------------------------
-- Table structure for base_rbac_role
-- ----------------------------
DROP TABLE IF EXISTS `base_rbac_role`;
CREATE TABLE `base_rbac_role`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '角色名称',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '角色描述',
  `status` tinyint(1) NOT NULL COMMENT '是否启用',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `crt_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-角色表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of base_rbac_role
-- ----------------------------
INSERT INTO `base_rbac_role` VALUES (1, '超级管理员', '超级管理员', 1, '2022-09-19 17:34:00', '1', '超级管理员1', '127.0.0.1', '2022-09-19 17:34:14', '1', '超级管理员1', '127.0.0.1', 0);
INSERT INTO `base_rbac_role` VALUES (2, '业务管理员', '业务管理员', 1, '2022-09-28 15:04:59', '1', '超级管理员', '127.0.0.1', '2022-12-05 08:34:10', '1', '超级管理员', '14.205.11.151', 0);

-- ----------------------------
-- Table structure for base_rbac_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `base_rbac_role_menu`;
CREATE TABLE `base_rbac_role_menu`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `role_id` int(11) NOT NULL COMMENT '角色ID',
  `menu_id` int(11) NOT NULL COMMENT '权限ID',
  `half_checked` tinyint(1) NOT NULL COMMENT '是否半勾选0-否/1-是',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `crt_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 619 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-角色权限对应表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of base_rbac_role_menu
-- ----------------------------
INSERT INTO `base_rbac_role_menu` VALUES (557, 1, 3, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (558, 1, 4, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (559, 1, 5, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (560, 1, 6, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (561, 1, 26, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (562, 1, 7, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (563, 1, 9, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (564, 1, 10, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (565, 1, 11, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (566, 1, 12, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (567, 1, 13, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (568, 1, 14, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (569, 1, 16, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (570, 1, 15, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (571, 1, 17, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (572, 1, 18, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (573, 1, 19, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (574, 1, 27, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (575, 1, 28, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (576, 1, 30, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (577, 1, 2, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (578, 1, 23, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (579, 1, 39, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (580, 1, 20, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (581, 1, 21, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (582, 1, 24, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (583, 1, 25, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (584, 1, 29, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (585, 1, 32, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (586, 1, 31, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (587, 1, 36, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (588, 1, 34, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (589, 1, 33, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (590, 1, 38, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (591, 1, 35, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (592, 1, 37, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (593, 1, 22, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (594, 1, 40, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (595, 1, 41, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (596, 1, 42, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (597, 1, 1, 0, '2022-12-07 21:48:59', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (598, 2, 1, 0, '2022-12-08 16:55:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (599, 2, 2, 0, '2022-12-08 16:55:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (600, 2, 23, 0, '2022-12-08 16:55:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (601, 2, 39, 0, '2022-12-08 16:55:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (602, 2, 40, 0, '2022-12-08 16:55:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (603, 2, 20, 0, '2022-12-08 16:55:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (604, 2, 21, 0, '2022-12-08 16:55:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (605, 2, 24, 0, '2022-12-08 16:55:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (606, 2, 25, 0, '2022-12-08 16:55:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (607, 2, 29, 0, '2022-12-08 16:55:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (608, 2, 32, 0, '2022-12-08 16:55:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (609, 2, 31, 0, '2022-12-08 16:55:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (610, 2, 36, 0, '2022-12-08 16:55:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (611, 2, 34, 0, '2022-12-08 16:55:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (612, 2, 33, 0, '2022-12-08 16:55:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (613, 2, 38, 0, '2022-12-08 16:55:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (614, 2, 35, 0, '2022-12-08 16:55:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (615, 2, 37, 0, '2022-12-08 16:55:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (616, 2, 41, 0, '2022-12-08 16:55:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (617, 2, 42, 0, '2022-12-08 16:55:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (618, 2, 22, 0, '2022-12-08 16:55:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);

-- ----------------------------
-- Table structure for base_rbac_user_role
-- ----------------------------
DROP TABLE IF EXISTS `base_rbac_user_role`;
CREATE TABLE `base_rbac_user_role`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户ID',
  `role_id` int(11) NOT NULL COMMENT '角色ID',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `crt_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 46 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-用户角色关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of base_rbac_user_role
-- ----------------------------
INSERT INTO `base_rbac_user_role` VALUES (27, '1', 1, '2022-12-08 21:25:12', '1', '超级管理员', '127.0.0.1', '2022-12-08 21:25:13', '1', '超级管理员', '192.168.58.1', 1);
INSERT INTO `base_rbac_user_role` VALUES (33, '8129d223a0da896c3cad2001f796c7f4', 1, '2022-12-08 19:39:35', '1', '超级管理员', '192.168.58.1', '2022-12-08 19:39:35', '1', '超级管理员', '192.168.58.1', 1);
INSERT INTO `base_rbac_user_role` VALUES (34, '8129d223a0da896c3cad2001f796c7f4', 2, '2022-12-08 19:40:34', '1', '超级管理员', '192.168.58.1', '2022-12-08 19:40:35', '1', '超级管理员', '192.168.58.1', 1);
INSERT INTO `base_rbac_user_role` VALUES (35, '8129d223a0da896c3cad2001f796c7f4', 2, '2022-12-08 19:41:20', '1', '超级管理员', '192.168.58.1', '2022-12-08 19:41:20', '1', '超级管理员', '192.168.58.1', 1);
INSERT INTO `base_rbac_user_role` VALUES (36, '8129d223a0da896c3cad2001f796c7f4', 1, '2022-12-08 20:02:36', '1', '超级管理员', '192.168.58.1', '2022-12-08 20:02:36', '1', '超级管理员', '192.168.58.1', 1);
INSERT INTO `base_rbac_user_role` VALUES (37, '8129d223a0da896c3cad2001f796c7f4', 1, '2022-12-08 21:22:03', '1', '超级管理员', '192.168.58.1', '2022-12-08 21:22:04', '1', '超级管理员', '192.168.58.1', 1);
INSERT INTO `base_rbac_user_role` VALUES (38, '8129d223a0da896c3cad2001f796c7f4', 2, '2022-12-08 21:22:12', '1', '超级管理员', '192.168.58.1', '2022-12-08 21:22:13', '1', '超级管理员', '192.168.58.1', 1);
INSERT INTO `base_rbac_user_role` VALUES (39, '8129d223a0da896c3cad2001f796c7f4', 1, '2022-12-08 21:23:56', '1', '超级管理员', '192.168.58.1', '2022-12-08 21:23:57', '1', '超级管理员', '192.168.58.1', 1);
INSERT INTO `base_rbac_user_role` VALUES (40, '8129d223a0da896c3cad2001f796c7f4', 2, '2022-12-08 21:28:40', '1', '超级管理员', '192.168.58.1', '2022-12-08 21:28:40', '1', '超级管理员', '192.168.58.1', 1);
INSERT INTO `base_rbac_user_role` VALUES (41, '1', 1, '2022-12-08 21:26:48', '1', '超级管理员', '192.168.58.1', '2022-12-08 21:26:48', '1', '超级管理员', '192.168.58.1', 1);
INSERT INTO `base_rbac_user_role` VALUES (42, '1', 1, '2022-12-08 21:48:46', '1', '超级管理员', '192.168.58.1', '2022-12-08 21:48:47', '1', '超级管理员', '221.231.169.192', 1);
INSERT INTO `base_rbac_user_role` VALUES (43, '8129d223a0da896c3cad2001f796c7f4', 2, '2022-12-08 21:36:45', '1', '超级管理员', '192.168.58.1', '2022-12-08 21:36:45', '1', '超级管理员', '192.168.58.1', 1);
INSERT INTO `base_rbac_user_role` VALUES (44, '8129d223a0da896c3cad2001f796c7f4', 2, '2022-12-08 21:36:45', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_user_role` VALUES (45, '1', 1, '2022-12-08 21:48:47', '1', '超级管理员', '221.231.169.192', NULL, NULL, NULL, NULL, 0);

-- ----------------------------
-- Table structure for base_sms_code
-- ----------------------------
DROP TABLE IF EXISTS `base_sms_code`;
CREATE TABLE `base_sms_code`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `phone` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '手机号',
  `code` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '短信验证码',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-短信验证码' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for base_system_update_log
-- ----------------------------
DROP TABLE IF EXISTS `base_system_update_log`;
CREATE TABLE `base_system_update_log`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `ver` int(11) NOT NULL COMMENT '版本号',
  `ver_no` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '版本编码',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注信息',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '升级日期',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-系统版本更新日志表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of base_system_update_log
-- ----------------------------
INSERT INTO `base_system_update_log` VALUES (1, 1, 'V1.0.0', '初始化V1.0.0版本', '2022-08-23 10:37:30');

-- ----------------------------
-- Table structure for base_user
-- ----------------------------
DROP TABLE IF EXISTS `base_user`;
CREATE TABLE `base_user`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'ID',
  `department_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '部门ID',
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '账户',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '密码',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '姓名',
  `tel` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '手机号',
  `birthday` date NULL DEFAULT NULL COMMENT '生日',
  `sex` tinyint(4) NULL DEFAULT NULL COMMENT '性别0-女1-男2-未知',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '地址',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '邮箱',
  `status` tinyint(1) NOT NULL COMMENT '状态：1-有效/0-锁定',
  `role_names` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '角色名称',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '描述',
  `img` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '头像URL',
  `api_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'api token',
  `crt_time` datetime(0) NOT NULL COMMENT '创建时间',
  `crt_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-用户' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of base_user
-- ----------------------------
INSERT INTO `base_user` VALUES ('1', '1', 'admin', '$2a$12$7NC7F4kdFrmqRPnocvDGpuJ392qGz/K4d7GdNbB2CSnn/CDkOAiBC', '超级管理员', '13811112222', '2000-01-01', 1, '南京市、江宁区、将军大道', 'faberxu@gmail.com', 1, '超级管理员', '干活12', '/api/admin/fileSave/getFile/4ccb565528768d3770047d9926df5005', 'd1d6e6d1ebcb4437bd082c3046671582', '2022-09-22 21:55:23', '1', 'admin', '127.0.0.1', '2022-08-12 10:49:58', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_user` VALUES ('8129d223a0da896c3cad2001f796c7f4', 'c1eafdca1d4bd02b90c4cd15e3528e66', 'test01', '$2a$12$J/H.OFSWxxLFhCLSGiMEN.xGEjdqxBZT9eKMG/aETkhcsmP.D56Yu', '测试账户01', '13800001234', NULL, 2, NULL, NULL, 1, '业务管理员', NULL, NULL, NULL, '2022-09-30 14:56:25', '1', '超级管理员', '127.0.0.1', '2022-11-17 15:57:50', '1', '超级管理员', '122.233.177.233', 0);

-- ----------------------------
-- Table structure for demo_student
-- ----------------------------
DROP TABLE IF EXISTS `demo_student`;
CREATE TABLE `demo_student`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '学生名',
  `age` int(3) NULL DEFAULT NULL COMMENT '年龄',
  `sex` tinyint(4) NULL DEFAULT NULL COMMENT '性别',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '邮箱',
  `birthday` date NULL DEFAULT NULL COMMENT '生日',
  `valid` tinyint(1) NULL DEFAULT 1 COMMENT '账户是否有效',
  `tags` json NULL COMMENT '标签数组',
  `info` json NULL COMMENT '详细信息',
  `info_id` int(11) NULL DEFAULT NULL COMMENT '补充信息ID',
  `tenant_id` int(11) NOT NULL COMMENT '租户ID',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `crt_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Demo-学生表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for demo_student_info
-- ----------------------------
DROP TABLE IF EXISTS `demo_student_info`;
CREATE TABLE `demo_student_info`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `info1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '补充信息1',
  `info2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '补充信息2',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Demo-学生表-扩充信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for demo_tree
-- ----------------------------
DROP TABLE IF EXISTS `demo_tree`;
CREATE TABLE `demo_tree`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `parent_id` int(11) NOT NULL COMMENT '上级节点',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '名称',
  `sort` int(11) NULL DEFAULT 0 COMMENT '排序ID',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `crt_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建人ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建人',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建主机',
  `upd_time` timestamp(0) NULL DEFAULT NULL COMMENT '最后更新时间',
  `upd_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '最后更新人ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '最后更新人',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '最后更新主机',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 71 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'DEMO-Tree结构数据' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for disk_dir
-- ----------------------------
DROP TABLE IF EXISTS `disk_dir`;
CREATE TABLE `disk_dir`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '文件夹名称',
  `parent_id` int(11) NOT NULL COMMENT '父级节点',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `crt_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '云盘/文件夹' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for disk_file
-- ----------------------------
DROP TABLE IF EXISTS `disk_file`;
CREATE TABLE `disk_file`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `dir_id` int(11) NOT NULL COMMENT '文件夹ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '文件名称',
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '文件类型',
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '文件URL',
  `size` int(11) NOT NULL COMMENT '文件大小(B)',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `crt_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '云盘/文件' ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
