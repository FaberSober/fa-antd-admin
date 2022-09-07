import FaberBase from '@/props/base/FaberBase';

namespace Admin {
	// -------------------------------------------- 系统-配置表 --------------------------------------------
	export enum ConfigType {
		/** 表格字段配置 */
		TABLE_COLUMNS = 'TABLE_COLUMNS',
		/** 查询条件 */
		QUERY_CONDITION = 'QUERY_CONDITION',
	}

	/**
	 * 系统-配置表
	 */
	export interface Config extends FaberBase.BaseDelEntity {
		/** ID */
		id: number;
		/** 业务模块 */
		buzzModal: string;
		/** 配置类型 */
		type: ConfigType;
		/** 配置名称 */
		name: string;
		/** 配置JSON */
		data: string;
		/** 是否系统 */
		defaultScene: string;
		/** 是否默认 */
		hide: string;
		/** 排序ID */
		sort: number;
		/** 所属用户ID */
		belongUserId: string;
		/** 是否系统默认 */
		system: string;
	}

	// -------------------------------------------- 系统-菜单模块 --------------------------------------------
	/** BASE-菜单模块 */
	export interface MenuBlock extends FaberBase.BaseDelEntity {
		/** ID */
		id: number;
		/** 模块名称 */
		name: string;
		/** 模块编码 */
		no: string;
		/** 排序 */
		sort: string;
	}

	// -------------------------------------------- 系统-菜单 --------------------------------------------
	export interface Menu extends FaberBase.BaseDelEntity {
		id: number;
		/** 所属模块ID */
		blockId: number;
		code: string;
		title: string;
		parentId: number;
		href: string;
		icon: string;
		type: string;
		description: string;
		path: string;
		orderNum: number;
	}

	// -------------------------------------------- 系统-页面元素权限点 --------------------------------------------
	export interface Element extends FaberBase.BaseDelEntity {
		/** ID */
		id: number;
		/** 所属模块ID */
		blockId: number;
		/** 资源编码 */
		code: string;
		/** 资源类型 */
		type: string;
		/** 资源名称 */
		name: string;
		/** 资源路径 */
		uri: string;
		/** 资源关联菜单 */
		menuId: string;
		/** 父权限ID */
		parentId: string;
		/** 资源树状检索路径 */
		path: string;
		/** 资源请求类型 */
		method: string;
		/** 描述 */
		description: string;
	}

	export interface ElementWebVO extends Element {
		menu: Menu;
	}

	// -------------------------------------------- 系统-字典值 --------------------------------------------
	/** 字典分类 */
	export interface DictType extends FaberBase.BaseDelEntity {
		/** ID */
		id: number;
		/** 编码 */
		code: string;
		/** 名称 */
		name: string;
		/** 上级节点 */
		parentId: number;
		/** 排序ID */
		sortId: number;
		/** 描述 */
		description: string;
	}

	/** 字典值 */
	export interface Dict extends FaberBase.BaseDelEntity {
		/** ID */
		id: number;
		/** 字典分组 */
		type: string;
		/** 字典类型：0-文本/1-文件 */
		category: number;
		/** 字典文本 */
		text: string;
		/** 字典值 */
		value: string;
		/** 颜色值 */
		color: string;
		/** 排序 */
		sort: number;
		/** 描述 */
		description: string;
	}

	export interface DictWebVO extends Dict {
		dictType?: DictType;
	}

	// -------------------------------------------- 系统-中国行政地区表 --------------------------------------------
	export enum AreaLevel {
		NATION = -1,
		PROVINCE = 0,
		CITY = 1,
		COUNTY = 2,
		COUNTRY = 3,
		VILLAGE = 4,
	}

	/** 中国行政地区表 */
	export interface Area extends FaberBase.BaseDelEntity {
		/** ID */
		id: number;
		/** 层级 */
		level: AreaLevel;
		/** 父级行政代码 */
		parentCode: number;
		/** 行政代码 */
		areaCode: number;
		/** 邮政编码 */
		zipCode: number;
		/** 区号 */
		cityCode: number;
		/** 名称 */
		name: string;
		/** 简称 */
		shortName: string;
		/** 组合名 */
		mergerName: string;
		/** 拼音 */
		pinyin: string;
		/** 经度 */
		lng: number;
		/** 纬度 */
		lat: number;
	}

