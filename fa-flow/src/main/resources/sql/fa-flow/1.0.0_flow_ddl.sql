-- ------------------------- info -------------------------
-- @@ver: 1_000_000
-- @@info: 初始化fa-flow模块
-- ------------------------- info -------------------------

SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------- flowlong begin ----------------------------
-- ----------------------------
-- Table structure for flw_process
-- ----------------------------
-- DROP TABLE IF EXISTS `flw_process`;
CREATE TABLE IF NOT EXISTS `flw_process`
(
    `id`              bigint       NOT NULL COMMENT '主键ID',
    `tenant_id`       varchar(50) COMMENT '租户ID',
    `create_id`       varchar(50)  NOT NULL COMMENT '创建人ID',
    `create_by`       varchar(50)  NOT NULL COMMENT '创建人名称',
    `create_time`     timestamp    NOT NULL COMMENT '创建时间',
    `process_key`     varchar(100) NOT NULL COMMENT '流程定义 key 唯一标识',
    `process_name`    varchar(100) NOT NULL COMMENT '流程定义名称',
    `process_icon`    varchar(255)          DEFAULT NULL COMMENT '流程图标地址',
    `process_type`    varchar(100) COMMENT '流程类型',
    `process_version` int          NOT NULL DEFAULT 1 COMMENT '流程版本，默认 1',
    `instance_url`    varchar(200) COMMENT '实例地址',
    `remark`          varchar(255) COMMENT '备注说明',
    `use_scope`       tinyint(1) NOT NULL DEFAULT 0 COMMENT '使用范围 0，全员 1，指定人员（业务关联） 2，均不可提交',
    `process_state`   tinyint(1) NOT NULL DEFAULT 1 COMMENT '流程状态 0，不可用 1，可用 2，历史版本',
    `model_content`   text COMMENT '流程模型定义JSON内容',
    `sort`            tinyint(1) DEFAULT 0 COMMENT '排序',
    PRIMARY KEY (`id`) USING BTREE,
    INDEX             `idx_process_name`(`process_name` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4  COMMENT = '流程定义表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for flw_his_instance
-- ----------------------------
-- DROP TABLE IF EXISTS `flw_his_instance`;
CREATE TABLE IF NOT EXISTS `flw_his_instance`
(
    `id`                 bigint       NOT NULL COMMENT '主键ID',
    `tenant_id`          varchar(50) COMMENT '租户ID',
    `create_id`          varchar(50)  NOT NULL COMMENT '创建人ID',
    `create_by`          varchar(50)  NOT NULL COMMENT '创建人名称',
    `create_time`        timestamp    NOT NULL COMMENT '创建时间',
    `process_id`         bigint       NOT NULL COMMENT '流程定义ID',
    `parent_instance_id` bigint COMMENT '父流程实例ID',
    `priority`           tinyint(1) COMMENT '优先级',
    `instance_no`        varchar(50) COMMENT '流程实例编号',
    `business_key`       varchar(100) COMMENT '业务KEY',
    `variable`           text COMMENT '变量json',
    `current_node_name`  varchar(100) NOT NULL COMMENT '当前所在节点名称',
    `current_node_key`   varchar(100) NOT NULL COMMENT '当前所在节点key',
    `expire_time`        timestamp NULL DEFAULT NULL COMMENT '期望完成时间',
    `last_update_by`     varchar(50) COMMENT '上次更新人',
    `last_update_time`   timestamp NULL DEFAULT NULL COMMENT '上次更新时间',
    `instance_state`     tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态 -2，已暂停状态 -1，暂存待审 0，审批中 1，审批通过 2，审批拒绝 3，撤销审批 4，超时结束 5，强制终止 6，自动通过 7，自动拒绝',
    `end_time`           timestamp NULL DEFAULT NULL COMMENT '结束时间',
    `duration`           bigint COMMENT '处理耗时',
    PRIMARY KEY (`id`) USING BTREE,
    INDEX                `idx_his_instance_process_id`(`process_id` ASC) USING BTREE,
    CONSTRAINT `fk_his_instance_process_id` FOREIGN KEY (`process_id`) REFERENCES `flw_process` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4  COMMENT = '历史流程实例表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for flw_his_task
-- ----------------------------
-- DROP TABLE IF EXISTS `flw_his_task`;
CREATE TABLE IF NOT EXISTS `flw_his_task`
(
    `id`               bigint       NOT NULL COMMENT '主键ID',
    `tenant_id`        varchar(50) COMMENT '租户ID',
    `create_id`        varchar(50)  NOT NULL COMMENT '创建人ID',
    `create_by`        varchar(50)  NOT NULL COMMENT '创建人名称',
    `create_time`      timestamp    NOT NULL COMMENT '创建时间',
    `instance_id`      bigint       NOT NULL COMMENT '流程实例ID',
    `parent_task_id`   bigint COMMENT '父任务ID',
    `call_process_id`  bigint COMMENT '调用外部流程定义ID',
    `call_instance_id` bigint COMMENT '调用外部流程实例ID',
    `task_name`        varchar(100) NOT NULL COMMENT '任务名称',
    `task_key`     varchar(100) NOT NULL COMMENT '任务 key 唯一标识',
    `task_type`        tinyint(1) NOT NULL COMMENT '任务类型 -1，结束节点 0，主办 1，审批 2，抄送 3，条件审批 4，条件分支 5，调用外部流程任务 6，定时器任务 7，触发器任务 8，并行分支 9，包容分支 10，转办 11，委派 12，委派归还 13，代理人任务 14，代理人归还 15，代理人协办 16，被代理人自己完成 17，拿回任务 18，待撤回历史任务 19，拒绝任务 20，跳转任务 21，驳回跳转 22，路由跳转 23，路由分支 24，驳回重新审批跳转 25，暂存待审 30，自动通过 31，自动拒绝',
    `perform_type`     tinyint(1) COMMENT '参与类型 0，发起 1，按顺序依次审批 2，会签 3，或签 4，票签 6，定时器 7，触发器 9，抄送',
    `action_url`       varchar(200) COMMENT '任务处理的url',
    `variable`         text COMMENT '变量json',
    `assignor_id`      varchar(100) COMMENT '委托人ID',
    `assignor`         varchar(255) COMMENT '委托人',
    `expire_time`      timestamp NULL DEFAULT NULL COMMENT '任务期望完成时间',
    `remind_time`      timestamp NULL DEFAULT NULL COMMENT '提醒时间',
    `remind_repeat`    tinyint(1) NOT NULL DEFAULT 0 COMMENT '提醒次数',
    `viewed`           tinyint(1) NOT NULL DEFAULT 0 COMMENT '已阅 0，否 1，是',
    `finish_time`      timestamp NULL DEFAULT NULL COMMENT '任务完成时间',
    `task_state`       tinyint(1) NOT NULL DEFAULT 0 COMMENT '任务状态 0，活动 1，跳转 2，完成 3，拒绝 4，撤销审批 5，超时 6，终止 7，驳回终止 8，自动完成 9，自动驳回 10，自动跳转 11，驳回跳转 12，驳回重新审批跳转 13，路由跳转',
    `duration`         bigint COMMENT '处理耗时',
    PRIMARY KEY (`id`) USING BTREE,
    INDEX              `idx_his_task_instance_id`(`instance_id` ASC) USING BTREE,
    INDEX              `idx_his_task_parent_task_id`(`parent_task_id` ASC) USING BTREE,
    CONSTRAINT `fk_his_task_instance_id` FOREIGN KEY (`instance_id`) REFERENCES `flw_his_instance` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4  COMMENT = '历史任务表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for flw_his_task_actor
-- ----------------------------
-- DROP TABLE IF EXISTS `flw_his_task_actor`;
CREATE TABLE IF NOT EXISTS `flw_his_task_actor`
(
    `id`          bigint       NOT NULL COMMENT '主键 ID',
    `tenant_id`   varchar(50) COMMENT '租户ID',
    `instance_id` bigint       NOT NULL COMMENT '流程实例ID',
    `task_id`     bigint       NOT NULL COMMENT '任务ID',
    `actor_id`    varchar(100) NOT NULL COMMENT '参与者ID',
    `actor_name`  varchar(100) NOT NULL COMMENT '参与者名称',
    `actor_type`  int          NOT NULL COMMENT '参与者类型 0，用户 1，角色 2，部门',
    `weight`      int COMMENT '权重，票签任务时，该值为不同处理人员的分量比例，代理任务时，该值为 1 时为代理人',
    `agent_id`    varchar(100) COMMENT '代理人ID',
    `agent_type`  int          COMMENT '代理人类型 0，代理 1，被代理 2，认领角色 3，认领部门',
    `extend`      text COMMENT '扩展json',
    PRIMARY KEY (`id`) USING BTREE,
    INDEX         `idx_his_task_actor_task_id`(`task_id` ASC) USING BTREE,
    CONSTRAINT `fk_his_task_actor_task_id` FOREIGN KEY (`task_id`) REFERENCES `flw_his_task` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4  COMMENT = '历史任务参与者表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for flw_instance
-- ----------------------------
-- DROP TABLE IF EXISTS `flw_instance`;
CREATE TABLE IF NOT EXISTS `flw_instance`
(
    `id`                 bigint       NOT NULL COMMENT '主键ID',
    `tenant_id`          varchar(50) COMMENT '租户ID',
    `create_id`          varchar(50)  NOT NULL COMMENT '创建人ID',
    `create_by`          varchar(50)  NOT NULL COMMENT '创建人名称',
    `create_time`        timestamp    NOT NULL COMMENT '创建时间',
    `process_id`         bigint       NOT NULL COMMENT '流程定义ID',
    `parent_instance_id` bigint COMMENT '父流程实例ID',
    `priority`           tinyint(1) COMMENT '优先级',
    `instance_no`        varchar(50) COMMENT '流程实例编号',
    `business_key`       varchar(100) COMMENT '业务KEY',
    `variable`           text COMMENT '变量json',
    `current_node_name`  varchar(100) NOT NULL COMMENT '当前所在节点名称',
    `current_node_key`   varchar(100) NOT NULL COMMENT '当前所在节点key',
    `expire_time`        timestamp NULL DEFAULT NULL COMMENT '期望完成时间',
    `last_update_by`     varchar(50) COMMENT '上次更新人',
    `last_update_time`   timestamp NULL DEFAULT NULL COMMENT '上次更新时间',
    PRIMARY KEY (`id`) USING BTREE,
    INDEX                `idx_instance_process_id`(`process_id` ASC) USING BTREE,
    CONSTRAINT `fk_instance_process_id` FOREIGN KEY (`process_id`) REFERENCES `flw_process` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4  COMMENT = '流程实例表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for flw_task
-- ----------------------------
-- DROP TABLE IF EXISTS `flw_task`;
CREATE TABLE IF NOT EXISTS `flw_task`
(
    `id`             bigint       NOT NULL COMMENT '主键ID',
    `tenant_id`      varchar(50) COMMENT '租户ID',
    `create_id`      varchar(50)  NOT NULL COMMENT '创建人ID',
    `create_by`      varchar(50)  NOT NULL COMMENT '创建人名称',
    `create_time`    timestamp    NOT NULL COMMENT '创建时间',
    `instance_id`    bigint       NOT NULL COMMENT '流程实例ID',
    `parent_task_id` bigint COMMENT '父任务ID',
    `task_name`      varchar(100) NOT NULL COMMENT '任务名称',
    `task_key`       varchar(100) NOT NULL COMMENT '任务 key 唯一标识',
    `task_type`      tinyint(1) NOT NULL COMMENT '任务类型 -1，结束节点 0，主办 1，审批 2，抄送 3，条件审批 4，条件分支 5，调用外部流程任务 6，定时器任务 7，触发器任务 8，并行分支 9，包容分支 10，转办 11，委派 12，委派归还 13，代理人任务 14，代理人归还 15，代理人协办 16，被代理人自己完成 17，拿回任务 18，待撤回历史任务 19，拒绝任务 20，跳转任务 21，驳回跳转 22，路由跳转 23，路由分支 24，驳回重新审批跳转 25，暂存待审 30，自动通过 31，自动拒绝',
    `perform_type`   tinyint(1) NULL COMMENT '参与类型 0，发起 1，按顺序依次审批 2，会签 3，或签 4，票签 6，定时器 7，触发器 9，抄送',
    `action_url`     varchar(200) COMMENT '任务处理的url',
    `variable`       text COMMENT '变量json',
    `assignor_id`    varchar(100) COMMENT '委托人ID',
    `assignor`       varchar(255) COMMENT '委托人',
    `expire_time`    timestamp NULL DEFAULT NULL COMMENT '任务期望完成时间',
    `remind_time`    timestamp NULL DEFAULT NULL COMMENT '提醒时间',
    `remind_repeat`  tinyint(1) NOT NULL DEFAULT 0 COMMENT '提醒次数',
    `viewed`         tinyint(1) NOT NULL DEFAULT 0 COMMENT '已阅 0，否 1，是',
    PRIMARY KEY (`id`) USING BTREE,
    INDEX            `idx_task_instance_id`(`instance_id` ASC) USING BTREE,
    CONSTRAINT `fk_task_instance_id` FOREIGN KEY (`instance_id`) REFERENCES `flw_instance` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4  COMMENT = '任务表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for flw_task_actor
-- ----------------------------
-- DROP TABLE IF EXISTS `flw_task_actor`;
CREATE TABLE IF NOT EXISTS `flw_task_actor`
(
    `id`          bigint       NOT NULL COMMENT '主键 ID',
    `tenant_id`   varchar(50) COMMENT '租户ID',
    `instance_id` bigint       NOT NULL COMMENT '流程实例ID',
    `task_id`     bigint       NOT NULL COMMENT '任务ID',
    `actor_id`    varchar(100) NOT NULL COMMENT '参与者ID',
    `actor_name`  varchar(100) NOT NULL COMMENT '参与者名称',
    `actor_type`  int          NOT NULL COMMENT '参与者类型 0，用户 1，角色 2，部门',
    `weight`      int COMMENT '权重，票签任务时，该值为不同处理人员的分量比例，代理任务时，该值为 1 时为代理人',
    `agent_id`    varchar(100) COMMENT '代理人ID',
    `agent_type`  int          COMMENT '代理人类型 0，代理 1，被代理 2，认领角色 3，认领部门',
    `extend`      text COMMENT '扩展json',
    PRIMARY KEY (`id`) USING BTREE,
    INDEX         `idx_task_actor_task_id`(`task_id` ASC) USING BTREE,
    CONSTRAINT `fk_task_actor_task_id` FOREIGN KEY (`task_id`) REFERENCES `flw_task` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4  COMMENT = '任务参与者表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for flw_instance
-- ----------------------------
-- DROP TABLE IF EXISTS `flw_ext_instance`;
CREATE TABLE IF NOT EXISTS `flw_ext_instance`
(
    `id`            bigint NOT NULL COMMENT '主键ID',
    `tenant_id`     varchar(50) COMMENT '租户ID',
    `process_id`    bigint NOT NULL COMMENT '流程定义ID',
    `process_name`  varchar(100) COMMENT '流程名称',
    `process_type`  varchar(100) COMMENT '流程类型',
    `model_content` text COMMENT '流程模型定义JSON内容',
    PRIMARY KEY (`id`) USING BTREE,
    CONSTRAINT `fk_ext_instance_id` FOREIGN KEY (`id`) REFERENCES `flw_his_instance` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4  COMMENT = '扩展流程实例表' ROW_FORMAT = Dynamic;

-- ---------------------------- flowlong end ----------------------------

CREATE TABLE IF NOT EXISTS `flow_catagory` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `parent_id` int(11) NOT NULL COMMENT '上级节点',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `sort` int(11) DEFAULT '0' COMMENT '排序ID',
  `icon` varchar(255) DEFAULT NULL COMMENT '图标',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='FLOW-流程分类';


CREATE TABLE IF NOT EXISTS `flow_process` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `catagory_id` int(11) NOT NULL COMMENT '流程分类ID',
  `process_id` bigint(20) DEFAULT NULL COMMENT '当前流程ID',
  `process_key` varchar(100) DEFAULT NULL COMMENT '流程定义 key 唯一标识',
  `process_name` varchar(100) NOT NULL COMMENT '名称',
  `process_icon` varchar(255) DEFAULT NULL COMMENT '图标',
  `process_type` varchar(100) DEFAULT NULL COMMENT '类型',
  `process_version` int(11) NOT NULL DEFAULT '1' COMMENT '流程版本，默认 1',
  `instance_url` varchar(200) DEFAULT NULL COMMENT '实例地址',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注说明',
  `use_scope` tinyint(1) NOT NULL DEFAULT '0' COMMENT '使用范围 0，全员 1，指定人员（业务关联） 2，均不可提交',
  `process_state` tinyint(1) NOT NULL DEFAULT '1' COMMENT '流程状态 0，不可用 1，可用 2，历史版本',
  `model_content` text COMMENT '流程模型定义JSON内容',
  `sort` int(11) DEFAULT '0' COMMENT '排序ID',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='FLOW-流程定义';

CREATE TABLE IF NOT EXISTS `demo_flow_leave`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `flow_id` bigint NULL DEFAULT NULL COMMENT '流程ID',
  `apply_user_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '请假员工ID',
  `apply_date` datetime NULL DEFAULT NULL COMMENT '申请日期',
  `apply_reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '请假原因',
  `leave_day_count` int NULL DEFAULT NULL COMMENT '请假天数',
  `leave_start_time` datetime NULL DEFAULT NULL COMMENT '开始时间',
  `leave_end_time` datetime NULL DEFAULT NULL COMMENT '结束时间',
  `tenant_id` int NULL DEFAULT NULL COMMENT '租户ID',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `upd_user` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'DEMO-请假流程' ROW_FORMAT = Dynamic;


-- ----------------------------
-- add flow menu
-- ----------------------------
BEGIN;
INSERT INTO `base_rbac_menu` VALUES (13000000, 10000000, 1, '流程示例', 2, 1, 'briefcase', 1, 1, '/admin/demo/flow', '2025-08-24 13:22:35', '1', '超级管理员', '26.26.26.1', '2025-08-24 13:22:48', '1', '超级管理员', '26.26.26.1', 0);
-- INSERT INTO `base_rbac_menu` VALUES (22020002, 13000000, 1, '流程编辑器', 0, 1, NULL, 1, 1, '/admin/demo/flow/base', '2025-08-24 13:22:52', '1', '超级管理员', '26.26.26.1', '2025-08-24 13:23:05', NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` VALUES (13000100, 13000000, 1, '流程配置', 1, 1, NULL, 1, 1, '/admin/flow/manage/deploy', '2025-08-24 13:23:11', '1', '超级管理员', '26.26.26.1', '2025-08-24 13:23:24', NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` VALUES (13000200, 13000000, 1, '流程审批', 2, 1, NULL, 1, 1, '/admin/flow/manage/audit', '2025-08-24 13:23:22', '1', '超级管理员', '26.26.26.1', '2025-08-24 13:23:35', NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` VALUES (13000300, 13000000, 1, '流程实例', 3, 1, NULL, 1, 1, '/admin/flow/manage/monitor/instance', '2025-08-24 14:21:13', '1', '超级管理员', '26.26.26.1', '2025-08-24 14:21:26', NULL, NULL, NULL, 0);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
