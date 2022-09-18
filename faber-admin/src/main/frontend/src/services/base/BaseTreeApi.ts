import Ajax from '@/props/base/Ajax';
import FaberBase from '@/props/base/FaberBase';
import BaseApi from '@/services/base/BaseApi';

export default class BaseTreeApi<T, KeyType, PageT = T> extends BaseApi<T, KeyType, PageT> {
	/** 获取ID的向上路径 */
	path = (id: KeyType): Promise<Ajax.Response<T[]>> => super.get(`path/${id}`);

	/** 获取所有实体列表Tree */
	allTree = (): Promise<Ajax.Response<FaberBase.TreeNode<T, KeyType>[]>> => super.get(`allTree`);

	/** 获取所有实体列表Tree */
	getTree = (params: any = {}): Promise<Ajax.Response<FaberBase.TreeNode<T, KeyType>[]>> => super.post(`getTree`, params);

	/** 改变实体列表位置[排序、父节点] */
	changePos = (list: FaberBase.TreePosChangeVo[]): Promise<Ajax.Response<any>> => super.post(`changePos`, list);

	/** 给定选中的value，返回value向上查找的节点路径[1, 1-1, 1-1-1] */
	treePathLine = (id: KeyType): Promise<Ajax.Response<FaberBase.TreeNode<T, KeyType>[]>> => super.get(`treePathLine/${id}`);

	/** 给定parentId，返回当前层级的节点List */
	treeListLayer = (parentId: KeyType): Promise<Ajax.Response<FaberBase.TreeNode<T, KeyType>[]>> => super.get(`treeListLayer/${parentId}`);

	/** 给定选中的value，返回value向上查找的节点路径xxx，并返回路径xxx的层级的Tree */
	treeFindPath = (id: KeyType): Promise<Ajax.Response<FaberBase.TreePathVo<T, KeyType>>> => super.get(`treeFindPath/${id}`);
}
