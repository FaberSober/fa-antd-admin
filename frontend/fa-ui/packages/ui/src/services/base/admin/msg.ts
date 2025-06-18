import {GATE_APP} from '@ui/configs';
import {Admin, Fa} from '@ui/types';
import {BaseApi} from '@ui/services';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'msg';

class Msg extends BaseApi<Admin.Msg, string> {
  /** 获取实体 分页 */
  pageMine = (params: Fa.BasePageProps): Promise<Fa.Ret<Fa.Page<Admin.Msg>>> => this.post(`pageMine`, params);

  /** 批量已读 */
  batchRead = (ids: string[]): Promise<Fa.Ret> => this.post(`batchRead`, ids);

  /** 消息数量统计 */
  countMine = (): Promise<Fa.Ret<{ unreadCount: number }>> => this.get(`countMine`);
}

export default new Msg(GATE_APP.admin, serviceModule);
