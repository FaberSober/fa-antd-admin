import type { Fa } from '@fa/ui';

namespace App {
  /** APP-APK表 */
  export interface Apk extends Fa.BaseDelEntity {
    /** ID */
    id: number;
    /** 应用名称 */
    name: string;
    /** 应用包名 */
    applicationId: string;
    /** 当前版本号 */
    versionCode: string;
    /** 当前版本名称 */
    versionName: string;
    /** apk文件ID */
    fileId: string;
    /** 文件大小 */
    size: number;
    /** 下载次数 */
    downloadNum: number;
    /** 图标文件ID */
    iconId: string;
    /** 短链 */
    shortCode: string;
    /** 版本信息 */
    remark: string;
  }

  /** APP-APK版本表 */
  export interface ApkVersion extends Fa.BaseDelEntity {
    /** ID */
    id: number;
    /** 应用ID */
    appId: number;
    /** 应用名称 */
    name: string;
    /** 应用包名 */
    applicationId: string;
    /** 版本号 */
    versionCode: string;
    /** 版本名称 */
    versionName: string;
    /** 图标文件ID */
    iconId: string;
    /** APK文件ID */
    fileId: string;
    /** 文件大小 */
    size: number;
    /** 下载次数 */
    downloadNum: number;
    /** 强制更新 */
    forceUpdate: boolean;
    /** 版本信息 */
    remark: string;
  }

  /** APP-APK崩溃日志表 */
  export interface ApkCrash extends Fa.BaseDelEntity {
    /** ID */
    id: number;
    /** 应用ID */
    appId: number;
    /** 应用名称 */
    name: string;
    /** 应用包名 */
    applicationId: string;
    /** 版本号 */
    versionCode: number;
    /** 版本名称 */
    versionName: string;
    /** 错误日志 */
    message: string;
    /** 崩溃日志详情 */
    detail: string;
    /** 崩溃时间 */
    crashTime: string;
    /** rom信息 */
    romInfo: string;
    /** 设备厂商 */
    deviceManufacturer: string;
    /** 设备型号 */
    deviceModel: string;
    /** android版本 */
    androidVersion: number;
    /** sdk版本 */
    androidSdk: string;
  }

}

export default App;
