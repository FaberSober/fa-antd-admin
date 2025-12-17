import { GATE_APP } from '@/configs';
import { BaseApi, Fa } from '@fa/ui';
import { Flow } from '@/types';

/** ------------------------------------------ FLOW-流程表单 操作接口 ------------------------------------------ */
class Api extends BaseApi<Flow.FlowForm, number> {

  /** 创建流程表单表 */
  createFormTable = (data: {tableName: string, comment: string}): Promise<Fa.Ret<any>> => this.post('createFormTable', data);

  /** 查询表结构 */
  queryTableStructure = (data: {tableName: string}): Promise<Fa.Ret<Flow.TableInfoVo>> => this.post('queryTableStructure', data);

}

export default new Api(GATE_APP.flow.form, 'flowForm');
