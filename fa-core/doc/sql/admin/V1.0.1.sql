/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50734
 Source Host           : localhost:3306
 Source Schema         : faber_admin

 Target Server Type    : MySQL
 Target Server Version : 50734
 File Encoding         : 65001

 Date: 13/01/2023 22:57:31
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for base_area
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_area`  (
  `id` mediumint(7) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `level` tinyint(1) UNSIGNED NOT NULL COMMENT '层级',
  `parent_code` bigint(14) UNSIGNED NOT NULL DEFAULT 0 COMMENT '父级行政代码',
  `area_code` bigint(14) UNSIGNED NOT NULL DEFAULT 0 COMMENT '行政代码',
  `zip_code` mediumint(6) UNSIGNED ZEROFILL NOT NULL DEFAULT 000000 COMMENT '邮政编码',
  `city_code` char(6) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '区号',
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '名称',
  `short_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '简称',
  `merger_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '组合名',
  `pinyin` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '拼音',
  `lng` decimal(10, 6) NOT NULL DEFAULT 0.000000 COMMENT '经度',
  `lat` decimal(10, 6) NOT NULL DEFAULT 0.000000 COMMENT '纬度',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `idx`(`area_code`) USING BTREE,
  INDEX `pidx`(`parent_code`) USING BTREE,
  INDEX `level`(`level`) USING BTREE,
  INDEX `name`(`name`) USING BTREE,
  INDEX `level_name`(`level`, `name`) USING BTREE,
  INDEX `short_name`(`short_name`) USING BTREE,
  INDEX `level_short_name`(`level`, `short_name`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '中国行政地区表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for base_config
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_config`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `biz` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '业务模块',
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '配置类型',
  `data` json NOT NULL COMMENT '配置JSON',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-配置-通用' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for base_config_scene
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_config_scene`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `biz` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '业务模块',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '场景名称',
  `data` json NOT NULL COMMENT '配置JSON',
  `system` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否系统',
  `default_scene` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否默认',
  `hide` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否隐藏',
  `sort` int(11) NOT NULL COMMENT '排序ID',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-配置-查询场景' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for base_config_sys
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_config_sys`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `data` json NOT NULL COMMENT '配置JSON',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-配置-系统配置' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of base_config_sys
-- ----------------------------
INSERT INTO `base_config_sys` VALUES (2, '{\"cop\": \"faberxu@gmail.com\", \"logo\": \"e99149bbba077d4960b9bda35786cadc\", \"title\": \"Fa Admin\", \"subTitle\": \"简单、易维护的后台管理系统\", \"portalLink\": null, \"logoWithText\": \"d410578d91616a87bfa22930470b7651\", \"storeLocalPath\": \"D:\\\\Temp\\\\file\"}', '2023-01-13 22:08:18', '1', '超级管理员', '127.0.0.1', '2023-01-13 22:08:18', '1', '超级管理员', '192.168.58.1', 0);

