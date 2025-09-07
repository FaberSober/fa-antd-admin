/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80036
 Source Host           : localhost:3306
 Source Schema         : fa_admin

 Target Server Type    : MySQL
 Target Server Version : 80036
 File Encoding         : 65001

 Date: 07/09/2025 10:00:00
*/

-- ----------------------------
-- Table structure for im_friend
-- ----------------------------
CREATE TABLE IF NOT EXISTS `im_friend` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `friend_id` bigint NOT NULL COMMENT '好友ID',
  `friend_group_id` bigint DEFAULT NULL COMMENT '好友分组ID',
  `remark` varchar(50) DEFAULT NULL COMMENT '好友备注',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `upd_user` varchar(32) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_friend` (`user_id`,`friend_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_friend_id` (`friend_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户好友关系表';

-- ----------------------------
-- Table structure for im_friend_group
-- ----------------------------
CREATE TABLE IF NOT EXISTS `im_friend_group` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `group_name` varchar(50) NOT NULL COMMENT '分组名称',
  `sort` int DEFAULT '0' COMMENT '排序',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `upd_user` varchar(32) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='好友分组表';

-- ----------------------------
-- Table structure for im_chat_session
-- ----------------------------
CREATE TABLE IF NOT EXISTS `im_chat_session` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `session_id` varchar(64) NOT NULL COMMENT '会话ID',
  `session_type` tinyint(1) NOT NULL DEFAULT '1' COMMENT '会话类型: 1单聊 2群聊',
  `session_name` varchar(100) DEFAULT NULL COMMENT '会话名称',
  `session_avatar` varchar(255) DEFAULT NULL COMMENT '会话头像',
  `user_ids` text NOT NULL COMMENT '参与用户ID列表(逗号分隔)',
  `last_message_id` bigint DEFAULT NULL COMMENT '最后消息ID',
  `last_message_time` datetime DEFAULT NULL COMMENT '最后消息时间',
  `last_message_content` varchar(500) DEFAULT NULL COMMENT '最后消息内容',
  `unread_count` int DEFAULT '0' COMMENT '未读消息数',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `upd_user` varchar(32) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_session_id` (`session_id`),
  KEY `idx_last_message_time` (`last_message_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聊天会话表';

-- ----------------------------
-- Table structure for im_group
-- ----------------------------
CREATE TABLE IF NOT EXISTS `im_group` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `group_id` varchar(64) NOT NULL COMMENT '群ID',
  `group_name` varchar(100) NOT NULL COMMENT '群名称',
  `group_avatar` varchar(255) DEFAULT NULL COMMENT '群头像',
  `group_notice` varchar(500) DEFAULT NULL COMMENT '群公告',
  `creator_id` bigint NOT NULL COMMENT '创建者ID',
  `max_members` int DEFAULT '200' COMMENT '最大成员数',
  `current_members` int DEFAULT '1' COMMENT '当前成员数',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态: 1正常 2解散',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `upd_user` varchar(32) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_group_id` (`group_id`),
  KEY `idx_creator_id` (`creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='群聊信息表';

-- ----------------------------
-- Table structure for im_group_member
-- ----------------------------
CREATE TABLE IF NOT EXISTS `im_group_member` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `group_id` varchar(64) NOT NULL COMMENT '群ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `user_nickname` varchar(100) DEFAULT NULL COMMENT '群内昵称',
  `role` tinyint(1) DEFAULT '1' COMMENT '角色: 1成员 2管理员 3群主',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态: 1正常 2退出',
  `join_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '加入时间',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `upd_user` varchar(32) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_group_user` (`group_id`,`user_id`),
  KEY `idx_group_id` (`group_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='群成员表';

-- ----------------------------
-- Table structure for im_message
-- ----------------------------
CREATE TABLE IF NOT EXISTS `im_message` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `message_id` varchar(64) NOT NULL COMMENT '消息ID',
  `session_id` varchar(64) NOT NULL COMMENT '会话ID',
  `sender_id` bigint NOT NULL COMMENT '发送者ID',
  `message_type` tinyint(1) NOT NULL DEFAULT '1' COMMENT '消息类型: 1文本 2图片 3文件 4语音 5视频 6表情 7混合',
  `content` text COMMENT '消息内容',
  `file_id` varchar(64) DEFAULT NULL COMMENT '文件ID',
  `file_name` varchar(255) DEFAULT NULL COMMENT '文件名称',
  `file_size` bigint DEFAULT NULL COMMENT '文件大小',
  `file_url` varchar(500) DEFAULT NULL COMMENT '文件URL',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态: 1正常 2撤回',
  `send_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发送时间',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `upd_user` varchar(32) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_message_id` (`message_id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_sender_id` (`sender_id`),
  KEY `idx_send_time` (`send_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息表';

-- ----------------------------
-- Table structure for im_user_message
-- ----------------------------
CREATE TABLE IF NOT EXISTS `im_user_message` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `message_id` varchar(64) NOT NULL COMMENT '消息ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `session_id` varchar(64) NOT NULL COMMENT '会话ID',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态: 1未读 2已读 3已撤回',
  `read_time` datetime DEFAULT NULL COMMENT '阅读时间',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `upd_user` varchar(32) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_message` (`message_id`,`user_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户消息状态表';