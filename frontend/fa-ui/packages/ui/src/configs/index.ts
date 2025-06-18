/** -------------------------------- 网关配置 -------------------------------- */
export const GATE_APP = {
  /** ADMIN服务 */
  admin: '/api/base/admin',
  /** rbac服务 */
  rbac: '/api/base/rbac',
};

/** -------------------------------- declare global -------------------------------- */
declare global {
  interface Window {
    /** 高德地图JS API */
    AMap: any;
    /** 高德地图UI组件库 */
    AMapUI: any;
    /** 七牛 */
    qiniu: any;
    /** 七牛-区域 */
    FA_QINIU_ZONE: any;
    /** socket.io */
    io: any;
    /** socket.io */
    faHeader: any;
    /** fa secret */
    __FA_SECRET__: string;
  }
}
