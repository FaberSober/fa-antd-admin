import Fa from '@/props/base/Fa';
import FaEnums from "@/props/base/FaEnums";
import {FaberTable} from "@/components/base-table";
import ConditionQuery from "@/components/condition-query/interface";

namespace Admin {
	// -------------------------------------------- 系统-配置表 --------------------------------------------
	/**
	 * 配置-查询场景
	 */
	export interface ConfigScene extends Fa.BaseDelEntity {
		/** ID */
		id: number;
		/** 业务模块 */
		biz: string;
		/** 配置名称 */
		name: string;
		/** 配置JSON */
		data: ConditionQuery.CondGroup[];
		/** 是否系统 */
		defaultScene: boolean;
		/** 是否默认 */
		hide: boolean;
    /** 是否系统默认 */
    system: boolean;
		/** 排序ID */
		sort: number;
	}

  /**
   * 配置-通用
   */
  export interface Config<T> extends Fa.BaseDelEntity {
    /** ID */
    id: number;
    /** 业务模块 */
    biz: string;
    /** 配置类型 */
    type: FaEnums.ConfigType;
    /** 配置JSON */
    data: T;
  }

  /**
   * 配置-查询场景
   */
  export interface ConfigSys extends Fa.BaseDelEntity {
    /** ID */
    id: number;
    /** 配置JSON */
    data: ConfigSysConfig;
  }

  export interface ConfigSysConfig {
    title: string;
    subTitle: string;
    logo: string;
    logoWithText: string;
    portalLink: string;
  }

	// -------------------------------------------- 系统-字典值 --------------------------------------------
	/** 字典分类 */
	export interface Dict extends Fa.BaseDelEntity {
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
    /** options */
		options: Option[];
	}

	export interface Option {
    /** ID */
    id: number;
    /** 字典值 */
    value: string;
    /** 字典文本 */
    label: string;
    /** 删除状态 */
    deleted?: boolean;
  }


	// -------------------------------------------- 系统-中国行政地区表 --------------------------------------------

	/** 中国行政地区表 */
	export interface Area extends Fa.BaseDelEntity {
		/** ID */
		id: number;
		/** 层级 */
		level: FaEnums.AreaLevel;
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
		type: FaEnums.DepartmentType;
		/** 负责人ID  */
		managerId: string;
	}

	export interface DepartmentVo extends Department {
		/** 负责人  */
		manager?: User;
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
		status: boolean;
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


	// -------------------------------------------- 系统-上传文件 --------------------------------------------
	export interface FileSave extends Fa.BaseDelEntity {
		/** ID */
		id: string;
		name: string;
		url: string;
    localUrl: string;
		size: number;
		drive: FaEnums.FileSaveDriveEnum;
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
		status: boolean;
		/** 是否强提醒  */
		strongNotice: boolean;
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
		status: boolean;
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
		isRead: boolean;
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
    /** [网站]副标题 */
    subTitle: string;
    /** [网站]logo */
		logo: string;
    /** [网站]logo带文字 */
		logoWithText: string;
		/** [官网]地址 */
		portalLink: string;
		/** [Web]redis web管理页面地址 */
    phpRedisAdmin: string;
    /** [Web]SocketIO服务地址 */
    socketUrl: string;
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
    /** 操作系统 */
    os: string;
    /** 浏览器 */
    browser: string;
    /** 浏览器版本 */
    version: string;
    /** 是否为移动终端 */
    mobile: boolean;
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
    /** 操作系统 */
    os: string;
    /** 浏览器 */
    browser: string;
    /** 浏览器版本 */
    version: string;
    /** 是否为移动终端 */
    mobile: boolean;
    /** 省 */
    pro: string;
    /** 市 */
    city: string;
    /** 地址 */
    addr: string;
  }

  // -------------------------------------------- 系统-实体变更日志 --------------------------------------------
  /** BASE- 实体变更日志 */
  export interface EntityLog extends Fa.BaseCrtEntity {
    /** ID */
    id: number;
    /** 业务类型 */
    bizType: string;
    /** 业务ID */
    bizId: string;
    /** 动作1新增/2更新/3删除 */
    action: FaEnums.EntityLogActionEnum;
    /** 动作内容 */
    content: string;
  }

  // -------------------------------------------- 系统-server info --------------------------------------------
  export interface ServerInfo {
    cpuInfo: {
      cpuNum: number,
      free: number,
      used: number,
    },
    memory: {
      available: number,
      total: number,
    },
    system: {
      model: string,
      manufacturer: string,
    },
  }

}

export default Admin;
