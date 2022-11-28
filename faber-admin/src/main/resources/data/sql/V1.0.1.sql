/*
MySQL Backup
Database: faber_admin
Backup Time: 2022-10-13 11:32:41
*/

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `faber_admin`.`article_book`;
DROP TABLE IF EXISTS `faber_admin`.`article_detail`;
DROP TABLE IF EXISTS `faber_admin`.`article_outline`;
DROP TABLE IF EXISTS `faber_admin`.`base_biz_file`;
DROP TABLE IF EXISTS `faber_admin`.`base_config`;
DROP TABLE IF EXISTS `faber_admin`.`base_department`;
DROP TABLE IF EXISTS `faber_admin`.`base_dict`;
DROP TABLE IF EXISTS `faber_admin`.`base_dict_type`;
DROP TABLE IF EXISTS `faber_admin`.`base_file_save`;
DROP TABLE IF EXISTS `faber_admin`.`base_job`;
DROP TABLE IF EXISTS `faber_admin`.`base_job_log`;
DROP TABLE IF EXISTS `faber_admin`.`base_log_api`;
DROP TABLE IF EXISTS `faber_admin`.`base_log_login`;
DROP TABLE IF EXISTS `faber_admin`.`base_msg`;
DROP TABLE IF EXISTS `faber_admin`.`base_notice`;
DROP TABLE IF EXISTS `faber_admin`.`base_rbac_menu`;
DROP TABLE IF EXISTS `faber_admin`.`base_rbac_role`;
DROP TABLE IF EXISTS `faber_admin`.`base_rbac_role_menu`;
DROP TABLE IF EXISTS `faber_admin`.`base_rbac_user_role`;
DROP TABLE IF EXISTS `faber_admin`.`base_sms_code`;
DROP TABLE IF EXISTS `faber_admin`.`base_system_update_log`;
DROP TABLE IF EXISTS `faber_admin`.`base_user`;
DROP TABLE IF EXISTS `faber_admin`.`demo_student`;
DROP TABLE IF EXISTS `faber_admin`.`demo_student_info`;
DROP TABLE IF EXISTS `faber_admin`.`disk_dir`;
DROP TABLE IF EXISTS `faber_admin`.`disk_file`;
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
  `del_state` tinyint(1) DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COMMENT='文章-书本';
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
  `del_state` tinyint(1) DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=328 DEFAULT CHARSET=utf8mb4 COMMENT='文章-详情';
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
  `del_state` tinyint(1) DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=362 DEFAULT CHARSET=utf8mb4 COMMENT='文章-大纲';
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
  `del_state` tinyint(1) DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-通用-业务附件';
CREATE TABLE `base_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `buzz_modal` varchar(255) DEFAULT NULL COMMENT '业务模块',
  `type` varchar(255) DEFAULT NULL COMMENT '配置类型',
  `name` varchar(255) DEFAULT NULL COMMENT '配置名称',
  `data` text COMMENT '配置JSON',
  `system` tinyint(1) DEFAULT '0' COMMENT '是否系统',
  `default_scene` tinyint(1) DEFAULT '0' COMMENT '是否默认',
  `hide` tinyint(1) DEFAULT '0' COMMENT '是否隐藏',
  `sort` int(11) DEFAULT NULL COMMENT '排序ID',
  `belong_user_id` varchar(36) DEFAULT NULL COMMENT '所属用户ID',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-系统-配置表';
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
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-部门';
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
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=159 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-字典值';
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
  `del_state` tinyint(1) DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-字典分类';
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
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-用户文件表';
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
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-系统定时任务';
CREATE TABLE `base_job_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `job_id` int(11) NOT NULL COMMENT '任务ID',
  `begin_time` datetime NOT NULL COMMENT '创建时间',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `status` char(1) NOT NULL COMMENT '执行结果：1-执行中/2-成功/9-失败',
  `duration` int(11) unsigned DEFAULT NULL COMMENT '执行花费时间',
  `err_msg` text COMMENT '错误日志',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Demo-学生表';
CREATE TABLE `base_log_api` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '序号',
  `url` text NOT NULL COMMENT '请求URL',
  `method` varchar(10) NOT NULL COMMENT '请求类型',
  `agent` text COMMENT '访问客户端',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-URL请求日志';
CREATE TABLE `base_log_login` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '序号',
  `agent` text COMMENT '访问客户端',
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
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-登录日志';
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
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-消息';
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
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-通知与公告';
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
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-权限表';
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
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-角色表';
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
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=238 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-角色权限对应表';
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
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-用户角色关联表';
CREATE TABLE `base_sms_code` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `phone` varchar(15) NOT NULL COMMENT '手机号',
  `code` varchar(6) NOT NULL COMMENT '短信验证码',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-短信验证码';
