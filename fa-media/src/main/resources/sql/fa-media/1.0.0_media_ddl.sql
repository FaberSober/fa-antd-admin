-- ------------------------- info -------------------------
-- @@ver: 1_000_000
-- @@info: 初始化fa-media模块
-- ------------------------- info -------------------------

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for media_video
-- ----------------------------
CREATE TABLE IF NOT EXISTS `media_video`  (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '视频记录唯一ID',
  `business_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '关联业务ID（如文章ID、动态ID、课程ID等）',
  `business_type` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '业务类型（如 post、moment、course 等）',
  `origin_file_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '原视频文件ID -> base_file_save.id',
  `origin_filename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '原始视频文件名（冗余存储，便于查询展示）',
  `origin_width` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '原始视频宽度（像素）',
  `origin_height` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '原始视频高度（像素）',
  `origin_bitrate` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '原始视频码率（kbps）',
  `origin_duration` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '原始视频时长（秒）',
  `origin_size_mb` decimal(12, 2) NOT NULL DEFAULT 0.00 COMMENT '原始视频大小（MB）',
  `trans720p_file_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '720p转码视频文件ID -> base_file_save.id',
  `trans720p_size_mb` decimal(12, 2) NULL DEFAULT 0.00 COMMENT '720p视频大小（MB）',
  `trans720p_progress` tinyint(3) UNSIGNED NOT NULL DEFAULT 0 COMMENT '720p转码进度百分比（0-100，0表示未开始，100表示完成）',
  `trans720p_status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '720p转码详细状态：0=未开始,1=转码中,2=成功,3=失败,4=已取消',
  `trans720p_message` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '720p转码失败或警告的详细信息（如错误日志）',
  `trans720p_start_time` timestamp NULL DEFAULT NULL COMMENT '720p转码开始时间',
  `trans720p_end_time` timestamp NULL DEFAULT NULL COMMENT '720p转码结束时间',
  `cover_file_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '封面图文件ID -> base_file_save.id',
  `preview_file_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '预览视频文件ID -> base_file_save.id',
  `preview_duration` smallint(5) UNSIGNED NULL DEFAULT NULL COMMENT '预览视频时长（秒）',
  `format` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '视频容器格式（如 mp4、mov、webm）',
  `codec_video` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '视频编码（如 h264、h265、vp9）',
  `codec_audio` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '音频编码（如 aac、mp3）',
  `fps` decimal(4, 2) NULL DEFAULT NULL COMMENT '帧率',
  `status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '视频状态：0=转码中,1=正常,-1=转码失败,-2=违规',
  `audit_status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '审核状态：0=待审核,1=通过,2=拒绝',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除 0=正常 1=删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_business`(`business_id`, `business_type`) USING BTREE,
  INDEX `idx_origin_file`(`origin_file_id`) USING BTREE,
  INDEX `idx_720p_file`(`trans720p_file_id`) USING BTREE,
  INDEX `idx_cover_file`(`cover_file_id`) USING BTREE,
  INDEX `idx_preview_file`(`preview_file_id`) USING BTREE,
  INDEX `idx_status`(`status`, `audit_status`) USING BTREE,
  INDEX `idx_crt_time`(`crt_time`) USING BTREE,
  INDEX `idx_deleted`(`deleted`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '媒体-视频信息表' ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
