import { GATE_APP } from '@/configs';
import { BaseApi, Fa } from '@fa/ui';
import { Im } from '@/types';

/** ------------------------------------------ IM-消息表 操作接口 ------------------------------------------ */
class Api extends BaseApi<Im.ImMessage, string> {

  /** 分页获取 */
  pageQuery = (params: Fa.BasePageProps): Promise<Fa.Ret<Fa.Page<Im.ImMessage>>> => this.post('pageQuery', params);

}

export default new Api(GATE_APP.im.core, 'imMessage');
