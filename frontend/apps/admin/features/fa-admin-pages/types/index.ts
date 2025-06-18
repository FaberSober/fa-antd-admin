export type { default as Admin } from './base/Admin';
export type { default as Rbac } from './base/Rbac';
export type { default as Generator } from './base/Generator';

/** -------------------------------- declare global -------------------------------- */
declare global {
  interface Window {
    /** 高德地图JS API */
    AMap: any;
    /** 高德地图UI组件库 */
    AMapUI: any;
    /** NEditor */
    UE: any;
    /** 七牛 */
    qiniu: any;
    /** flv.js播放器 */
    flvjs: any;
    /** echarts */
    echarts: any;
    /** socket.io.js */
    io: any;
    /** pdfjs */
    pdfjs: any;
    /** Jessibuca */
    Jessibuca: any;
    /** mqtt */
    mqtt: any;
    /** mqtt */
    globalData: any;
    /** VANTA */
    VANTA: any;
    /** Prism */
    Prism: any;
    /** videojs */
    videojs: any;

    /** fa secret */
    __FA_SECRET__: string;
    __ADMIN_SUPER_PWD__: string;

    /** fa-admin自定义 */
    FaFrom: any;
    FaVersionCode: any;
    FaVersionName: any;
    FaIframeUrl: any;
    faHeader: any;
  }
}
