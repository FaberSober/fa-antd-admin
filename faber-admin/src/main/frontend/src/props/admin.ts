import Fa from '@/props/base/Fa';
import FaEnums from "@/props/base/FaEnums";

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
	export interface Config extends Fa.BaseDelEntity {
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

	// -------------------------------------------- 系统-字典值 --------------------------------------------
	/** 字典分类 */
	export interface DictType extends Fa.BaseDelEntity {
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
	export interface Dict extends Fa.BaseDelEntity {
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
	export interface Area extends Fa.BaseDelEntity {
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

	export interface Department extends Fa.BaseDelEntity {
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
	export interface User extends Fa.BaseDelEntity {
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
		/** 手机号  */
		tel: string;
		/** 邮箱  */
		email: string;
		/** 性别  */
		sex: FaEnums.SexEnum;
		/** 状态是否有效  */
		status: FaEnums.BoolEnum;
		/** 描述  */
    roleNames: string;
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


	// -------------------------------------------- 系统-上传文件 --------------------------------------------
	export interface FileSave extends Fa.BaseDelEntity {
		/** ID */
		id: string;
		name: string;
		url: string;
		size: number;
	}

	// -------------------------------------------- 系统-通知与公告 --------------------------------------------
	/** BASE-通知与公告 */
	export interface Notice extends Fa.BaseDelEntity {
		/** ID */
		id: number;
		/** 标题  */
		title: string;
		/** 内容  */
		content: string;
		/** 是否有效  */
		status: FaEnums.BoolEnum;
		/** 是否强提醒  */
		strongNotice: FaEnums.BoolEnum;
	}

	// -------------------------------------------- 系统-系统定时任务 --------------------------------------------
	/** 系统定时任务 */
	export interface Job extends Fa.BaseDelEntity {
		/**  */
		id: number;
		/** 任务名称  */
		jobName: string;
		/** cron表达式  */
		cron: string;
		/** 是否启动  */
		status: FaEnums.BoolEnum;
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
	export interface BizFile extends Fa.BaseDelEntity {
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

	export interface Article extends Fa.BaseDelEntity {
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
	export interface Msg extends Fa.BaseDelEntity {
		/** ID */
		id: string;
		/** 来源用户  */
    fromUserName: string;
		/** 来源用户ID  */
		fromUserId: string;
		/** 接收用户  */
		toUserName: string;
		/** 接收用户ID  */
		toUserId: string;
		/** 消息内容  */
		content: string;
		/** 是否已读  */
		isRead: FaEnums.BoolEnum;
		/** 已读时间  */
		readTime: string;
		/** 业务类型  */
		buzzType: string;
		/** 业务ID  */
		buzzId: string;
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

  // -------------------------------------------- 系统-URL请求日志 --------------------------------------------
  /** BASE-URL请求日志 */
  export interface LogApi extends Fa.BaseCrtEntity {
    /** 序号 */
    id: string;
    /** 请求URL */
    url: string;
    /** 请求类型 */
    method: string;
    /** 访问客户端 */
    agent: string;
    /** 请求花费时间 */
    duration: number;
    /** 省 */
    pro: string;
    /** 市 */
    city: string;
    /** 地址 */
    addr: string;
    /** 请求内容 */
    request: string;
    /** 请求体大小 */
    reqSize: number;
    /** 返回内容 */
    response: string;
    /** 返回内容大小 */
    retSize: number;
    /** 返回码 */
    retStatus: string;
  }

  // -------------------------------------------- 系统-登录日志 --------------------------------------------
  /** BASE-登录日志 */
  export interface LogLogin extends Fa.BaseDelEntity {
    /** 序号 */
    id: number;
    /** 访问客户端 */
    agent: string;
    /** 省 */
    pro: string;
    /** 市 */
    city: string;
    /** 地址 */
    addr: string;
  }

}

export default Admin;
