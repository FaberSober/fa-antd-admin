import type { ConditionQuery, Fa, FaEnums } from '@fa/ui';

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
  export interface Config<T = any> extends Fa.BaseDelEntity {
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
    /** 网站标题 */
    title: string;
    /** [网站]标题 */
    titleColor: string;
    /** [网站]副标题 */
    subTitle: string;
    /** [网站]版权信息 */
    cop: string;
    /** [网站]版权信息 */
    copColor: string;
    /** [网站]登录背景图 */
    loginBg: string;
    /** 登录页面样式 */
    loginPageType: string;
    /** 顶部菜单条样式 */
    topMenuBarStyle: string;
    /** [网站]logo */
    logo: string;
    /** [网站]logo带文字 */
    logoWithText: string;
    /** [网站]微信小程序 */
    wxminiapp: string;
    /** [官网]地址 */
    portalLink: string;
    /** [Web]redis web管理页面地址 */
    phpRedisAdmin: string;
    /** [Web]SocketIO服务地址 */
    socketUrl: string;
    /** [存储]当前激活存储 */
    storeActive: string;
    /** [存储][本地]目录 */
    storeLocalPath: string;
    /** ------------------------- [存储][Minio] -------------------------  */
    minioAk: string;
    minioSk: string;
    minioEndPoint: string;
    minioBucketName: string;
    minioDomain: string;
    minioBasePath: string;
    /** ------------------------- [存储][七牛云] -------------------------  */
    qiniuAk: string;
    qiniuSk: string;
    qiniuBucketName: string;
    qiniuDomain: string;
    qiniuBasePath: string;
    /** ------------------------- [存储]End -------------------------  */
    /** [安全]是否开启验证码 */
    safeCaptchaOn: boolean;
    /** [安全]密码类型 */
    safePasswordType: FaEnums.ConfigSysSafePasswordTypeEnum;
    /** [安全]密码最小长度 */
    safePasswordLenMin: number;
    /**[安全]密码最大长度 */
    safePasswordLenMax: number;
    /** [安全]token有效时长(小时) */
    safeTokenExpireHour: number;
  }

  // -------------------------------------------- 系统配置参数 --------------------------------------------
  export interface SystemConfigPo {
    /** [网站]标题 */
    title: string;
    /** [网站]标题 */
    titleColor: string;
    /** [网站]副标题 */
    subTitle: string;
    /** [网站]副标题 */
    subTitleColor: string;
    /** [网站]版权信息 */
    cop: string;
    /** [网站]版权信息 */
    copColor: string;
    /** [网站]登录背景图 */
    loginBg: string;
    /** 登录页面样式 */
    loginPageType: string;
    /** 顶部菜单条样式 */
    topMenuBarStyle: string;
    /** [网站]logo */
    logo: string;
    /** [网站]logo带文字 */
    logoWithText: string;
    /** [网站]微信小程序 */
    wxminiapp: string;
    /** [官网]地址 */
    portalLink: string;
    /** [Web]redis web管理页面地址 */
    phpRedisAdmin: string;
    /** [Web]SocketIO服务地址 */
    socketUrl: string;
    /** [Web]kkFileViewU服务地址 */
    kkFileViewUrl: string;
    /** [Web]是否离线环境 */
    offline: boolean;
    /** [安全]是否开启验证码 */
    safeCaptchaOn: boolean;
    /** [安全]是否开启注册 */
    safeRegistrationOn: boolean;
    /** [安全]密码类型 */
    safePasswordType: FaEnums.ConfigSysSafePasswordTypeEnum;
    /** [安全]密码最小长度 */
    safePasswordLenMin: number;
    /** [安全]密码最大长度 */
    safePasswordLenMax: number;
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
    /** 数值类型 */
    type: FaEnums.DictTypeEnum;
    /** 排序ID */
    sortId: number;
    /** 描述 */
    description: string;
    /** options */
    options: Option[];
    /** 字典值 */
    value: string;
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

  /** BASE-字典值 */
  export interface DictData extends Fa.BaseDelEntity {
    /** ID */
    id: number;
    /** 上级节点 */
    parentId: number;
    /** 字典分类ID */
    dictId: number;
    /** 排序ID */
    sortId: number;
    /** 字典键 */
    label: string;
    /** 字典值 */
    value: string;
    /** 是否默认值：0否 1是 */
    isDefault: boolean;
    /** 是否生效：0否 1是 */
    valid: boolean;
    /** 描述 */
    description: string;
    // ----------------- show cols -----------------
    /** 字典分类 */
    dictName: string;
  }

  // -------------------------------------------- 系统-告警信息 --------------------------------------------
  /** BASE-告警信息 */
  export interface Alert extends Fa.BaseDelEntity {
    /** ID */
    id: number;
    /** 告警内容 */
    content: string;
    /** 告警类型 */
    type: string;
    /** 是否处理 */
    deal: boolean;
    /** 负责人 */
    dutyStaff: string;
    /** 处理人 */
    dealStaff: string;
    /** 处理时间 */
    dealTime: string;
    /** 处理描述 */
    dealDesc: string;
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
  export interface Department extends Fa.BaseTreeDelEntity {
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
    /** 开放平台的唯一标识符 */
    wxUnionId: string;
    /** 微信小程序用户唯一标识 */
    wxMaOpenid: string;
    /** 工作状态 */
    workStatus: FaEnums.UserWorkStatusEnum;
    /** 最后在线时间 */
    lastOnlineTime: string;
    // ------------- show cols -------------
    /** 部门名称  */
    departmentName: string;
    /** 职位名称  */
    postName: string;
  }

  export interface UserWeb extends User {
    /** 部门名称  */
    departmentName: string;
    /** 职位名称  */
    postName: string;
    /** 角色名称  */
    roleNames: string;
  }

  /** BASE-用户token */
  export interface UserToken extends Fa.BaseDelEntity {
    /** ID */
    id: number;
    /** 用户ID */
    userId: string;
    /** 是否有效 */
    valid: string;
    /** 备注 */
    remark: string;
  }

  /** BASE-用户设备 */
  export interface UserDevice extends Fa.BaseDelEntity {
    /** ID */
    id: number;
    /** 所属用户ID */
    userId: string;
    /** 设备ID */
    deviceId: string;
    /** 设备型号 */
    model: string;
    /** 设备厂商 */
    manufacturer: string;
    /** 系统 */
    os: string;
    /** 系统版本号 */
    osVersion: string;
    /** 是否允许访问 */
    enable: boolean;
    /** 最后在线时间 */
    lastOnlineTime: string;
    // ----------------- show cols -----------------
    /** 所属用户名称  */
    userName: string;
  }

  // -------------------------------------------- 系统-上传文件 --------------------------------------------
  export interface FileSave extends Fa.BaseDelEntity {
    /** ID */
    id: string;
    /** 文件访问地址 */
    url: string;
    /** 文件大小，单位字节 */
    size: number;
    /** 文件名 */
    filename: string;
    /** 原始文件名 */
    originalFilename: string;
    /** 基础存储路径 */
    basePath: string;
    /** 存储路径 */
    path: string;
    /** 文件扩展名 */
    ext: string;
    /** MIME类型 */
    contentType: string;
    /** 存储平台 */
    platform: string;
    /** 缩略图访问路径 */
    thUrl: string;
    /** 缩略图名称 */
    thFilename: string;
    /** 缩略图大小，单位字节 */
    thSize: string;
    /** 缩略图MIME类型 */
    thContentType: string;
    /** 文件所属对象id */
    objectId: string;
    /** 文件所属对象类型，例如用户头像，评价图片 */
    objectType: string;
    /** 附加属性 */
    attr: string;
    /** md5 */
    md5: string;
  }

  /** BASE-通用业务附件表 */
  export interface FileBiz extends Fa.BaseDelEntity {
    /** ID */
    id: number;
    /** 主业务ID */
    mainBizId: string;
    /** 业务ID */
    bizId: string;
    /** 业务类型 */
    type: string;
    /** 附件ID */
    fileId: string;
    /** 附件名称 */
    fileName: string;
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

  /** BASE-系统定时任务-执行日志 */
  export interface JobLog {
    /** ID */
    id: number;
    /** 任务ID */
    jobId: string;
    /** 执行结果：1-执行中/2-成功/9-失败 */
    status: FaEnums.JobLogStatusEnum;
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
    /** 消息来源：1-系统消息，2-流程消息 */
    type: FaEnums.MsgTypeEnum;
    /** 业务JSON数据 */
    buzzContent: string;
  }

  // -------------------------------------------- 系统-URL请求日志 --------------------------------------------
  /** BASE-URL请求日志 */
  export interface LogApi extends Fa.BaseCrtEntity {
    /** 序号 */
    id: string;
    /** 模块 */
    crud: FaEnums.LogCrudEnum;
    /** 模块 */
    biz: string;
    /** 操作 */
    opr: string;
    /** 操作备注 */
    oprRemark: string;
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
    /** 浏览浏览器版本器版本 */
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
    /** 请求头 */
    headers: string;
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
    /** 请求备注 */
    remark: string;
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

  /** BASE-系统版本更新日志表 */
  export interface SystemUpdateLog extends Fa.BaseDelEntity {
    /** ID */
    id: number;
    /** 模块编码 */
    no: string;
    /** 模块名称 */
    name: string;
    /** 版本号 */
    ver: string;
    /** 版本编码 */
    verNo: string;
    /** 备注信息 */
    remark: string;
    /** SQL执行内容 */
    log: string;
  }

  // -------------------------------------------- 系统-server info --------------------------------------------
  export interface ServerInfo {
    cpuInfo: {
      cpuNum: number;
      free: number;
      used: number;
    };
    memory: {
      available: number;
      total: number;
    };
    system: {
      model: string;
      manufacturer: string;
    };
    fileStoreList: FileStore[];
  }

  export interface FileStore {
    uuid: string;
    volume: string;
    name: string;
    totalSpace: number;
    freeSpace: number;
    usableSpace: number;
  }

  /** BASE-系统-新闻 */
  export interface SysNews extends Fa.BaseDelEntity {
    /** ID */
    id: number;
    /** 标题 */
    title: string;
    /** 内容 */
    content: string;
    /** 封面 */
    cover: string;
    /** 作者 */
    author: string;
    /** 发布时间 */
    pubTime: string;
  }
}

export default Admin;
