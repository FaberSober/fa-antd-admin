import { GATE_APP } from '@/configs';
import { BaseApi, type Fa } from '@fa/ui';
import type { App } from '@/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class Api extends BaseApi<App.Apk, number> {

  /** 解析APK信息 */
  getApkInfo = (fileId: string): Promise<Fa.Ret<App.Apk>> => this.get(`getApkInfo/${fileId}`);

  /** 新增apk */
  create = (params: any): Promise<Fa.Ret<App.Apk>> => this.post('create', params);

  /** 短码获取APP信息 */
  getByShortCode = (params: { shortCode: string }): Promise<Fa.Ret<App.Apk>> => this.post('getByShortCode', params);

}

export default new Api(GATE_APP.app.app, 'apk');
