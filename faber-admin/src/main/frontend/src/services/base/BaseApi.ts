import FaberBase from '@/props/base/FaberBase';
import Ajax from '@/props/base/Ajax';
import { requestDelete, requestDownload, requestGet, requestPost, requestPut } from '@/utils/request';
import querystring from 'querystring';

export default class BaseApi<T, KeyType, PageT = T> {
	public apiPrefix: string;

	public apiModal: string;

	constructor(apiPrefix: string, apiModal: string) {
		this.apiPrefix = apiPrefix;
		this.apiModal = apiModal;
	}

	/** 增加实体信息 */
	add = (params: any): Promise<Ajax.Response<T>> => requestPost(`${this.apiPrefix}/${this.apiModal}`, params);

	/** 增加实体信息 */
	batchInsert = (params: any): Promise<Ajax.Response<T>> => requestPost(`${this.apiPrefix}/${this.apiModal}/batchInsert`, params);

	/** 获取唯一实体 */
	findOne = (id: KeyType): Promise<Ajax.Response<T>> => requestGet(`${this.apiPrefix}/${this.apiModal}/${id}`);

	/** 更新实体 */
	update = (id: KeyType, params: any): Promise<Ajax.Response> => requestPut(`${this.apiPrefix}/${this.apiModal}/${id}`, params);

	/** 更新实体-只更新传入的属性 */
	updateAll = (id: KeyType, params: any): Promise<Ajax.Response> => requestPut(`${this.apiPrefix}/${this.apiModal}/updateAll/${id}`, params);

	/** 更新实体-只更新传入的属性 */
	updateSelective = (id: KeyType, params: any): Promise<Ajax.Response> => requestPut(`${this.apiPrefix}/${this.apiModal}/updateSelective/${id}`, params);

	/** 删除实体 */
	remove = (id: KeyType): Promise<Ajax.Response> => requestDelete(`${this.apiPrefix}/${this.apiModal}/${id}`);

	/** 逻辑删除实体 */
	logicDeleteById = (id: KeyType): Promise<Ajax.Response> => requestDelete(`${this.apiPrefix}/${this.apiModal}/logicDeleteById/${id}`);

	/** 批量删除实体 */
	batchDelete = (ids: KeyType[]): Promise<Ajax.Response> => requestPost(`${this.apiPrefix}/${this.apiModal}/batchDelete`, { ids });

	/** 批量逻辑删除实体 */
	batchLogicDelete = (ids: KeyType[]): Promise<Ajax.Response> => requestPost(`${this.apiPrefix}/${this.apiModal}/batchLogicDelete`, { ids });

	/** 获取所有实体 */
	all = (): Promise<Ajax.Response<T[]>> => requestGet(`${this.apiPrefix}/${this.apiModal}/all`);

	/** 获取实体List */
	list = (params: any): Promise<Ajax.Response<T[]>> => requestPost(`${this.apiPrefix}/${this.apiModal}/list`, params);

	/** 获取实体List-用户创建 */
	mineList = (params: any): Promise<Ajax.Response<T[]>> => requestGet(`${this.apiPrefix}/${this.apiModal}/mineList?${querystring.stringify(params)}`);

	/** 获取实体List */
	count = (params: any): Promise<Ajax.Response<number>> => requestGet(`${this.apiPrefix}/${this.apiModal}/count?${querystring.stringify(params)}`);

	/** 获取实体 分页 */
	page = (params: FaberBase.BasePageProps): Promise<Ajax.Response<Ajax.Page<PageT>>> => requestPost(`${this.apiPrefix}/${this.apiModal}/page`, params);

	/** 导出Excel[分页查询] */
	exportExcel = (params: FaberBase.BasePageProps): Promise<undefined> => requestDownload(`${this.apiPrefix}/${this.apiModal}/exportExcel`, params);
}
