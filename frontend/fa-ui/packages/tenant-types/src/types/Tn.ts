import { Fa, FaEnums } from '@fa/ui';
import TnEnums from './TnEnums'

namespace Tn {
  /** 租户-租户表 */
  export interface Tenant extends Fa.BaseDelEntity {
    /** ID */
    id: string;
    /** 租户名称 */
    name: string;
    /** 租户状态[1-正常2-停用] */
    status: TnEnums.TenantStatusEnum;
    /** 所属用户ID */
    ownerId: string;
    /** 所属用户 */
    ownerName: string;
    /** 所属用户 */
    owner: TenantUser;
  }

  /** 租户-用户表 */
  export interface TenantUser extends Fa.BaseDelEntity {
    /** ID */
    id: string;
    /** 名称 */
    name: string;
    /** 状态[1-正常2-停用] */
    status: TnEnums.TenantStatusEnum;
    /** 手机号 */
    tel: string;
    /** 密码 */
    password: string;
    /** 当前选择的企业ID */
    corpId: string;
    /** 租户ID */
    tenantId: string;
    /** 当前选择的企业ID */
    corpName: string;
    /** 租户ID */
    tenantName: string;
  }

  /** 租户-企业表 */
  export interface TenantCorp extends Fa.BaseDelEntity {
    /** ID */
    id: string;
    /** 名称 */
    name: string;
    /** 状态[1-正常2-停用] */
    status: TnEnums.TenantStatusEnum;
    /** 企业微信ID */
    wxCorpId: string;
    /** 第三方服务商企业id */
    openWxCorpId: string;
    /** 永久授权码 */
    permanentCode: string;
    /** 企业代码(企业统一社会信用代码) */
    socialCode: string;
    /** 企业通讯录secret */
    employeeSecret: string;
    /** 事件回调地址 */
    eventCallback: string;
    /** 企业外部联系人secret */
    contactSecret: string;
    /** 回调token */
    token: string;
    /** 回调消息加密串 */
    encodingAesKey: string;
    /** 授权类型 1-内部开发+自建应用 2-内部开发+自建应用代开发 3-第三方应用授权+自建应用代开发 4代开发应用 */
    authType: string;
    /** 代开发-通讯录编辑-永久授权码 */
    contactEditPermanentCode: string;
    /** 授权方企业圆形头像 */
    corpRoundLogoUrl: string;
    /** 授权方企业方形头像 */
    corpSquareLogoUrl: string;
    /** 企业类型，1. 企业; 2. 政府以及事业单位; 3. 其他组织, 4.团队号 */
    subjectType: number;
    /** 租户ID */
    tenantId: string;
    /** 租户ID */
    tenantName: string;
  }

  /** 租户-企业应用表 */
  export interface TenantCorpAgent extends Fa.BaseDelEntity {
    /** ID */
    id: string;
    /** 状态[1-正常2-停用] */
    status: TnEnums.TenantStatusEnum;
    /** 开发模板套件ID */
    suiteId: string;
    /** 微信应用ID */
    wxAgentId: string;
    /** 微信应用secret */
    wxSecret: string;
    /** 应用名称 */
    name: string;
    /** 应用方形头像 */
    squareLogoUrl: string;
    /** 应用详情 */
    description: string;
    /** 应用是否被停用 0否1是 */
    close: boolean;
    /** 应用可信域名 */
    redirectDomain: string;
    /** 应用是否打开地理位置上报 0：不上报；1：进入会话上报； */
    reportLocationFlag: boolean;
    /** 是否上报用户进入应用事件。0：不接收；1：接收 */
    isReportenter: boolean;
    /** 应用主页url */
    homeUrl: string;
    /** 应用类型 1-侧边栏 2-应用提醒 3-工作台 */
    type: number;
    /** 是否自建应用代开发 0 - 不是 1-是 */
    isCustomizedApp: boolean;
    /** 应用权限信息 */
    privilege: string;
    /** 代开发应用发布状态 1：未上线；2：已上线 */
    customizedPublishStatus: boolean;
    /** 企业ID */
    corpId: string;
    /** 租户ID */
    tenantId: string;
  }

  /** 租户-企业用户表 */
  export interface TenantCorpUser extends Fa.TnBaseDelEntity {
    /** ID */
    id: string;
    /** 租户用户ID */
    userId: string;
    /** 状态[1-正常2-停用] */
    status: TnEnums.TenantStatusEnum;
  }

  /** 租户-URL请求日志 */
  export interface TenantLogApi extends Fa.TnBaseDelEntity {
    /** ID */
    id: string;
    /** 模块 */
    biz: string;
    /** 操作 */
    opr: string;
    /** CRUD类型 */
    crud: FaEnums.LogCrudEnum;
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
    /** 客户端来源 */
    faFrom: string;
    /** 客户端版本号 */
    versionCode: string;
    /** 客户端版本名 */
    versionName: string;
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
    /** 企业名称 */
    corpName: string;
    /** 租户名称 */
    tenantName: string;
  }

