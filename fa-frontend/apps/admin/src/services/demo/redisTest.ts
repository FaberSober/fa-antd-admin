import {GATE_APP} from '@/configs/server.config';
import {BaseZeroApi} from '@/services/base';
import * as Fa from "@/../../../types/base/Fa";

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class Api extends BaseZeroApi {

  /** 添加缓存 */
  addCache = (key:string,value:string): Promise<Fa.Ret> => this.get(`addCache`, {key,value});

  /** 获取缓存 */
  getCache = (key:string): Promise<Fa.Ret<string>> => this.get("getCache", {key});

}

export default new Api(GATE_APP.demo, 'redisTest');