	// -------------------------------------------- 系统-部门 --------------------------------------------
	export enum DepartmentType {
		CORP = 'CORP',
		DEPT = 'DEPT',
		TEAM = 'TEAM',
	}

	export interface Department extends FaberBase.BaseDelEntity {
		/** ID */
		id: string;
		/** 上级节点 */
		parentId: string;
		/** 名称 */
		name: string;
		/** 描述 */
		description: string;
		/** 排序ID */
		sortId: number;
		/** 类型  */
		type: DepartmentType;
		/** 负责人ID  */
		managerId: string;
	}

	export interface DepartmentPageVo extends Department {
		/** 负责人  */
		manager?: UserInfo;
	}

	// -------------------------------------------- 系统-用户 --------------------------------------------
	/** 用户 */
	export interface User extends FaberBase.BaseDelEntity {
		/**  */
		id: string;
		/** 部门ID  */
		departmentId: string;
		/** 账户  */
		username: string;
		/** 密码  */
		password: string;
		/** 姓名  */
		name: string;
		/** 生日  */
		birthday: string;
		/** 地址  */
		address: string;
		/** 经度 */
		lng: number;
		/** 纬度 */
		lat: number;
		/** 手机号  */
		mobilePhone: string;
		/**   */
		telPhone: string;
		/** 邮箱  */
		email: string;
		/** 性别  */
		sex: string;
		/** 类型  */
		type: string;
		/** 状态：1-有效/2-锁定  */
		status: string;
		/** 描述  */
		description: string;
		/** 头像URL  */
		img: string;
		/** api token  */
		apiToken: string;
	}

	export interface UserWeb extends User {
		/** 部门名称  */
		departmentName: string;
		/** 职位名称  */
		postName: string;
		/** 角色名称  */
		roleNames: string;
	}

	/** 用户 */
	export interface UserInfo {
		id: string;
		username: string;
		name: string;
		description: string;
		img: string;
		departmentId: string;
	}

	// -------------------------------------------- 系统-角色组 --------------------------------------------
	export interface Group extends FaberBase.BaseDelEntity {
		/** ID */
		id: number;
		/** 编码 */
		code: string;
		/** 名称 */
		name: string;
		/** 描述 */
		description: string;
		/** 上级节点 */
		parentId: number;
		/** 排序ID */
		sortId: number;
		/** 角色组 */
		groupType: number;
	}

	// -------------------------------------------- 系统-角色用户 --------------------------------------------
	export interface GroupUser extends FaberBase.BaseDelEntity {
		/** ID */
		id: number;
		/** 角色ID */
		groupId: number;
		/** 用户ID */
		userId: string;
		/** 描述 */
		description: string;
		/** 类型 */
		type: string;
	}

	export interface GroupUserVo extends GroupUser {
		/** 类型名称 */
		typeName: string;
		name: string;
		username: string;
		mobilePhone: string;
		email: string;
	}

	// -------------------------------------------- 系统-上传文件 --------------------------------------------
	export interface FileSave extends FaberBase.BaseDelEntity {
		/** ID */
		id: string;
		name: string;
		url: string;
		size: number;
	}

	export enum AuthorityType {
		GROUP = 'group',
	}

	export enum ResourceType {
		MENU = 'menu',
		BUTTON = 'button',
	}

	export interface ResourceAuthority {
		id: number;
		/** 授权ID */
		authorityId: string;
		authorityType: Admin.AuthorityType;
		/** 资源ID */
		resourceId: string;
		resourceType: Admin.ResourceType;
	}

	// -------------------------------------------- 系统-通知与公告 --------------------------------------------
	/** BASE-通知与公告 */
	export interface Notice extends FaberBase.BaseDelEntity {
		/** ID */
		id: number;
		/** 标题  */
		title: string;
		/** 内容  */
		content: string;
		/** 状态：1-有效、0-失效  */
		status: FaberBase.TrueOrFalse;
		/** 是否强提醒  */
		strongNotice: FaberBase.TrueOrFalse;
	}