  /** 租户-登录日志 */
  export interface TenantLogLogin extends Fa.TnBaseDelEntity {
    /** ID */
    id: string;
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
    /** 企业名称 */
    corpName: string;
    /** 租户名称 */
    tenantName: string;
  }

  export interface TenantConfig {
    tenantName: string;
    logo: string;
    title: string;
  }


  /** SCRM-企业通讯录 */
  export interface CpEmployee extends Fa.TnBaseDelEntity {
    /**  */
    id: string;
    /** wx.userId */
    wxUserId: string;
    /** 名称 */
    name: string;
    /** 手机号 */
    mobile: string;
    /** 职位信息 */
    position: string;
    /** 性别。0表示未定义，1表示男性，2表示女性 */
    gender: number;
    /** 邮箱 */
    email: string;
    /** 头像url */
    avatar: string;
    /** 头像缩略图 */
    thumbAvatar: string;
    /** 座机 */
    telephone: string;
    /** 别名 */
    alias: string;
    /** 扩展属性 */
    extattr: string;
    /** 激活状态: 1=已激活，2=已禁用，4=未激活，5=退出企业 */
    status: number;
    /** 员工二维码 */
    qrCode: string;
    /** 员工对外属性 */
    externalProfile: string;
    /** 员工对外职位 */
    externalPosition: string;
    /** 地址 */
    address: string;
    /** 全局唯一id */
    openUserId: string;
    /** 微信端主部门ID */
    wxMainDepartmentId: string;
    /** 主部门id(tn_cp_department.id) */
    mainDepartmentId: string;
    /** 子账户ID(tn_tenant_user.id) */
    logUserId: string;
    /** 是否配置外部联系人权限（1.是 2.否） */
    contactAuth: boolean;
    /** 存档状态（0：未开通，1：已开通） */
    auditStatus: boolean;
    /** 权限状态（1：正常，3：未开通） */
    authStatus: boolean;
  }

  /** SCRM-(通讯录 - 标签)中间表 */
  export interface CpEmployeeTagPivot extends Fa.TnBaseDelEntity {
    /**  */
    id: string;
    /** 通讯录员工ID */
    employeeId: string;
    /** wx标签ID */
    tagId: string;
  }

  /** SCRM-(通讯录)标签 */
  export interface CpEmployeeTag extends Fa.TnBaseDelEntity {
    /** id */
    id: string;
    /** 微信通许录标签 id */
    wxTagid: string;
    /** 标签名称 */
    tagName: string;
  }

  /** SCRM-成员统计表 */
  export interface CpEmployeeStatistic extends Fa.TnBaseDelEntity {
    /**  */
    id: string;
    /** 成员id (mc_work_employee.id) */
    employeeId: number;
    /** 发起申请数成员通过「搜索手机号」、「扫一扫」、「从微信好友中添加」、「从群聊中添加」、「添加共享、分配给我的客户」、「添加单向、双向删除好友关系的好友」、「从新的联系人推荐中添加」等渠道主动向客户发起的好友申请数量 */
    newApplyCnt: number;
    /** 新增客户数 */
    newContactCnt: number;
    /** 聊天总数 */
    chatCnt: number;
    /** 发送消息数 */
    messageCnt: number;
    /** 已回复聊天占比 */
    replyPercentage: number;
    /** 平均首次回复时长 */
    avgReplyTime: number;
    /** 删除/拉黑成员的客户数 */
    negativeFeedbackCnt: number;
    /** 同步时间 */
    synTime: string;
  }

  /** SCRM-(通讯录-通讯录部门)中间表 */
  export interface CpEmployeeDepartment extends Fa.TnBaseDelEntity {
    /**  */
    id: string;
    /** 通讯录员工(mc_work_department.id) */
    employeeId: string;
    /** 通讯录部门ID (mc_work_department.id) */
    departmentId: string;
    /** 所在的部门内是否为上级 */
    isLeaderInDept: number;
    /** 排序 */
    sort: number;
  }

  /** SCRM-(通讯录)部门管理 */
  export interface CpDepartment extends Fa.TnBaseDelEntity {
    /** 部门ID */
    id: string;
    /** 微信部门自增ID */
    wxDepartmentId: string;
    /** 部门名称 */
    name: string;
    /** 部门名称EN */
    enName: string;
    /** 父部门ID */
    parentId: string;
    /** 微信父部门ID */
    wxParentid: string;
    /** 排序 */
    wxOrder: number;
    /** 部门级别 */
    level: number;
    /** 父ID路径【#id#-#id#】 */
    path: string;
  }

  export interface TnAgentPublishVo {
    agentId: string,
    wxAgentId: number,
    publishStatus: TnEnums.PublishStatusEnum,
  }

}

export default Tn;
