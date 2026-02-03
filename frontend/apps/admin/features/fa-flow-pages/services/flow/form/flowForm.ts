import { GATE_APP } from '@/configs';
import { BaseApi, Fa } from '@fa/ui';
import { Flow } from '@/types';

interface SaveFormDataReqVo {
  formId: number,
  formData: any,
  // childFormDataList?: Array<{
  //   tableName: string,
  //   formDataList: any[]
  // }>
}

interface QueryFormDataVo extends Fa.BasePageProps {
  flowFormId: number;
}

/** ------------------------------------------ FLOW-流程表单 操作接口 ------------------------------------------ */
class Api extends BaseApi<Flow.FlowForm, number> {

  /** 创建流程表单表 */
  createFormTable = (data: {tableName: string, comment: string}): Promise<Fa.Ret<any>> => this.post('createFormTable', data);

  /** 查询表结构 */
  queryTableStructure = (data: {tableName: string}): Promise<Fa.Ret<Flow.TableInfoVo>> => this.post('queryTableStructure', data);

  /** 新建列 */
  createColumn = (data: {tableName: string, column: Flow.TableColumnVo}): Promise<Fa.Ret<boolean>> => this.post('createColumn', data);

  /** 更新列 */
  updateColumn = (data: {tableName: string, column: Flow.TableColumnVo}): Promise<Fa.Ret<boolean>> => this.post('updateColumn', data);

  /** 删除列 */
  deleteColumn = (data: {tableName: string, column: string}): Promise<Fa.Ret<boolean>> => this.post('deleteColumn', data);

  /** 保存数据 */
  saveFormData = (data: SaveFormDataReqVo): Promise<Fa.Ret<{formId: any, formData: any}>> => this.post('saveFormData', data);

  /** 分页查询自定义表单 */
  pageFormData = (params: QueryFormDataVo): Promise<Fa.Ret<Fa.Page<any>>> => this.post('pageFormData', params);

  /** id删除 */
  removeFormData = (id: any): Promise<Fa.Ret> => this.delete(`removeFormData/${id}`);

  /** 删除数据 */
  removeFormDataById = (flowFormId: number, id: any): Promise<Fa.Ret> => this.delete(`removeFormDataById/${flowFormId}/${id}`);

  /** 批量删除数据 */
  removeFormDataByIds = (flowFormId: number, ids: any[]): Promise<Fa.Ret> => this.post(`removeFormDataByIds/${flowFormId}`, ids);

}

export default new Api(GATE_APP.flow.form, 'flowForm');