CREATE TABLE `base_system_update_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `ver` int(11) NOT NULL COMMENT '版本号',
  `ver_no` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT '版本编码',
  `remark` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '备注信息',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '升级日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-系统版本更新日志表';
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
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-用户';
CREATE TABLE `demo_student` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(255) DEFAULT NULL COMMENT '学生名',
  `age` int(3) DEFAULT NULL COMMENT '年龄',
  `sex` varchar(255) DEFAULT NULL COMMENT '性别',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `valid` tinyint(1) DEFAULT '1' COMMENT '账户是否有效',
  `info_id` int(11) DEFAULT NULL COMMENT '补充信息ID',
  `tenant_id` int(11) DEFAULT NULL COMMENT '租户ID',
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COMMENT='Demo-学生表';
CREATE TABLE `demo_student_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `info1` varchar(255) DEFAULT NULL COMMENT '补充信息1',
  `info2` varchar(255) DEFAULT NULL COMMENT '补充信息2',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COMMENT='Demo-学生表-扩充信息表';
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
  `del_state` enum('0','1') DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COMMENT='云盘/文件夹';
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
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COMMENT='云盘/文件';
BEGIN;
LOCK TABLES `faber_admin`.`article_book` WRITE;
DELETE FROM `faber_admin`.`article_book`;
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`article_detail` WRITE;
DELETE FROM `faber_admin`.`article_detail`;
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`article_outline` WRITE;
DELETE FROM `faber_admin`.`article_outline`;
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`base_biz_file` WRITE;
DELETE FROM `faber_admin`.`base_biz_file`;
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`base_config` WRITE;
DELETE FROM `faber_admin`.`base_config`;
INSERT INTO `faber_admin`.`base_config` (`id`,`buzz_modal`,`type`,`name`,`data`,`system`,`default_scene`,`hide`,`sort`,`belong_user_id`,`crt_time`,`crt_user`,`crt_name`,`crt_host`,`upd_time`,`upd_user`,`upd_name`,`upd_host`,`del_state`) VALUES (5, 'base_log_login', 'QUERY_CONDITION', 'test', '[{\"id\":\"e9b8e1a0-3f98-11ed-99ea-37348a6ccd0b\",\"type\":\"or\",\"condList\":[{\"id\":\"e9b8e1a1-3f98-11ed-99ea-37348a6ccd0b\",\"opr\":\"like\",\"key\":\"id\",\"title\":\"序号\",\"value\":\"11\"},{\"id\":\"034c6d80-3f99-11ed-99ea-37348a6ccd0b\",\"opr\":\"like\",\"key\":\"id\",\"title\":\"序号\",\"value\":\"12\"}]}]', 0, 0, 0, 0, '1', '2022-09-29 10:25:33', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(6, 'base_log_login', 'TABLE_COLUMNS', '表格字段展示配置', '{\"columns\":[{\"dataIndex\":\"id\",\"tcRequired\":false,\"tcChecked\":true,\"width\":70,\"sort\":0},{\"dataIndex\":\"agent\",\"tcChecked\":true,\"sort\":1},{\"dataIndex\":\"pro\",\"tcChecked\":true,\"width\":70,\"sort\":2},{\"dataIndex\":\"city\",\"tcChecked\":true,\"width\":70,\"sort\":3},{\"dataIndex\":\"addr\",\"tcChecked\":true,\"width\":150,\"sort\":4},{\"dataIndex\":\"crtTime\",\"tcChecked\":true,\"width\":170,\"sort\":5},{\"dataIndex\":\"crtUser\",\"width\":120,\"sort\":6},{\"dataIndex\":\"crtName\",\"tcChecked\":false,\"width\":100,\"sort\":7},{\"dataIndex\":\"crtHost\",\"tcChecked\":true,\"width\":150,\"sort\":8},{\"dataIndex\":\"updTime\",\"width\":170,\"sort\":9},{\"dataIndex\":\"updUser\",\"width\":120,\"sort\":10},{\"dataIndex\":\"updName\",\"width\":100,\"sort\":11},{\"dataIndex\":\"updHost\",\"width\":100,\"sort\":12},{\"dataIndex\":\"opr\",\"tcRequired\":true,\"width\":70,\"sort\":13}]}', 0, 0, 0, 0, '1', '2022-10-09 14:14:34', '1', '超级管理员', '114.222.120.65', NULL, NULL, NULL, NULL, 0);
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`base_department` WRITE;
DELETE FROM `faber_admin`.`base_department`;
INSERT INTO `faber_admin`.`base_department` (`id`,`name`,`description`,`parent_id`,`sort`,`type`,`manager_id`,`crt_time`,`crt_user`,`crt_name`,`crt_host`,`upd_time`,`upd_user`,`upd_name`,`upd_host`,`del_state`) VALUES ('1', '办公室', '', '0', 1, NULL, '1', '2020-06-26 16:07:35', '1', 'admin', '123.116.43.116', '2020-06-26 16:07:35', '1', 'admin', '123.116.43.116', 0);
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`base_dict` WRITE;
DELETE FROM `faber_admin`.`base_dict`;
INSERT INTO `faber_admin`.`base_dict` (`id`,`type`,`category`,`text`,`value`,`sort`,`description`,`color`,`crt_time`,`crt_user`,`crt_name`,`crt_host`,`upd_time`,`upd_user`,`upd_name`,`upd_host`,`del_state`) VALUES (9, 6, 0, '男', '1', 1, '', NULL, '2019-08-15 21:57:40', '1', 'admin', '127.0.0.1', '2019-10-30 16:41:57', '1', 'admin', '127.0.0.1', 0),(10, 6, 0, '女', '0', 0, '', NULL, '2019-08-15 21:57:49', '1', 'admin', '127.0.0.1', '2019-10-30 16:42:01', '1', 'admin', '127.0.0.1', 0),(11, 7, 0, '小学', '1', 1, '', NULL, '2019-08-15 21:59:01', '1', 'admin', '127.0.0.1', '2019-08-15 21:59:01', '1', 'admin', '127.0.0.1', 0),(12, 7, 0, '中学', '2', 2, '', NULL, '2019-08-15 21:59:22', '1', 'admin', '127.0.0.1', '2019-08-15 21:59:22', '1', 'admin', '127.0.0.1', 0),(13, 7, 0, '高中', '3', 3, '', NULL, '2019-08-15 21:59:30', '1', 'admin', '127.0.0.1', '2019-08-15 21:59:30', '1', 'admin', '127.0.0.1', 0),(14, 7, 0, '大学', '4', 4, '', NULL, '2019-08-15 21:59:36', '1', 'admin', '127.0.0.1', '2019-08-15 21:59:36', '1', 'admin', '127.0.0.1', 0),(15, 7, 0, '研究生', '5', 5, '', NULL, '2019-08-15 21:59:49', '1', 'admin', '127.0.0.1', '2019-08-15 21:59:49', '1', 'admin', '127.0.0.1', 0),(16, 7, 0, '博士', '6', 6, '', NULL, '2019-08-15 21:59:56', '1', 'admin', '127.0.0.1', '2019-08-15 21:59:56', '1', 'admin', '127.0.0.1', 0),(18, 8, 0, '群众', '1', 1, '', NULL, '2019-08-15 22:02:03', '1', 'admin', '127.0.0.1', '2019-08-15 22:02:03', '1', 'admin', '127.0.0.1', 0),(19, 8, 0, '团员', '2', 2, '', NULL, '2019-08-15 22:02:16', '1', 'admin', '127.0.0.1', '2019-08-15 22:02:16', '1', 'admin', '127.0.0.1', 0),(20, 8, 0, '党员', '3', 3, '', NULL, '2019-08-15 22:02:22', '1', 'admin', '127.0.0.1', '2019-08-15 22:02:22', '1', 'admin', '127.0.0.1', 0),(21, 9, 0, '领导', 'leader', 1, '', NULL, '2019-08-17 09:44:10', '1', 'admin', '127.0.0.1', '2019-08-17 09:44:10', '1', 'admin', '127.0.0.1', 0),(22, 9, 0, '员工', 'member', 2, '', NULL, '2019-08-17 09:44:19', '1', 'admin', '127.0.0.1', '2019-08-17 09:44:19', '1', 'admin', '127.0.0.1', 0),(23, 11, 0, '省', '0', 1, '省/直辖市，省/特区', NULL, '2019-08-21 10:14:07', '1', 'admin', '127.0.0.1', '2019-08-21 10:14:07', '1', 'admin', '127.0.0.1', 0),(24, 11, 0, '市', '1', 2, '市/州，港澳辖区', NULL, '2019-08-21 10:14:43', '1', 'admin', '127.0.0.1', '2019-08-21 10:14:43', '1', 'admin', '127.0.0.1', 0),(25, 11, 0, '县', '2', 3, '县/区，台湾市/县', NULL, '2019-08-21 10:15:14', '1', 'admin', '127.0.0.1', '2019-08-21 10:15:14', '1', 'admin', '127.0.0.1', 0),(26, 11, 0, '乡', '3', 4, '乡/镇，台湾区/镇', NULL, '2019-08-21 10:15:43', '1', 'admin', '127.0.0.1', '2019-08-21 10:15:43', '1', 'admin', '127.0.0.1', 0),(27, 11, 0, '村', '4', 5, '村/社区，台湾街道/村', NULL, '2019-08-21 10:16:08', '1', 'admin', '127.0.0.1', '2019-08-21 10:16:08', '1', 'admin', '127.0.0.1', 0),(29, 13, 0, '有效', '1', 1, '', NULL, '2019-10-30 14:08:45', '1', 'admin', '127.0.0.1', '2019-10-30 14:08:53', '1', 'admin', '127.0.0.1', 0),(30, 13, 0, '冻结', '0', 2, '', NULL, '2019-10-30 14:09:01', '1', 'admin', '127.0.0.1', '2019-10-30 14:09:01', '1', 'admin', '127.0.0.1', 0),(31, 6, 0, '保密', '2', 2, '', NULL, '2019-10-30 15:44:11', '1', 'admin', '127.0.0.1', '2019-10-30 15:44:11', '1', 'admin', '127.0.0.1', 0),(147, 49, 0, '是', '1', 1, NULL, NULL, '2020-11-05 15:21:51', '1', 'admin', '120.243.220.191', '2020-11-05 15:21:51', '1', 'admin', '120.243.220.191', 0),(148, 49, 0, '否', '0', 2, NULL, NULL, '2020-11-05 15:22:02', '1', 'admin', '120.243.220.191', '2020-11-05 15:22:02', '1', 'admin', '120.243.220.191', 0),(155, 54, 0, 'system:title', '后台管理系统', 1, NULL, NULL, '2022-08-10 13:59:17', '1', 'admin', '127.0.0.1', '2022-08-10 13:59:17', '1', 'admin', '127.0.0.1', 0),(156, 54, 1, 'system:logo', 'http://kgcesi.dward.cn/dict/file/dict/202208/logo_20220810152923.png', 2, NULL, NULL, '2022-08-10 15:30:13', '1', 'admin', '127.0.0.1', '2022-08-10 15:30:13', '1', 'admin', '127.0.0.1', 0),(157, 54, 1, 'system:portal:logoWithText', 'http://kgcesi.dward.cn/dict/file/dict/202208/logo_20220810153050.png', 3, NULL, NULL, '2022-08-10 15:30:52', '1', 'admin', '127.0.0.1', '2022-08-10 15:30:52', '1', 'admin', '127.0.0.1', 0),(158, 54, 0, 'system:portal:link', 'http://xxx.xxx.com', 4, NULL, NULL, '2022-08-10 15:31:11', '1', 'admin', '127.0.0.1', '2022-08-10 15:31:11', '1', 'admin', '127.0.0.1', 0);
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`base_dict_type` WRITE;
DELETE FROM `faber_admin`.`base_dict_type`;
INSERT INTO `faber_admin`.`base_dict_type` (`id`,`code`,`name`,`parent_id`,`sort_id`,`description`,`crt_time`,`crt_user`,`crt_name`,`crt_host`,`upd_time`,`upd_user`,`upd_name`,`upd_host`,`del_state`) VALUES (2, 'common', '常用字典', 0, 1, NULL, '2019-08-15 21:03:17', '1', 'admin', '127.0.0.1', '2019-08-15 22:02:42', '1', 'admin', '127.0.0.1', 0),(6, 'common_sex', '性别', 12, 1, NULL, '2019-08-15 21:56:54', '1', 'admin', '127.0.0.1', '2020-06-19 09:50:36', '1', 'admin', '114.242.249.111', 0),(7, 'common_education', '学历', 12, 2, NULL, '2019-08-15 21:58:47', '1', 'admin', '127.0.0.1', '2020-06-19 09:50:45', '1', 'admin', '114.242.249.111', 0),(8, 'common_politics', '政治面貌', 12, 3, NULL, '2019-08-15 22:01:51', '1', 'admin', '127.0.0.1', '2020-06-19 09:50:52', '1', 'admin', '114.242.249.111', 0),(9, 'group_user_type', '分组用户类型', 12, 4, NULL, '2019-08-17 09:43:54', '1', 'admin', '127.0.0.1', '2020-06-19 09:50:59', '1', 'admin', '114.242.249.111', 0),(10, 'common_area', '地区', 2, 1, NULL, '2019-08-21 10:13:03', '1', 'admin', '127.0.0.1', '2020-11-05 15:21:38', '1', 'admin', '120.243.220.191', 0),(11, 'common_area_level', '层级', 10, 1, NULL, '2019-08-21 10:13:38', '1', 'admin', '127.0.0.1', '2019-08-21 10:13:38', '1', 'admin', '127.0.0.1', 0),(12, 'common_user', '账户字典', 2, 0, NULL, '2019-10-30 14:07:45', '1', 'admin', '127.0.0.1', '2019-10-30 14:07:45', '1', 'admin', '127.0.0.1', 0),(13, 'common_user_status', '账户状态', 12, 1, NULL, '2019-10-30 14:08:08', '1', 'admin', '127.0.0.1', '2019-10-30 15:09:06', '1', 'admin', '127.0.0.1', 0),(20, 'sys_file_download', '系统文件下载', 2, 3, '系统文件下载：包括文件模板、常用文件', '2019-11-20 10:38:01', '1', 'admin', '127.0.0.1', '2021-03-25 11:40:35', '1', 'admin', '127.0.0.1', 0),(48, 'base_dict', '基础字典', 2, 2, NULL, '2020-11-05 15:21:23', '1', 'admin', '120.243.220.191', '2020-11-05 15:21:38', '1', 'admin', '120.243.220.191', 0),(49, 'base_dict_bool', '是否', 48, 0, NULL, '2020-11-05 15:21:36', '1', 'admin', '120.243.220.191', '2021-03-25 11:40:35', '1', 'admin', '127.0.0.1', 0),(54, 'system', '系统设置', 0, 100, NULL, '2022-08-10 13:58:21', '1', 'admin', '127.0.0.1', '2022-08-10 13:58:21', '1', 'admin', '127.0.0.1', 0);
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`base_file_save` WRITE;
DELETE FROM `faber_admin`.`base_file_save`;
INSERT INTO `faber_admin`.`base_file_save` (`id`,`name`,`url`,`size`,`drive`,`crt_time`,`crt_user`,`crt_name`,`crt_host`,`upd_time`,`upd_user`,`upd_name`,`upd_host`,`del_state`) VALUES ('fcb6f0e03dcf2d1f18d708aab9dc26b9', 'mceclip0.gif', '/dev/file/2022-10-13/mceclip0_20221013112825.gif', 4967826, 1, '2022-10-13 11:28:25', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`base_job` WRITE;
DELETE FROM `faber_admin`.`base_job`;
INSERT INTO `faber_admin`.`base_job` (`id`,`job_name`,`cron`,`status`,`clazz_path`,`job_desc`,`crt_time`,`crt_user`,`crt_name`,`crt_host`,`upd_time`,`upd_user`,`upd_name`,`upd_host`,`del_state`) VALUES (1, '测试任务1', '0 0/5 * * * ?', 0, 'com.faber.config.quartz.customer.JobDemo1', '测试任务111111', '2022-09-29 15:46:31', '1', 'admin', '127.0.0.1', '2022-09-07 17:22:54', '1', 'admin', '127.0.0.1', 0);
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`base_job_log` WRITE;
DELETE FROM `faber_admin`.`base_job_log`;
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`base_log_api` WRITE;
DELETE FROM `faber_admin`.`base_log_api`;
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`base_log_login` WRITE;
DELETE FROM `faber_admin`.`base_log_login`;
INSERT INTO `faber_admin`.`base_log_login` (`id`,`agent`,`pro`,`city`,`addr`,`crt_time`,`crt_user`,`crt_name`,`crt_host`,`upd_time`,`upd_user`,`upd_name`,`upd_host`,`del_state`) VALUES (1, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '', '', '', '2022-09-27 17:27:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(2, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '', '', '', '2022-09-27 17:28:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(3, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '本地', '本地', '本地', '2022-09-27 17:29:08', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(4, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '本地', '本地', '本地', '2022-09-28 09:21:32', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(5, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '本地', '本地', '本地', '2022-09-28 09:55:42', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(6, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '江苏省', '南京市', '江苏省南京市 电信', '2022-09-28 10:47:39', '1', '超级管理员', '180.109.11.207', NULL, NULL, NULL, NULL, 0),(7, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-28 16:40:03', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(8, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-28 16:41:38', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(9, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-28 16:42:09', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(10, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-28 16:44:25', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(11, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-28 16:44:32', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(12, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-28 16:45:22', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(13, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-28 16:45:32', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(14, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-28 16:45:45', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(15, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '江苏省', '南京市', '江苏省南京市 电信', '2022-09-29 09:32:12', '1', '超级管理员', '180.109.11.207', NULL, NULL, NULL, NULL, 0),(16, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '本地', '本地', '本地', '2022-09-29 11:20:44', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(17, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-29 11:21:40', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(18, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-29 11:22:13', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(19, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-29 11:29:57', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(20, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-29 11:31:06', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(21, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-29 11:31:19', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(22, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-29 11:32:31', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(23, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-29 11:34:11', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(24, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-29 11:35:48', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(25, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-29 11:39:33', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(26, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-29 12:26:13', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(27, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-29 12:26:35', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(28, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-29 12:27:28', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(29, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-29 12:27:41', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(30, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-29 15:04:52', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(31, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-29 15:29:40', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(32, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-29 15:29:59', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(33, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-29 15:32:48', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(34, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '本地', '本地', '本地', '2022-09-29 15:33:30', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(35, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '本地', '本地', '本地', '2022-09-29 15:34:46', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(36, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '本地', '本地', '本地', '2022-09-29 15:37:21', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(37, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '本地', '本地', '本地', '2022-09-29 15:37:40', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(38, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '本地', '本地', '本地', '2022-09-29 15:45:21', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(39, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '本地', '本地', '本地', '2022-09-29 16:15:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(40, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '本地', '本地', '本地', '2022-09-29 16:35:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(41, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '本地', '本地', '本地', '2022-09-29 17:01:59', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(42, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '本地', '本地', '本地', '2022-09-29 17:02:35', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(43, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '本地', '本地', '本地', '2022-09-29 17:34:54', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(44, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-30 10:50:54', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(45, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-30 10:51:05', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(46, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-30 10:56:15', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(47, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-30 10:57:10', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(48, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-30 11:02:27', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(49, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-30 11:06:09', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(50, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-30 11:06:20', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(51, NULL, '本地', '本地', '本地', '2022-09-30 11:28:42', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(52, NULL, '本地', '本地', '本地', '2022-09-30 11:30:17', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(53, NULL, '本地', '本地', '本地', '2022-09-30 11:30:45', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(54, NULL, '本地', '本地', '本地', '2022-09-30 11:31:33', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(55, NULL, '本地', '本地', '本地', '2022-09-30 11:32:40', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(56, NULL, '本地', '本地', '本地', '2022-09-30 11:35:28', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(57, NULL, '本地', '本地', '本地', '2022-09-30 11:35:54', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(58, NULL, '本地', '本地', '本地', '2022-09-30 13:59:45', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(59, NULL, '本地', '本地', '本地', '2022-09-30 14:02:33', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(60, NULL, '本地', '本地', '本地', '2022-09-30 14:13:47', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(61, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-30 14:14:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(62, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-30 14:20:35', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(63, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-30 14:31:06', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(64, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-30 14:31:13', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(65, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-30 14:31:24', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(66, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-09-30 14:33:31', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(67, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '江苏省', '南京市', '江苏省南京市 电信', '2022-09-30 14:47:30', '1', '超级管理员', '180.109.11.207', NULL, NULL, NULL, NULL, 0),(68, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '本地', '本地', '本地', '2022-09-30 14:54:57', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(69, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '本地', '本地', '本地', '2022-09-30 15:10:25', '8129d223a0da896c3cad2001f796c7f4', '测试账户01', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(70, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36', '广东省', '东莞市', '广东省东莞市 移通', '2022-10-04 21:05:23', '1', '超级管理员', '223.74.111.198', NULL, NULL, NULL, NULL, 0),(71, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '江苏省', '南京市', '江苏省南京市 电信', '2022-10-08 09:36:38', '1', '超级管理员', '180.109.11.205', NULL, NULL, NULL, NULL, 0),(72, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '本地', '本地', '本地', '2022-10-08 11:40:07', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(73, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '江苏省', '南京市', '江苏省南京市 电信', '2022-10-08 14:35:10', '1', '超级管理员', '180.109.11.205', NULL, NULL, NULL, NULL, 0),(74, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '江苏省', '南京市', '江苏省南京市 电信', '2022-10-08 14:42:31', '1', '超级管理员', '180.109.11.205', NULL, NULL, NULL, NULL, 0),(75, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-10-08 15:33:04', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(76, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-10-08 15:33:23', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(77, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-10-08 16:24:04', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(78, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-10-08 16:28:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(79, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-10-08 16:28:24', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(80, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-10-08 16:30:49', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(81, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-10-08 16:31:19', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(82, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36', '江苏省', '南京市', '江苏省南京市 电信', '2022-10-08 21:53:10', '1', '超级管理员', '221.231.194.222', NULL, NULL, NULL, NULL, 0),(83, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '江苏省', '南京市', '江苏省南京市 电信', '2022-10-09 09:14:33', '1', '超级管理员', '180.109.11.205', NULL, NULL, NULL, NULL, 0),(84, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '本地', '本地', '本地', '2022-10-09 09:25:03', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(85, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.34', '吉林省', '延边州', '吉林省延边州 联通', '2022-10-09 09:29:31', '1', '超级管理员', '139.208.217.215', NULL, NULL, NULL, NULL, 0),(86, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '江苏省', '南京市', '江苏省南京市 电信', '2022-10-09 14:13:21', '1', '超级管理员', '114.222.120.65', NULL, NULL, NULL, NULL, 0),(87, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '本地', '本地', '本地', '2022-10-09 14:19:57', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(88, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '江苏省', '南京市', '江苏省南京市 电信', '2022-10-10 10:19:29', '1', '超级管理员', '180.110.160.80', NULL, NULL, NULL, NULL, 0),(89, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '本地', '本地', '本地', '2022-10-10 13:59:24', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(90, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36', '', '', ' 克罗地亚', '2022-10-10 18:09:52', '1', '超级管理员', '194.152.247.101', NULL, NULL, NULL, NULL, 0),(91, 'Mozilla/5.0 (Linux; Android 10; MIX 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Mobile Safari/537.36', '浙江省', '杭州市', '浙江省杭州市 联通', '2022-10-11 19:18:33', '1', '超级管理员', '211.90.237.127', NULL, NULL, NULL, NULL, 0),(92, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '本地', '本地', '本地', '2022-10-12 09:46:21', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(93, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '江苏省', '南京市', '江苏省南京市 电信', '2022-10-12 09:47:48', '1', '超级管理员', '180.110.160.80', NULL, NULL, NULL, NULL, 0),(94, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '江苏省', '南京市', '江苏省南京市 电信', '2022-10-12 10:01:47', '1', '超级管理员', '180.110.160.80', NULL, NULL, NULL, NULL, 0),(95, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '本地', '本地', '本地', '2022-10-12 10:46:14', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(96, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '江苏省', '南京市', '江苏省南京市 电信', '2022-10-12 14:48:13', '1', '超级管理员', '180.110.160.80', NULL, NULL, NULL, NULL, 0),(97, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36', '江苏省', '南京市', '江苏省南京市 电信', '2022-10-12 21:48:50', '1', '超级管理员', '221.231.194.222', NULL, NULL, NULL, NULL, 0),(98, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '本地', '本地', '本地', '2022-10-13 09:42:23', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(99, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36', '本地', '本地', '本地', '2022-10-13 09:50:24', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(100, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-10-13 10:47:16', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(101, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-10-13 10:53:02', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(102, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-10-13 10:55:06', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(103, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-10-13 10:57:28', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(104, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-10-13 11:00:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(105, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-10-13 11:00:39', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(106, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-10-13 11:00:52', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(107, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-10-13 11:01:29', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(108, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-10-13 11:02:02', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(109, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-10-13 11:02:07', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(110, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-10-13 11:03:45', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(111, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-10-13 11:20:58', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(112, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-10-13 11:21:07', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(113, 'PostmanRuntime/7.29.2', '本地', '本地', '本地', '2022-10-13 11:21:18', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`base_msg` WRITE;
DELETE FROM `faber_admin`.`base_msg`;
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`base_notice` WRITE;
DELETE FROM `faber_admin`.`base_notice`;
INSERT INTO `faber_admin`.`base_notice` (`id`,`title`,`content`,`status`,`strong_notice`,`crt_time`,`crt_user`,`crt_name`,`crt_host`,`upd_time`,`upd_user`,`upd_name`,`upd_host`,`del_state`) VALUES (1, 'test', 'testtesttesttesttest', 1, 1, '2022-09-25 10:24:32', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`base_rbac_menu` WRITE;
DELETE FROM `faber_admin`.`base_rbac_menu`;
INSERT INTO `faber_admin`.`base_rbac_menu` (`id`,`parent_id`,`name`,`sort`,`level`,`icon`,`status`,`link_type`,`link_url`,`crt_time`,`crt_user`,`crt_name`,`crt_host`,`upd_time`,`upd_user`,`upd_name`,`upd_host`,`del_state`) VALUES (1, 0, '首页', 0, 0, 'fa-solid fa-house', 1, 1, '/admin/home', '2022-09-19 14:35:35', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0),(2, 1, '首页', 0, 2, 'fa-solid fa-house', 1, 1, '/admin/home/home', '2022-09-19 14:59:33', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0),(3, 0, '系统管理', 1, 0, 'fa-solid fa-gear', 1, 1, '/admin/system', '2022-09-19 16:56:23', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0),(4, 3, '智能人事', 0, 1, 'fa-solid fa-users', 1, 1, '/admin/system/hr', '2022-09-19 16:58:28', '1', '超级管理员1', '192.168.1.107', '2022-09-19 20:48:43', '1', '超级管理员1', '192.168.58.1', 0),(5, 3, '系统管理', 1, 1, 'fa-solid fa-gears', 1, 1, '/admin/system/base', '2022-09-19 16:58:56', '1', '超级管理员1', '192.168.1.107', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0),(6, 3, '个人中心', 2, 1, 'fa-solid fa-user', 1, 1, '/admin/system/account', '2022-09-19 16:59:40', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0),(7, 4, '用户管理', 0, 2, '', 1, 1, '/admin/system/hr/user', '2022-09-19 17:02:08', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:43', '1', '超级管理员1', '192.168.58.1', 0),(8, 4, '部门管理', 1, 2, '', 1, 1, '/admin/system/hr/department', '2022-09-19 17:02:30', '1', '超级管理员1', '127.0.0.1', '2022-09-25 09:49:26', '1', '超级管理员1', '192.168.58.1', 1),(9, 4, '角色权限管理', 2, 2, '', 1, 1, '/admin/system/hr/role', '2022-09-19 17:12:26', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:43', '1', '超级管理员1', '192.168.58.1', 0),(10, 5, '菜单管理', 0, 2, NULL, 1, 1, '/admin/system/base/menu', '2022-09-19 17:14:17', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0),(11, 5, '字典管理', 1, 2, NULL, 1, 1, '/admin/system/base/dict', '2022-09-19 17:14:44', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0),(12, 5, '中国地区管理', 2, 2, NULL, 1, 1, '/admin/system/base/area', '2022-09-19 17:15:00', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0),(13, 5, '定时任务', 3, 2, NULL, 1, 1, '/admin/system/base/job', '2022-09-19 17:15:14', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0),(14, 5, '请求日志', 4, 2, NULL, 1, 1, '/admin/system/base/logApi', '2022-09-19 17:15:33', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0),(15, 5, '系统公告', 6, 2, NULL, 1, 1, '/admin/system/base/notice', '2022-09-19 17:16:13', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0),(16, 5, '登录日志', 5, 2, NULL, 1, 1, '/admin/system/base/logLogin', '2022-09-19 17:16:36', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0),(17, 6, '基本信息', 0, 2, NULL, 1, 1, '/admin/system/account/base', '2022-09-19 17:17:05', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0),(18, 6, '更新密码', 1, 2, NULL, 1, 1, '/admin/system/account/security', '2022-09-19 17:17:52', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0),(19, 6, '消息中心', 2, 2, NULL, 1, 1, '/admin/system/account/msg', '2022-09-19 17:18:06', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0),(20, 2, '图标', 0, 2, '', 1, 1, '/admin/home/home/icon', '2022-09-24 20:53:41', '1', '超级管理员1', '192.168.58.1', '2022-09-24 21:56:00', '1', '超级管理员1', '192.168.58.1', 0),(21, 2, '权限测试', 1, 2, NULL, 1, 1, '/admin/home/home/authTest', '2022-09-29 15:57:14', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(22, 21, '权限按钮', 0, 9, NULL, 1, 1, '/admin/home/home/authTest@button1', '2022-09-29 15:59:22', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(23, 1, '通用组件', 1, 1, 'fa-solid fa-cubes', 1, 1, '/admin/home/biz', '2022-10-08 16:08:58', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(24, 23, '地址选择器', 0, 2, NULL, 1, 1, '/admin/home/biz/areaCascader', '2022-10-08 16:09:36', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(25, 23, '富文本编辑器', 1, 2, NULL, 1, 1, '/admin/home/biz/tinymce', '2022-10-12 10:46:49', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`base_rbac_role` WRITE;
DELETE FROM `faber_admin`.`base_rbac_role`;
INSERT INTO `faber_admin`.`base_rbac_role` (`id`,`name`,`remarks`,`status`,`crt_time`,`crt_user`,`crt_name`,`crt_host`,`upd_time`,`upd_user`,`upd_name`,`upd_host`,`del_state`) VALUES (1, '超级管理员', '超级管理员', 1, '2022-09-19 17:34:00', '1', '超级管理员1', '127.0.0.1', '2022-09-19 17:34:14', '1', '超级管理员1', '127.0.0.1', 0),(2, '业务管理员', '业务管理员', 1, '2022-09-28 15:04:59', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`base_rbac_role_menu` WRITE;
DELETE FROM `faber_admin`.`base_rbac_role_menu`;
INSERT INTO `faber_admin`.`base_rbac_role_menu` (`id`,`role_id`,`menu_id`,`half_checked`,`crt_time`,`crt_user`,`crt_name`,`crt_host`,`upd_time`,`upd_user`,`upd_name`,`upd_host`,`del_state`) VALUES (123, 1, 5, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1),(124, 1, 10, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1),(125, 1, 11, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1),(126, 1, 12, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1),(127, 1, 13, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1),(128, 1, 14, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1),(129, 1, 15, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1),(130, 1, 16, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1),(131, 1, 7, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1),(132, 1, 9, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1),(133, 1, 17, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1),(134, 1, 19, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1),(135, 1, 18, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1),(136, 1, 6, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1),(137, 1, 1, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1),(138, 1, 2, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1),(139, 1, 20, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1),(140, 1, 4, 1, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1),(141, 1, 3, 1, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 1),(142, 2, 1, 0, '2022-09-28 15:15:55', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(143, 2, 2, 0, '2022-09-28 15:15:55', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(144, 2, 20, 0, '2022-09-28 15:15:55', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(145, 1, 5, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(146, 1, 10, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(147, 1, 11, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(148, 1, 12, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(149, 1, 13, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(150, 1, 14, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(151, 1, 15, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(152, 1, 16, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(153, 1, 7, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(154, 1, 9, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(155, 1, 17, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(156, 1, 19, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(157, 1, 18, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(158, 1, 6, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(159, 1, 20, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(160, 1, 4, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(161, 1, 3, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(162, 1, 21, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(163, 1, 2, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(164, 1, 1, 0, '2022-09-29 15:57:37', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(165, 1, 5, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(166, 1, 10, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(167, 1, 11, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(168, 1, 12, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(169, 1, 13, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(170, 1, 14, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(171, 1, 15, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(172, 1, 16, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(173, 1, 7, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(174, 1, 9, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(175, 1, 17, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(176, 1, 19, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(177, 1, 18, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(178, 1, 6, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(179, 1, 20, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(180, 1, 4, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(181, 1, 3, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(182, 1, 22, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(183, 1, 21, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(184, 1, 2, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(185, 1, 1, 0, '2022-09-29 16:39:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(186, 2, 20, 0, '2022-09-30 15:10:06', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(187, 2, 21, 0, '2022-09-30 15:10:06', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(188, 2, 22, 0, '2022-09-30 15:10:06', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(189, 2, 2, 0, '2022-09-30 15:10:06', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(190, 2, 1, 0, '2022-09-30 15:10:06', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(191, 1, 5, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(192, 1, 10, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(193, 1, 11, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(194, 1, 12, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(195, 1, 13, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(196, 1, 14, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(197, 1, 15, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(198, 1, 16, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(199, 1, 7, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(200, 1, 9, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(201, 1, 17, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(202, 1, 19, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(203, 1, 18, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(204, 1, 6, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(205, 1, 20, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(206, 1, 4, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(207, 1, 3, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(208, 1, 22, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(209, 1, 21, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(210, 1, 2, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(211, 1, 23, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(212, 1, 24, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(213, 1, 1, 0, '2022-10-08 16:09:50', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 1),(214, 1, 5, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(215, 1, 10, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(216, 1, 11, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(217, 1, 12, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(218, 1, 13, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(219, 1, 14, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(220, 1, 15, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(221, 1, 16, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(222, 1, 7, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(223, 1, 9, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(224, 1, 17, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(225, 1, 19, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(226, 1, 18, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(227, 1, 6, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(228, 1, 20, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(229, 1, 4, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(230, 1, 3, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(231, 1, 22, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(232, 1, 21, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(233, 1, 2, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(234, 1, 23, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(235, 1, 24, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(236, 1, 25, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(237, 1, 1, 0, '2022-10-12 10:47:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`base_rbac_user_role` WRITE;
DELETE FROM `faber_admin`.`base_rbac_user_role`;
INSERT INTO `faber_admin`.`base_rbac_user_role` (`id`,`user_id`,`role_id`,`crt_time`,`crt_user`,`crt_name`,`crt_host`,`upd_time`,`upd_user`,`upd_name`,`upd_host`,`del_state`) VALUES (1, '1', 1, NULL, NULL, NULL, NULL, '2022-09-28 16:04:42', '1', '超级管理员', '127.0.0.1', 1),(6, '1', 1, '2022-09-28 16:04:42', '1', '超级管理员', '127.0.0.1', '2022-09-28 16:22:50', '1', '超级管理员', '127.0.0.1', 1),(7, '1', 2, '2022-09-28 16:04:42', '1', '超级管理员', '127.0.0.1', '2022-09-28 16:22:50', '1', '超级管理员', '127.0.0.1', 1),(8, '1', 1, '2022-09-28 16:22:50', '1', '超级管理员', '127.0.0.1', '2022-09-28 16:22:55', '1', '超级管理员', '127.0.0.1', 1),(9, '1', 2, '2022-09-28 16:22:50', '1', '超级管理员', '127.0.0.1', '2022-09-28 16:22:55', '1', '超级管理员', '127.0.0.1', 1),(10, '1', 1, '2022-09-28 16:22:55', '1', '超级管理员', '127.0.0.1', '2022-09-30 10:33:21', '1', '超级管理员', '127.0.0.1', 1),(11, '1', 2, '2022-09-28 16:22:55', '1', '超级管理员', '127.0.0.1', '2022-09-30 10:33:21', '1', '超级管理员', '127.0.0.1', 1),(12, '1', 1, '2022-09-30 10:33:21', '1', '超级管理员', '127.0.0.1', '2022-09-30 14:56:46', '1', '超级管理员', '127.0.0.1', 1),(13, 'f4af6517b073a51afa2306f1b533c43a', 2, '2022-09-30 14:31:29', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(14, '8129d223a0da896c3cad2001f796c7f4', 2, '2022-09-30 14:56:26', '1', '超级管理员', '127.0.0.1', '2022-10-09 14:20:22', '1', '超级管理员', '127.0.0.1', 1),(15, '1', 1, '2022-09-30 14:56:46', '1', '超级管理员', '127.0.0.1', '2022-10-09 14:15:30', '1', '超级管理员', '114.222.120.65', 1),(16, '1', 1, '2022-10-09 14:15:30', '1', '超级管理员', '114.222.120.65', '2022-10-09 14:15:43', '1', '超级管理员', '114.222.120.65', 1),(17, '1', 2, '2022-10-09 14:15:43', '1', '超级管理员', '114.222.120.65', '2022-10-09 14:15:46', '1', '超级管理员', '114.222.120.65', 1),(18, '1', 2, '2022-10-09 14:15:46', '1', '超级管理员', '114.222.120.65', '2022-10-09 14:15:51', '1', '超级管理员', '114.222.120.65', 1),(19, '1', 1, '2022-10-09 14:15:51', '1', '超级管理员', '114.222.120.65', '2022-10-09 14:20:09', '1', '超级管理员', '127.0.0.1', 1),(20, '1', 1, '2022-10-09 14:20:09', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0),(21, '8129d223a0da896c3cad2001f796c7f4', 1, '2022-10-09 14:20:22', '1', '超级管理员', '127.0.0.1', '2022-10-09 14:20:28', '1', '超级管理员', '127.0.0.1', 1),(22, '8129d223a0da896c3cad2001f796c7f4', 2, '2022-10-09 14:20:28', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`base_sms_code` WRITE;
DELETE FROM `faber_admin`.`base_sms_code`;
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`base_system_update_log` WRITE;
DELETE FROM `faber_admin`.`base_system_update_log`;
INSERT INTO `faber_admin`.`base_system_update_log` (`id`,`ver`,`ver_no`,`remark`,`crt_time`) VALUES (1, 1, 'V1.0.0', '初始化V1.0.0版本', '2022-08-23 10:37:30');
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`base_user` WRITE;
DELETE FROM `faber_admin`.`base_user`;
INSERT INTO `faber_admin`.`base_user` (`id`,`department_id`,`username`,`password`,`name`,`tel`,`birthday`,`sex`,`address`,`email`,`status`,`role_names`,`description`,`img`,`api_token`,`crt_time`,`crt_user`,`crt_name`,`crt_host`,`upd_time`,`upd_user`,`upd_name`,`upd_host`,`del_state`) VALUES ('1', '1', 'admin', '$2a$12$7NC7F4kdFrmqRPnocvDGpuJ392qGz/K4d7GdNbB2CSnn/CDkOAiBC', '超级管理员', '13811112222', '2000-01-01', 1, '南京市、江宁区、将军大道', 'faberxu@gmail.com', 1, '超级管理员', '个人简介', 'http://ztfp-test-file.dward.cn/static/upload/user/img/9362eee0-fd56-11e9-8980-39c97916451b/头像.jpg', 'd1d6e6d1ebcb4437bd082c3046671582', '2022-09-22 21:55:23', '1', 'admin', '127.0.0.1', '2022-08-12 10:49:58', '1', 'admin', '127.0.0.1', 0),('8129d223a0da896c3cad2001f796c7f4', '1', 'test01', '$2a$12$J/H.OFSWxxLFhCLSGiMEN.xGEjdqxBZT9eKMG/aETkhcsmP.D56Yu', '测试账户01', '13800001234', NULL, 2, NULL, NULL, 1, '业务管理员', NULL, NULL, NULL, '2022-09-30 14:56:25', '1', '超级管理员', '127.0.0.1', '2022-10-09 14:20:22', '1', '超级管理员', '127.0.0.1', 0);
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`demo_student` WRITE;
DELETE FROM `faber_admin`.`demo_student`;
INSERT INTO `faber_admin`.`demo_student` (`id`,`name`,`age`,`sex`,`email`,`birthday`,`valid`,`info_id`,`tenant_id`,`crt_time`,`crt_user`,`crt_name`,`crt_host`,`upd_time`,`upd_user`,`upd_name`,`upd_host`,`del_state`) VALUES (1, 'aa', 2, 'male', 'xxx@qq.com', NULL, 1, 1, 1, '2022-09-15 16:33:14', NULL, NULL, NULL, '2022-09-16 15:06:22', '1', 'admin', '127.0.0.1', 1),(2, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 0, NULL, 1, NULL, NULL, NULL, NULL, '2022-09-18 19:21:38', '1', 'admin', '127.0.0.1', 0),(3, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 1, NULL, 1, NULL, NULL, NULL, NULL, '2022-09-18 19:26:02', '1', 'admin', '127.0.0.1', 0),(4, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 1, 3, 1, NULL, NULL, NULL, NULL, '2022-09-18 19:21:38', '1', 'admin', '127.0.0.1', 0),(5, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 1, 4, 1, NULL, NULL, NULL, NULL, '2022-09-18 19:21:38', '1', 'admin', '127.0.0.1', 0),(6, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 1, 5, 1, NULL, NULL, NULL, NULL, '2022-09-18 19:21:38', '1', 'admin', '127.0.0.1', 0),(7, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 1, 6, 1, '2022-09-16 10:52:51', NULL, NULL, NULL, '2022-09-18 19:21:38', '1', 'admin', '127.0.0.1', 0),(8, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 1, 7, 1, '2022-09-16 10:57:49', NULL, NULL, NULL, '2022-09-18 19:21:38', '1', 'admin', '127.0.0.1', 0),(9, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 1, 8, 1, '2022-09-16 11:16:33', '1', 'admin', '127.0.0.1', '2022-09-18 19:21:38', '1', 'admin', '127.0.0.1', 0),(10, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 1, 9, 1, '2022-09-16 11:18:06', '1', 'admin', '127.0.0.1', '2022-09-18 19:21:38', '1', 'admin', '127.0.0.1', 0),(11, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 1, 10, 1, '2022-09-16 11:18:38', '1', 'admin', '127.0.0.1', '2022-09-18 19:21:38', '1', 'admin', '127.0.0.1', 0),(12, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 1, 11, 1, '2022-09-16 11:19:57', NULL, NULL, NULL, '2022-09-18 19:21:38', '1', 'admin', '127.0.0.1', 0),(13, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 1, 12, 1, '2022-09-16 13:36:18', '1', 'admin', '127.0.0.1', '2022-09-18 19:21:38', '1', 'admin', '127.0.0.1', 0),(14, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 1, NULL, 1, '2022-09-16 15:36:55', '1', 'admin', '127.0.0.1', '2022-09-18 19:21:38', '1', 'admin', '127.0.0.1', 0),(15, '张三', 19, 'female', NULL, NULL, 1, NULL, 1, '2022-09-18 20:29:24', '1', 'admin', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`demo_student_info` WRITE;
DELETE FROM `faber_admin`.`demo_student_info`;
INSERT INTO `faber_admin`.`demo_student_info` (`id`,`info1`,`info2`) VALUES (1, '字段1', '字段2'),(2, 'info111', 'info222'),(3, 'info111', 'info222'),(4, 'info111', 'info222'),(5, 'info111', 'info222'),(6, 'info111', 'info222'),(7, 'info111', 'info222'),(8, 'info111', 'info222'),(9, 'info111', 'info222'),(10, 'info111', 'info222'),(11, 'info111', 'info222'),(12, 'info111', 'info222');
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`disk_dir` WRITE;
DELETE FROM `faber_admin`.`disk_dir`;
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `faber_admin`.`disk_file` WRITE;
DELETE FROM `faber_admin`.`disk_file`;
UNLOCK TABLES;
COMMIT;
