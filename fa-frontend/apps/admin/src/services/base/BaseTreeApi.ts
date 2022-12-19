import { Fa } from '@/types';
import BaseApi from '@/services/base/BaseApi';

export default class BaseTreeApi<T, KeyType, PageT = T> extends BaseApi<T, KeyType, PageT> {
  /** 获取ID的向上路径 */
  path = (id: KeyType): Promise<Fa.Ret<T[]>> => this.get(`path/${id}`);

  /** 获取所有实体列表Tree */
  allTree = (): Promise<Fa.Ret<Fa.TreeNode<T, KeyType>[]>> => this.get(`allTree`);

  /** 获取所有实体列表Tree */
  getTree = (params: any = {}): Promise<Fa.Ret<Fa.TreeNode<T, KeyType>[]>> => this.post(`getTree`, params);

  /** 改变实体列表位置[排序、父节点] */
  changePos = (list: Fa.TreePosChangeVo[]): Promise<Fa.Ret<any>> => this.post(`changePos`, list);

  /** 给定选中的value，返回value向上查找的节点路径[1, 1-1, 1-1-1] */
  treePathLine = (id: KeyType): Promise<Fa.Ret<Fa.TreeNode<T, KeyType>[]>> => this.get(`treePathLine/${id}`);

  /** 给定parentId，返回当前层级的节点List */
  treeListLayer = (parentId: KeyType): Promise<Fa.Ret<Fa.TreeNode<T, KeyType>[]>> =>
    this.get(`treeListLayer/${parentId}`);

  /** 给定选中的value，返回value向上查找的节点路径xxx，并返回路径xxx的层级的Tree */
  treeFindPath = (id: KeyType): Promise<Fa.Ret<Fa.TreePathVo<T, KeyType>>> => this.get(`treeFindPath/${id}`);

  /** 获取唯一实体 */
  moveUp = (id: KeyType): Promise<Fa.Ret> => this.get(`moveUp/${id}`);

  /** 获取唯一实体 */
  moveDown = (id: KeyType): Promise<Fa.Ret> => this.get(`moveDown/${id}`);
}
