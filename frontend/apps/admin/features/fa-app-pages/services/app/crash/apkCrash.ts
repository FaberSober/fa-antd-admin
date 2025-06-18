import { GATE_APP } from '@/configs';
import { BaseApi } from '@fa/ui';
import type { App } from '@/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class Api extends BaseApi<App.ApkCrash, number> {}

export default new Api(GATE_APP.app.crash, 'apkCrash');
