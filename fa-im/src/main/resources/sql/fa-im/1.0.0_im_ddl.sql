-- ------------------------- info -------------------------
-- @@ver: 1_000_000
-- @@info: 初始化fa-im模块
-- ------------------------- info -------------------------

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for im_conversation
-- ----------------------------
CREATE TABLE IF NOT EXISTS `im_conversation`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `type` tinyint(4) NOT NULL COMMENT '类型：1-单聊/2-群聊',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '群聊名称',
  `user_ids` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '聊天用户ID集合',
  `cover` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '封面图标',
  `last_msg` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '最新一条消息',
  `manager_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '管理员ID',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'IM-会话表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for im_message
-- ----------------------------
CREATE TABLE IF NOT EXISTS `im_message`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `conversation_id` bigint(20) NOT NULL COMMENT '会话ID',
  `sender_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '发送用户ID',
  `type` tinyint(4) NOT NULL COMMENT '类型：1-文本/2-图片/3-视频/4-文件',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '消息内容',
  `file_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '附件ID',
  `is_withdrawn` tinyint(1) NULL DEFAULT NULL COMMENT '是否撤回',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 172 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'IM-消息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for im_message_read
-- ----------------------------
CREATE TABLE IF NOT EXISTS `im_message_read`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `message_id` bigint(20) NOT NULL COMMENT '消息ID',
  `user_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户ID',
  `read_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '读取时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_msg_user`(`message_id`, `user_id`) USING BTREE COMMENT '用户已读消息关联'
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'IM-消息已读状态表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for im_participant
-- ----------------------------
CREATE TABLE IF NOT EXISTS `im_participant`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `conversation_id` bigint(20) NOT NULL COMMENT '会话ID',
  `user_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户ID',
  `last_read_message_id` bigint(20) NULL DEFAULT NULL COMMENT '最后一条已读消息ID',
  `unread_count` int(11) NULL DEFAULT NULL COMMENT '未读消息数量',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户标题',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建IP',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_conv`(`conversation_id`, `user_id`) USING BTREE COMMENT '用户参与聊天记录'
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'IM-会话参与者表' ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