-- ----------------------------
-- Table structure for base_department
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_department`  (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '部门名称',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备注',
  `parent_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '父部门ID',
  `sort` int(11) NULL DEFAULT 1 COMMENT '排序',
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '类型',
  `manager_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '负责人ID',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
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

CREATE TABLE IF NOT EXISTS `base_dict`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '编码',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '名称',
  `parent_id` int(11) NOT NULL COMMENT '上级节点',
  `sort_id` int(11) NULL DEFAULT 0 COMMENT '排序ID',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '描述',
  `options` json NULL COMMENT '字典数组{value:1,label:名称,deleted:是否删除}',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 56 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-字典分类' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of base_dict
-- ----------------------------
INSERT INTO `base_dict` VALUES (2, 'common', '常用字典', 0, 3, NULL, '[]', '2022-12-10 18:29:12', '1', 'admin', '127.0.0.1', '2022-12-10 18:29:13', '1', '超级管理员', '192.168.58.1', 1);
INSERT INTO `base_dict` VALUES (6, 'common_sex', '性别', 12, 0, NULL, '[{\"id\": 1, \"label\": \"女\", \"value\": \"0\", \"deleted\": false}, {\"id\": 2, \"label\": \"男\", \"value\": \"1\", \"deleted\": false}, {\"id\": 3, \"label\": \"保密\", \"value\": \"2\", \"deleted\": false}]', '2022-12-10 09:56:02', '1', 'admin', '127.0.0.1', '2020-06-19 09:50:36', '1', 'admin', '114.242.249.111', 0);
INSERT INTO `base_dict` VALUES (7, 'common_education', '学历', 12, 2, NULL, '[{\"id\": 1, \"label\": \"小学\", \"value\": \"1\", \"deleted\": false}, {\"id\": 2, \"label\": \"中学\", \"value\": \"2\", \"deleted\": false}, {\"id\": 3, \"label\": \"高中\", \"value\": \"3\", \"deleted\": false}, {\"id\": 4, \"label\": \"大学\", \"value\": \"4\", \"deleted\": false}, {\"id\": 5, \"label\": \"博士\", \"value\": \"6\", \"deleted\": false}, {\"id\": 6, \"label\": \"研究生\", \"value\": \"5\", \"deleted\": false}]', '2022-12-10 09:56:03', '1', 'admin', '127.0.0.1', '2020-06-19 09:50:45', '1', 'admin', '114.242.249.111', 0);
INSERT INTO `base_dict` VALUES (8, 'common_politics', '政治面貌', 12, 3, NULL, '[{\"id\": 0, \"label\": \"群众\", \"value\": \"1\", \"deleted\": false}, {\"id\": 1, \"label\": \"团员\", \"value\": \"2\", \"deleted\": false}, {\"id\": 2, \"label\": \"党员\", \"value\": \"3\", \"deleted\": false}]', '2022-12-10 09:56:05', '1', 'admin', '127.0.0.1', '2020-06-19 09:50:52', '1', 'admin', '114.242.249.111', 0);
INSERT INTO `base_dict` VALUES (9, 'group_user_type', '分组用户类型', 12, 4, NULL, '[{\"id\": 0, \"label\": \"领导\", \"value\": \"leader\", \"deleted\": false}, {\"id\": 1, \"label\": \"员工\", \"value\": \"member\", \"deleted\": false}]', '2022-12-10 09:56:05', '1', 'admin', '127.0.0.1', '2020-06-19 09:50:59', '1', 'admin', '114.242.249.111', 0);
INSERT INTO `base_dict` VALUES (10, 'common_area', '地区', 0, 1, NULL, '[]', '2022-12-10 09:56:07', '1', 'admin', '127.0.0.1', '2020-11-05 15:21:38', '1', 'admin', '120.243.220.191', 0);
INSERT INTO `base_dict` VALUES (11, 'common_area_level', '层级', 10, 1, NULL, '[{\"id\": 0, \"label\": \"省\", \"value\": \"0\", \"deleted\": false}, {\"id\": 1, \"label\": \"市\", \"value\": \"1\", \"deleted\": false}, {\"id\": 2, \"label\": \"县\", \"value\": \"2\", \"deleted\": false}, {\"id\": 3, \"label\": \"乡\", \"value\": \"3\", \"deleted\": false}, {\"id\": 4, \"label\": \"村\", \"value\": \"4\", \"deleted\": false}]', '2022-12-10 09:56:08', '1', 'admin', '127.0.0.1', '2019-08-21 10:13:38', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` VALUES (12, 'common_user', '账户字典', 0, 0, NULL, '[]', '2022-12-10 09:56:09', '1', 'admin', '127.0.0.1', '2019-10-30 14:07:45', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` VALUES (13, 'common_user_status', '账户状态', 12, 1, NULL, '[{\"id\": 0, \"label\": \"有效\", \"value\": \"1\", \"deleted\": false}, {\"id\": 1, \"label\": \"冻结\", \"value\": \"0\", \"deleted\": false}]', '2022-12-10 09:56:10', '1', 'admin', '127.0.0.1', '2019-10-30 15:09:06', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` VALUES (20, 'sys_file_download', '系统文件下载', 0, 4, '系统文件下载：包括文件模板、常用文件', '[]', '2022-12-10 18:29:15', '1', 'admin', '127.0.0.1', '2022-12-10 18:29:16', '1', '超级管理员', '192.168.58.1', 1);
INSERT INTO `base_dict` VALUES (48, 'base_dict', '基础字典', 0, 2, NULL, '[]', '2022-12-10 09:56:12', '1', 'admin', '120.243.220.191', '2020-11-05 15:21:38', '1', 'admin', '120.243.220.191', 0);
INSERT INTO `base_dict` VALUES (49, 'base_dict_bool', '是否', 48, 0, NULL, '[{\"id\": 1, \"label\": \"是\", \"value\": \"1\", \"deleted\": false}, {\"id\": 2, \"label\": \"否\", \"value\": \"0\", \"deleted\": false}]', '2022-12-10 09:56:13', '1', 'admin', '120.243.220.191', '2021-03-25 11:40:35', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` VALUES (54, 'system', '系统设置', 0, 5, NULL, '[{\"id\": 0, \"label\": \"system:title\", \"value\": \"Fa Admin\", \"deleted\": false}, {\"id\": 1, \"label\": \"system:logo\", \"value\": \"818e4fdeb5a7a1e5cc0b492cc76a077a\", \"deleted\": false}, {\"id\": 2, \"label\": \"system:portal:logoWithText\", \"value\": \"0fea6b8a396a06a4c90776ded510bafe\", \"deleted\": false}, {\"id\": 3, \"label\": \"system:portal:link\", \"value\": \"http://xxx.xxx.com\", \"deleted\": false}, {\"id\": 4, \"label\": \"system:phpRedisAdmin\", \"value\": \"https://fa.dward.cn/phpRedisAdmin\", \"deleted\": false}, {\"id\": 5, \"label\": \"system:subTitle\", \"value\": \"简单、易维护的后台管理系统\", \"deleted\": false}, {\"id\": 6, \"label\": \"system:socketUrl\", \"value\": \"fa.socket.dward.cn\", \"deleted\": false}]', '2022-12-18 17:42:46', '1', 'admin', '127.0.0.1', '2022-12-18 17:42:46', '1', '超级管理员', '192.168.58.1', 1);
INSERT INTO `base_dict` VALUES (55, 'test', 'test', 0, 6, 'cccc', '[{\"id\": 1, \"label\": \"昨天\", \"value\": \"1\", \"deleted\": false}, {\"id\": 2, \"label\": \"今天\", \"value\": \"2\", \"deleted\": false}, {\"id\": 3, \"label\": \"明天\", \"value\": \"3\", \"deleted\": false}, {\"id\": 4, \"label\": \"后天\", \"value\": \"4\", \"deleted\": true}, {\"id\": 5, \"label\": \"后天\", \"value\": \"4\", \"deleted\": false}]', '2022-12-11 20:41:13', '1', '超级管理员', '192.168.58.1', '2022-12-11 20:41:16', '1', '超级管理员', '192.168.58.1', 1);

-- ----------------------------
-- Table structure for base_entity_log
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_entity_log`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `biz_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '业务类型',
  `biz_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '业务ID',
  `action` tinyint(4) NOT NULL COMMENT '动作1新增/2更新/3删除',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '动作内容',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-实体变更日志' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for base_file_save
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_file_save`  (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'ID',
  `url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '文件访问地址',
  `size` bigint(20) NOT NULL COMMENT '文件大小，单位字节',
  `filename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '文件名',
  `original_filename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '原始文件名',
  `base_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '基础存储路径',
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '存储路径',
  `ext` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '文件扩展名',
  `content_type` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'MIME类型',
  `platform` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '存储平台',
  `th_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '缩略图访问路径',
  `th_filename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '缩略图名称',
  `th_size` bigint(20) NULL DEFAULT NULL COMMENT '缩略图大小，单位字节',
  `th_content_type` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '缩略图MIME类型',
  `object_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '文件所属对象id',
  `object_type` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '文件所属对象类型，例如用户头像，评价图片',
  `attr` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '附加属性',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-用户文件表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for base_job
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_job`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `job_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '任务名称',
  `cron` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'cron表达式',
  `status` tinyint(1) NOT NULL COMMENT '状态:0未启动false/1启动true',
  `clazz_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '任务执行方法',
  `job_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '任务描述',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-系统定时任务' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of base_job
-- ----------------------------
INSERT INTO `base_job` VALUES (1, '测试任务1', '0 0/5 * * * ?', 0, 'com.faber.config.quartz.customer.JobDemo1', '测试任务111111', '2022-09-29 15:46:31', '1', 'admin', '127.0.0.1', '2022-09-07 17:22:54', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_job` VALUES (2, '[网盘][文件库]同步文件库信息', '0 0/1 * * * ?', 1, 'com.faber.api.disk.store.jobs.JobSyncBucketInfo', NULL, '2023-01-09 20:48:01', '1', '超级管理员', '192.168.58.1', '2023-01-09 20:48:05', '1', '超级管理员', '192.168.58.1', 0);

-- ----------------------------
-- Table structure for base_job_log
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_job_log`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `job_id` int(11) NOT NULL COMMENT '任务ID',
  `begin_time` datetime(0) NOT NULL COMMENT '创建时间',
  `end_time` datetime(0) NULL DEFAULT NULL COMMENT '结束时间',
  `status` tinyint(4) NOT NULL COMMENT '执行结果：1-执行中/2-成功/9-失败',
  `duration` int(11) UNSIGNED NOT NULL COMMENT '执行花费时间',
  `err_msg` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '错误日志',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-定时任务日志' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of base_job_log
-- ----------------------------
INSERT INTO `base_job_log` VALUES (1, 2, '2023-01-13 22:57:00', '2023-01-13 22:57:00', 2, 0, NULL);

-- ----------------------------
-- Table structure for base_log_api
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_log_api`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `biz` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '模块',
  `opr` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '操作',
  `crud` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'CRUD类型',
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
  `crt_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-URL请求日志' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for base_log_login
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_log_login`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '访问客户端',
  `os` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '操作系统',
  `browser` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '浏览器',
  `version` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '浏览器版本',
  `mobile` tinyint(1) NULL DEFAULT NULL COMMENT '是否为移动终端',
  `pro` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '省',
  `city` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '市',
  `addr` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '地址',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-登录日志' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for base_msg
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_msg`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `from_user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '来源用户',
  `from_user_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '来源用户ID',
  `to_user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '接收用户',
  `to_user_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '接收用户ID',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '消息内容',
  `is_read` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否已读',
  `read_time` datetime(0) NULL DEFAULT NULL COMMENT '已读时间',
  `buzz_type` int(11) NULL DEFAULT NULL COMMENT '业务类型',
  `buzz_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '业务ID',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-消息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for base_notice
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_notice`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '标题',
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '内容',
  `status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否有效',
  `strong_notice` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否强提醒',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-通知与公告' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of base_notice
-- ----------------------------
INSERT INTO `base_notice` VALUES (1, 'test', 'testtesttesttesttest', 1, 1, '2022-09-25 10:24:32', '1', '超级管理员1', '192.168.58.1', '2022-12-05 17:24:59', '1', '超级管理员', '127.0.0.1', 0);

-- ----------------------------
-- Table structure for base_rbac_menu
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_rbac_menu`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `parent_id` int(11) NOT NULL COMMENT '父级ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '名称',
  `sort` int(11) NOT NULL COMMENT '排序',
  `level` tinyint(4) NOT NULL COMMENT '菜单等级：0-模块/1-菜单/9-按钮',
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '图标标识',
  `status` tinyint(1) NOT NULL COMMENT '是否启用0-禁用/1-启用',
  `link_type` tinyint(4) NOT NULL COMMENT '链接类型【1-内部链接(默认)2-外部链接】',
  `link_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '链接地址【pathinfo#method】',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 54 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-菜单表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of base_rbac_menu
-- ----------------------------
INSERT INTO `base_rbac_menu` VALUES (1, 0, '组件示例', 1, 0, 'icons', 1, 1, '/admin/demo', '2023-01-03 16:07:53', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (2, 52, '工作台', 0, 1, 'desktop', 1, 1, '/admin/home/desktop', '2023-01-03 16:07:53', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (3, 0, '系统管理', 3, 0, 'fa-solid fa-gear', 1, 1, '/admin/system', '2022-09-19 16:56:23', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (4, 3, '智能人事', 0, 1, 'fa-solid fa-users', 1, 1, '/admin/system/hr', '2022-09-19 16:58:28', '1', '超级管理员1', '192.168.1.107', '2022-09-19 20:48:43', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (5, 3, '系统管理', 1, 1, 'fa-solid fa-gears', 1, 1, '/admin/system/base', '2022-09-19 16:58:56', '1', '超级管理员1', '192.168.1.107', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (6, 3, '个人中心', 2, 1, 'fa-solid fa-user', 1, 1, '/admin/system/account', '2022-09-19 16:59:40', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (7, 4, '用户管理', 0, 1, '', 1, 1, '/admin/system/hr/user', '2022-09-19 17:02:08', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:43', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (9, 4, '角色权限管理', 2, 1, '', 1, 1, '/admin/system/hr/role', '2022-09-19 17:12:26', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:43', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (10, 5, '菜单管理', 0, 1, NULL, 1, 1, '/admin/system/base/menuV2', '2022-09-19 17:14:17', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (11, 5, '字典管理', 1, 1, NULL, 1, 1, '/admin/system/base/dict', '2022-09-19 17:14:44', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (12, 5, '中国地区管理', 3, 1, NULL, 1, 1, '/admin/system/base/area', '2022-09-19 17:15:00', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (13, 5, '定时任务', 4, 1, NULL, 1, 1, '/admin/system/base/job', '2022-09-19 17:15:14', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (14, 5, '请求日志', 5, 1, NULL, 1, 1, '/admin/system/base/logApi', '2022-09-19 17:15:33', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (15, 5, '系统公告', 7, 1, NULL, 1, 1, '/admin/system/base/notice', '2022-09-19 17:16:13', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (16, 5, '登录日志', 6, 1, NULL, 1, 1, '/admin/system/base/logLogin', '2022-09-19 17:16:36', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (17, 6, '基本信息', 0, 1, NULL, 1, 1, '/admin/system/account/base', '2022-09-19 17:17:05', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (18, 6, '更新密码', 1, 1, NULL, 1, 1, '/admin/system/account/security', '2022-09-19 17:17:52', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (19, 6, '消息中心', 2, 1, NULL, 1, 1, '/admin/system/account/msg', '2022-09-19 17:18:06', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (20, 23, '图标', 0, 1, '', 1, 1, '/admin/demo/biz/icon', '2023-01-03 16:07:53', '1', '超级管理员1', '192.168.58.1', '2022-09-24 21:56:00', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (21, 23, '权限测试', 1, 1, NULL, 1, 1, '/admin/demo/biz/authTest', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', '2023-01-03 16:10:01', '1', '超级管理员', '192.168.0.111', 0);
INSERT INTO `base_rbac_menu` VALUES (22, 21, '权限按钮', 0, 9, NULL, 1, 1, '/admin/demo/biz/authTest@button1', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', '2023-01-03 16:17:17', '1', '超级管理员', '192.168.0.111', 0);
INSERT INTO `base_rbac_menu` VALUES (23, 1, '通用组件', 0, 1, 'fa-solid fa-cubes', 1, 1, '/admin/demo/biz', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', '2023-01-03 16:11:38', '1', '超级管理员', '192.168.0.111', 0);
INSERT INTO `base_rbac_menu` VALUES (24, 23, '地址选择器', 2, 1, NULL, 1, 1, '/admin/demo/biz/areaCascader', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', '2023-01-03 16:10:01', '1', '超级管理员', '192.168.0.111', 0);
INSERT INTO `base_rbac_menu` VALUES (25, 23, '富文本编辑器', 3, 1, NULL, 1, 1, '/admin/demo/biz/tinymce', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', '2023-01-03 16:10:01', '1', '超级管理员', '192.168.0.111', 0);
INSERT INTO `base_rbac_menu` VALUES (26, 3, '系统监控', 3, 1, 'fa-solid fa-computer', 1, 1, '/admin/system/monitor', '2022-10-17 15:16:48', '1', '超级管理员', '114.222.120.178', '2022-10-17 15:19:11', '1', '超级管理员', '114.222.120.178', 0);
INSERT INTO `base_rbac_menu` VALUES (27, 26, '数据监控', 0, 1, NULL, 1, 1, '/admin/system/monitor/druid', '2022-10-17 15:17:29', '1', '超级管理员', '114.222.120.178', '2022-10-17 15:17:41', '1', '超级管理员', '114.222.120.178', 0);
INSERT INTO `base_rbac_menu` VALUES (28, 26, '服务监控', 1, 1, NULL, 1, 1, '/admin/system/monitor/server', '2022-10-17 15:23:40', '1', '超级管理员', '114.222.120.178', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` VALUES (29, 23, '文件上传', 4, 1, NULL, 1, 1, '/admin/demo/biz/fileUploader', '2023-01-03 16:07:53', '1', '超级管理员', '114.222.229.224', '2023-01-03 16:10:01', '1', '超级管理员', '192.168.0.111', 0);
INSERT INTO `base_rbac_menu` VALUES (30, 26, 'Redis管理', 2, 1, NULL, 1, 1, '/admin/system/monitor/redis', '2022-11-29 17:33:43', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` VALUES (31, 23, '级联选择', 6, 1, NULL, 1, 1, '/admin/demo/biz/cascader', '2023-01-03 16:07:53', '1', '超级管理员', '221.231.188.211', '2022-11-30 21:52:00', '1', '超级管理员', '221.231.192.204', 0);
INSERT INTO `base_rbac_menu` VALUES (32, 23, '字典选择器', 5, 1, NULL, 1, 1, '/admin/demo/biz/dict', '2023-01-03 16:07:53', '1', '超级管理员', '221.231.188.211', '2022-11-30 21:52:00', '1', '超级管理员', '221.231.192.204', 0);
INSERT INTO `base_rbac_menu` VALUES (33, 23, '拖动排序', 9, 1, NULL, 1, 1, '/admin/demo/biz/drag', '2023-01-03 16:07:53', '1', '超级管理员', '221.231.188.211', '2022-11-30 21:51:43', '1', '超级管理员', '221.231.192.204', 0);
INSERT INTO `base_rbac_menu` VALUES (34, 23, '远程数据选择', 8, 1, NULL, 1, 1, '/admin/demo/biz/select', '2023-01-03 16:07:53', '1', '超级管理员', '221.231.188.211', '2022-11-30 17:28:54', '1', '超级管理员', '221.231.188.211', 0);
INSERT INTO `base_rbac_menu` VALUES (35, 39, '表格查询', 0, 1, NULL, 1, 1, '/admin/demo/table/table', '2023-01-03 16:07:53', '1', '超级管理员', '221.231.188.211', '2022-11-30 17:30:06', '1', '超级管理员', '221.231.188.211', 0);
INSERT INTO `base_rbac_menu` VALUES (36, 23, '远程数据Tree', 7, 1, NULL, 1, 1, '/admin/demo/biz/tree', '2023-01-03 16:07:53', '1', '超级管理员', '221.231.188.211', '2022-11-30 17:30:06', '1', '超级管理员', '221.231.188.211', 0);
INSERT INTO `base_rbac_menu` VALUES (37, 39, '组合查询', 1, 1, NULL, 1, 1, '/admin/demo/table/conditionQuery', '2023-01-03 16:07:53', '1', '超级管理员', '221.231.188.211', '2022-11-30 17:30:53', '1', '超级管理员', '221.231.188.211', 0);
INSERT INTO `base_rbac_menu` VALUES (38, 23, 'PDF预览', 10, 1, NULL, 1, 1, '/admin/demo/biz/pdfView', '2023-01-03 16:07:53', '1', '超级管理员', '221.231.188.211', '2023-01-03 16:10:02', '1', '超级管理员', '192.168.0.111', 0);
INSERT INTO `base_rbac_menu` VALUES (39, 1, '表格查询', 1, 1, 'fa-solid fa-table', 1, 1, '/admin/demo/table', '2023-01-03 16:07:53', '1', '超级管理员', '192.168.58.1', '2022-11-30 21:54:57', '1', '超级管理员', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (40, 1, '进阶功能', 2, 0, 'fa-solid fa-rocket', 1, 1, '/admin/demo/advance', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', '2022-12-06 13:54:47', '1', '超级管理员', '127.0.0.1', 0);
INSERT INTO `base_rbac_menu` VALUES (41, 40, 'socket连接', 0, 1, NULL, 1, 1, '/admin/demo/advance/socket', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` VALUES (42, 40, 'redis缓存', 1, 1, NULL, 1, 1, '/admin/demo/advance/redis', '2023-01-03 16:07:53', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` VALUES (43, 5, '系统配置', 2, 1, NULL, 1, 1, '/admin/system/base/config', '2022-12-11 22:39:02', '1', '超级管理员', '192.168.58.1', '2022-12-11 22:40:21', '1', '超级管理员', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (44, 0, '文档管理', 2, 0, 'floppy-disk', 1, 1, '/admin/disk', '2022-12-22 09:48:01', '1', '超级管理员', '192.168.58.1', '2022-12-22 09:48:03', '1', '超级管理员', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (45, 44, '文件网盘', 1, 1, 'laptop-file', 1, 1, '/admin/disk/store', '2022-12-22 09:49:00', '1', '超级管理员', '192.168.58.1', '2022-12-23 10:33:29', '1', '超级管理员', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (51, 44, '文件仓库', 0, 1, 'store', 1, 1, '/admin/disk/buckets', '2022-12-23 10:23:29', '1', '超级管理员', '192.168.58.1', '2022-12-23 10:23:33', '1', '超级管理员', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` VALUES (52, 0, '首页', 0, 0, 'house', 1, 1, '/admin/home', '2023-01-03 16:11:35', '1', '超级管理员', '192.168.0.111', '2023-01-03 16:11:38', '1', '超级管理员', '192.168.0.111', 0);
INSERT INTO `base_rbac_menu` VALUES (53, 23, '网格布局', 11, 1, NULL, 1, 1, '/admin/demo/biz/grid', '2023-01-08 15:26:08', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);

-- ----------------------------
-- Table structure for base_rbac_role
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_rbac_role`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '角色名称',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '角色描述',
  `status` tinyint(1) NOT NULL COMMENT '是否启用',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
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

CREATE TABLE IF NOT EXISTS `base_rbac_role_menu`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `role_id` int(11) NOT NULL COMMENT '角色ID',
  `menu_id` int(11) NOT NULL COMMENT '权限ID',
  `half_checked` tinyint(1) NOT NULL COMMENT '是否半勾选',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 796 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-角色权限对应表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of base_rbac_role_menu
-- ----------------------------
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
INSERT INTO `base_rbac_role_menu` VALUES (749, 1, 52, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (750, 1, 2, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (751, 1, 44, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (752, 1, 51, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (753, 1, 45, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (754, 1, 3, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (755, 1, 4, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (756, 1, 5, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (757, 1, 6, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (758, 1, 26, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (759, 1, 7, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (760, 1, 9, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (761, 1, 10, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (762, 1, 11, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (763, 1, 43, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (764, 1, 12, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (765, 1, 13, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (766, 1, 14, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (767, 1, 16, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (768, 1, 15, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (769, 1, 17, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (770, 1, 18, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (771, 1, 19, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (772, 1, 27, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (773, 1, 28, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (774, 1, 30, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (775, 1, 1, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (776, 1, 23, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (777, 1, 39, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (778, 1, 40, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (779, 1, 20, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (780, 1, 21, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (781, 1, 24, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (782, 1, 25, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (783, 1, 29, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (784, 1, 32, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (785, 1, 31, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (786, 1, 36, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (787, 1, 34, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (788, 1, 33, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (789, 1, 38, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (790, 1, 53, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (791, 1, 35, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (792, 1, 37, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (793, 1, 41, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (794, 1, 42, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` VALUES (795, 1, 22, 0, '2023-01-08 15:27:42', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);

-- ----------------------------
-- Table structure for base_rbac_user_role
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_rbac_user_role`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户ID',
  `role_id` int(11) NOT NULL COMMENT '角色ID',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 46 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-用户角色关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of base_rbac_user_role
-- ----------------------------
INSERT INTO `base_rbac_user_role` VALUES (44, '8129d223a0da896c3cad2001f796c7f4', 2, '2022-12-08 21:36:45', '1', '超级管理员', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_user_role` VALUES (45, '1', 1, '2022-12-08 21:48:47', '1', '超级管理员', '221.231.169.192', NULL, NULL, NULL, NULL, 0);

-- ----------------------------
-- Table structure for base_sms_code
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_sms_code`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `phone` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '手机号',
  `code` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '短信验证码',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-短信验证码' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for base_system_update_log
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_system_update_log`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `ver` int(11) NOT NULL COMMENT '版本号',
  `ver_no` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '版本编码',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注信息',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-系统版本更新日志表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of base_system_update_log
-- ----------------------------
INSERT INTO `base_system_update_log` VALUES (1, 1, 'V1.0.0', '初始化V1.0.0版本', '2022-08-23 10:37:30');

-- ----------------------------
-- Table structure for base_user
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_user`  (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'ID',
  `department_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '部门ID',
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
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'BASE-用户' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of base_user
-- ----------------------------
INSERT INTO `base_user` VALUES ('1', '1', 'admin', '$2a$12$7NC7F4kdFrmqRPnocvDGpuJ392qGz/K4d7GdNbB2CSnn/CDkOAiBC', '超级管理员', '13811112222', '2000-01-01', 1, '南京市、江宁区、将军大道', 'faberxu@gmail.com', 1, '超级管理员', '干活12', '62f51621d4617d1ab9800a6326561918', 'd1d6e6d1ebcb4437bd082c3046671582', '2022-09-22 21:55:23', '1', 'admin', '127.0.0.1', '2022-08-12 10:49:58', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_user` VALUES ('8129d223a0da896c3cad2001f796c7f4', 'c1eafdca1d4bd02b90c4cd15e3528e66', 'test01', '$2a$12$J/H.OFSWxxLFhCLSGiMEN.xGEjdqxBZT9eKMG/aETkhcsmP.D56Yu', '测试账户01', '13800001234', NULL, 2, NULL, NULL, 1, '业务管理员', NULL, NULL, NULL, '2022-09-30 14:56:25', '1', '超级管理员', '127.0.0.1', '2022-11-17 15:57:50', '1', '超级管理员', '122.233.177.233', 0);

-- ----------------------------
-- Table structure for demo_student
-- ----------------------------

CREATE TABLE IF NOT EXISTS `demo_student`  (
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
  `corp_id` int(11) NOT NULL COMMENT '企业ID',
  `tenant_id` int(11) NOT NULL COMMENT '租户ID',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'DEMO-学生表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for demo_student_info
-- ----------------------------

CREATE TABLE IF NOT EXISTS `demo_student_info`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `info1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '补充信息1',
  `info2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '补充信息2',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'DEMO-学生表-扩充信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for demo_tree
-- ----------------------------

CREATE TABLE IF NOT EXISTS `demo_tree`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `parent_id` int(11) NOT NULL COMMENT '上级节点',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '名称',
  `sort` int(11) NULL DEFAULT 0 COMMENT '排序ID',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'DEMO-Tree结构数据' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for disk_store_bucket
-- ----------------------------

CREATE TABLE IF NOT EXISTS `disk_store_bucket`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '库名称',
  `size` bigint(20) NULL DEFAULT NULL COMMENT '总文件大小',
  `dir_count` int(11) NULL DEFAULT NULL COMMENT '目录数量',
  `file_count` int(11) NULL DEFAULT NULL COMMENT '文件数量',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'STORE-库' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for disk_store_bucket_user
-- ----------------------------

CREATE TABLE IF NOT EXISTS `disk_store_bucket_user`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `bucket_id` int(11) NOT NULL COMMENT '库ID',
  `user_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户ID',
  `type` tinyint(4) NOT NULL COMMENT '类型1-创建者/2-操作者',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'STORE-库-人员关联' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for disk_store_file
-- ----------------------------

CREATE TABLE IF NOT EXISTS `disk_store_file`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `bucket_id` int(11) NOT NULL COMMENT '库ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '文件夹名称',
  `parent_id` int(11) NOT NULL COMMENT '父级节点',
  `sort` int(11) NULL DEFAULT NULL COMMENT '排序ID',
  `dir` tinyint(1) NULL DEFAULT NULL COMMENT '是否文件夹',
  `size` int(11) UNSIGNED NULL DEFAULT NULL COMMENT '文件大小(目录下文件数量/KB)',
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '文件类型',
  `file_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '文件ID',
  `full_path` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '完整路径#dir#,#dir#',
  `tags` json NULL COMMENT '标签',
  `delete_action` tinyint(1) NULL DEFAULT NULL COMMENT '是否有删除动作',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'STORE-文件夹' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for disk_store_file_tag
-- ----------------------------

CREATE TABLE IF NOT EXISTS `disk_store_file_tag`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `file_id` int(11) NOT NULL COMMENT '文件ID',
  `tag_id` int(11) NOT NULL COMMENT '标签ID',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'STORE-文件-标签' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for disk_store_tag
-- ----------------------------

CREATE TABLE IF NOT EXISTS `disk_store_tag`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `bucket_id` int(11) NOT NULL COMMENT '库ID',
  `parent_id` int(11) NOT NULL COMMENT '父ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '名称',
  `sort` int(11) NOT NULL COMMENT '排序ID',
  `color` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '颜色',
  `crt_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'STORE-标签' ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
