-- update flowlong to 1.2.1
ALTER TABLE `flw_his_task_actor` DROP FOREIGN KEY `fk_his_task_actor_task_id`;

ALTER TABLE `flw_his_task_actor` CHANGE COLUMN `extend` `ext` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '扩展json' AFTER `agent_type`;


ALTER TABLE `flw_task_actor` DROP FOREIGN KEY `fk_task_actor_task_id`;

ALTER TABLE `flw_task_actor` CHANGE COLUMN `extend` `ext` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '扩展json' AFTER `agent_type`;
