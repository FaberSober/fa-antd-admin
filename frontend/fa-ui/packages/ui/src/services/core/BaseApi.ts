import type { Fa } from '@ui/types';
import { trimObj } from '@ui/utils/utils';
import BaseZeroApi from './BaseZeroApi';

export default class BaseApi<T, KeyType, PageT = T> extends BaseZeroApi {
  /** 新增 */
  save = (params: any): Promise<Fa.Ret<T>> => this.post('save', params);

  /** 新增批量 */
  saveBatch = (params: any[]): Promise<Fa.Ret<T>> => this.post('saveBatch', params);

  /** id查询 */
  getById = (id: KeyType): Promise<Fa.Ret<T>> => this.get(`getById/${id}`);

  /** id查询详情 */
  getDetail = (id: KeyType): Promise<Fa.Ret<T>> => this.get(`getDetail/${id}`);

  /** ids集合查询 */
  getByIds = (ids: KeyType[]): Promise<Fa.Ret<T[]>> => this.post('getByIds', ids);

  /** 更新 */
  update = (id: KeyType, params: any): Promise<Fa.Ret> => this.post('update', { id, ...trimObj(params) });

  /** 批量更新 */
  updateBatch = (entityList: T[]): Promise<Fa.Ret> => this.post('updateBatch', trimObj(entityList));

  /** 新增or更新 */
  saveOrUpdate = (params: any): Promise<Fa.Ret> => this.post('saveOrUpdate', params);

  /** 批量新增or更新 */
  saveOrUpdateBatch = (params: any[]): Promise<Fa.Ret<T>> => this.post('saveOrUpdateBatch', params);

  /** id删除 */
  remove = (id: KeyType): Promise<Fa.Ret> => this.delete(`remove/${id}`);

  /** ids批量删除 */
  removeBatchByIds = (ids: KeyType[]): Promise<Fa.Ret> => this.post('removeBatchByIds', ids);

  /** id永久删除 */
  removePer = (id: KeyType): Promise<Fa.Ret> => this.delete(`removePer/${id}`);

  /** ids批量永久删除 */
  removePerBatchByIds = (ids: KeyType[]): Promise<Fa.Ret> => this.post('removePerBatchByIds', ids);

  /** 通过查询条件删除 */
  removeByQuery = (params: Fa.BaseQueryParams): Promise<Fa.Ret<boolean>> => this.post('removeByQuery', params);

  /** 删除本用户数据 */
  removeMine = (): Promise<Fa.Ret> => this.delete('removeMine');

  /** 限定当前用户通过查询条件删除 */
  removeMineByQuery = (params: Fa.BaseQueryParams): Promise<Fa.Ret<boolean>> => this.post('removeMineByQuery', params);

  /** 获取所有List */
  all = (): Promise<Fa.Ret<T[]>> => this.get('all');

  /** 获取List，带过滤查询条件 */
  list = (params: Fa.BaseQueryParams): Promise<Fa.Ret<T[]>> => this.post('list', params);

  /** 获取List，带过滤查询条件 */
  listN = (params: Fa.BaseQueryParams, topN: number): Promise<Fa.Ret<T[]>> => this.post(`listN?topN=${topN}`, params);

  /** 获取List(限定登录用户创建)，带过滤查询条件 */
  mineList = (params: Fa.BaseQueryParams): Promise<Fa.Ret<T[]>> => this.post('mineList', params);

  /** 过滤条件统计数量 */
  count = (params: Fa.BaseQueryParams): Promise<Fa.Ret<number>> => this.post('count', params);

  /** 分页获取 */
  page = (params: Fa.BasePageProps): Promise<Fa.Ret<Fa.Page<PageT>>> => this.post('page', params);

  /** 个人分页查询 */
  minePage = (params: Fa.BasePageProps): Promise<Fa.Ret<Fa.Page<PageT>>> => this.post('minePage', params);

  /** 过滤条件导出Excel */
  exportExcel = (params: Fa.BasePageProps): Promise<undefined> => this.download('exportExcel', params);

  /** 下载导入Excel模版 */
  exportTplExcel = (): Promise<undefined> => this.download('exportTplExcel', {});

  /** 导入Excel数据 */
  importExcel = (params: {fileId: string}): Promise<Fa.Ret<boolean>> => this.post('importExcel', params);

}