	// -------------------------------------------- 系统-消息 --------------------------------------------
	/** Base-消息 */
	export interface Msg extends FaberBase.BaseDelEntity {
		/** ID */
		id: number;
		/** 消息来源用户ID  */
		fromUserId: string;
		/** 接收用户ID  */
		toUserId: string;
		/** 消息内容  */
		content: string;
		/** 是否已读  */
		isRead: string;
		/** 已读时间  */
		readTime: string;
		/** 业务类型  */
		buzzType: string;
		/** 业务ID  */
		buzzId: string;
	}

	// -------------------------------------------- 系统-系统定时任务 --------------------------------------------
	/** 系统定时任务 */
	export interface Job extends FaberBase.BaseDelEntity {
		/**  */
		id: number;
		/** 任务名称  */
		jobName: string;
		/** cron表达式  */
		cron: string;
		/** 状态:0未启动false/1启动true  */
		status: string;
		/** 任务执行方法  */
		clazzPath: string;
		/** 任务描述  */
		jobDesc: string;
	}

	export enum JOB_LOG_STATUS {
	  DOING   = '1', // 执行中
    DONE    = '2', // 成功
	  ERROR   = '9', // 失败
  }

  export const JOB_LOG_STATUS_MAP = {
	  [JOB_LOG_STATUS.DOING]: '执行中',
	  [JOB_LOG_STATUS.DONE]: '成功',
	  [JOB_LOG_STATUS.ERROR]: '失败',
  }

  /** BASE-系统定时任务-执行日志 */
  export interface JobLog {
    /** ID */
    id: number;
    /** 任务ID */
    jobId: string;
    /** 执行结果：1-执行中/2-成功/9-失败 */
    status: JOB_LOG_STATUS;
    /** 执行花费时间 */
    duration: number;
    /** 错误日志 */
    errMsg?: string;
    /** 创建时间 */
    beginTime?: string;
    /** 创建时间 */
    endTime?: string;
  }

	// -------------------------------------------- 系统-系统定时任务 --------------------------------------------
	export enum BizFileBizType {
		ILLEGAL_CAPTURE = 'ILLEGAL_CAPTURE', // 违章抓拍记录
	}

	/** 通用-业务附件 */
	export interface BizFile extends FaberBase.BaseDelEntity {
		id: number;
		/** 业务ID */
		bizId: string;
		/** 业务类型 */
		bizType: BizFileBizType;
		/** 附件URL */
		url: string;
	}

	export enum ArticleStatus {
		DRAFT = 1, // 待发起
		PUBLISH = 2, // 已发起
	}

	export interface Article extends FaberBase.BaseDelEntity {
		id: number;
		/** 业务ID */
		bizId: string;
		/** 业务类型 */
		bizType: string;
		/** 标题 */
		title: string;
		/** html文本 */
		detail: string;
		/** html文本 */
		articleStatus: ArticleStatus;
	}

	// -------------------------------------------- 系统-消息 --------------------------------------------
	/** Base-消息 */
	export interface Msg extends FaberBase.BaseDelEntity {
		/** ID */
		id: number;
		/** 消息来源用户ID  */
		fromUserId: string;
		/** 接收用户ID  */
		toUserId: string;
		/** 消息内容  */
		content: string;
		/** 是否已读  */
		isRead: string;
		/** 已读时间  */
		readTime: string;
		/** 业务类型  */
		buzzType: string;
		/** 业务ID  */
		buzzId: string;
	}

	export interface MsgPageVo extends Msg {
		/** 业务类型名称  */
		buzzName?: string;
		fromUser?: FaberBase.UserInfo;
		toUser?: FaberBase.UserInfo;
	}

	// -------------------------------------------- 系统-角色分组 --------------------------------------------
	export interface GroupType extends FaberBase.BaseDelEntity {
		/** ID */
		id: number;
		/** 编码 */
		code: string;
		/** 名称 */
		name: string;
		/** 描述 */
		description: string;
	}

	export enum GroupTypeEnums {
		INNER = 1, // 内业
		OUTER = 2, // 外业
	}

	// -------------------------------------------- 系统配置参数 --------------------------------------------
	export interface SystemConfigPo {
    /** [网站]标题 */
		title: string;
    /** [网站]logo */
		logo: string;
    /** [网站]logo带文字 */
		logoWithText: string;
		/** [官网]地址 */
		portalLink: string;
	}
}

export default Admin;
