import Fa from '@/props/base/Fa';
import BaseZeroApi from './BaseZeroApi';

export default class BaseApi<T, KeyType, PageT = T> extends BaseZeroApi {
	/** 增加实体信息 */
	add = (params: any): Promise<Fa.Response<T>> => this.post('add', params);

	/** 增加实体信息 */
	saveBatch = (params: any[]): Promise<Fa.Response<T>> => this.post('saveBatch', params);

	/** 获取唯一实体 */
	findOne = (id: KeyType): Promise<Fa.Response<T>> => this.get(`get/${id}`);

	/** 更新实体 */
	update = (id: KeyType, params: any): Promise<Fa.Response> => this.post('update', params);

	/** 删除实体 */
	remove = (id: KeyType): Promise<Fa.Response> => this.delete(`remove/${id}`);

	/** 批量删除实体 */
	removeBatchByIds = (ids: KeyType[]): Promise<Fa.Response> => this.post('removeBatchByIds', ids);

	/** 获取所有实体 */
	all = (): Promise<Fa.Response<T[]>> => this.get('all');

	/** 获取实体List */
	list = (params: any): Promise<Fa.Response<T[]>> => this.post('list', params);

	/** 获取实体List-用户创建 */
	mineList = (params: any): Promise<Fa.Response<T[]>> => this.post('mineList', params);

	/** 获取实体List */
	count = (params: any): Promise<Fa.Response<number>> => this.post('count', params);

	/** 获取实体 分页 */
	page = (params: Fa.BasePageProps): Promise<Fa.Response<Fa.Page<PageT>>> => this.post('page', params);

	/** 导出Excel[分页查询] */
	exportExcel = (params: Fa.BasePageProps): Promise<undefined> => this.download('exportExcel', params);
}
