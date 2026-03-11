-- ------------------------- info -------------------------
-- @@ver: 1_000_002
-- @@info: add flow_form、flow_form_table
-- ------------------------- info -------------------------

CREATE TABLE IF NOT EXISTS `flow_form`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `catagory_id` int(11) NOT NULL COMMENT '流程分类ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '名称',
  `no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '编码',
  `type` tinyint(4) NOT NULL COMMENT '表单类型:1设计表单/2系统表单',
  `status` tinyint(4) NOT NULL COMMENT '状态：1启用/2禁止',
  `sort` int(11) NULL DEFAULT 0 COMMENT '排序ID',
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '图标',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备注',
  `table_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '表名',
  `data_config` json NULL COMMENT '数据库配置',
  `config` json NULL COMMENT '表单配置',
  `table_config` json NULL COMMENT '列表配置',
  `flow_process_id` int(11) NULL DEFAULT NULL COMMENT '流程ID',
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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'FLOW-流程表单' ROW_FORMAT = Dynamic;

CREATE TABLE IF NOT EXISTS `flow_form_table`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `flow_form_id` int(11) NOT NULL COMMENT '流程表单ID',
  `sort` int(11) NULL DEFAULT 0 COMMENT '排序ID',
  `table_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '表名',
  `data_config` json NULL COMMENT '数据库配置',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备注',
  `foreign_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '外键字段',
  `reference_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '关联主键',
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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'FLOW-流程表单关联表' ROW_FORMAT = Dynamic;

ALTER TABLE `flow_process` ADD COLUMN `form_type` tinyint(4) NULL DEFAULT NULL COMMENT '表单类型' AFTER `model_content`;

ALTER TABLE `flow_process` ADD COLUMN `form_id` int(11) NULL DEFAULT NULL COMMENT '自定义表单ID' AFTER `form_type`;
