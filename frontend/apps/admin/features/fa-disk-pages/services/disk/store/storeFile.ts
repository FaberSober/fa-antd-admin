import { GATE_APP } from '@/configs';
import { BaseTreeApi } from '@fa/ui';
import { Fa } from '@fa/ui';
import { Disk } from '@/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class Api extends BaseTreeApi<Disk.StoreFile, number> {
  /** 批量下载 */
  downloadZip = (ids: number[]): Promise<undefined> => this.download('downloadZip', ids);

  /** 移动到 */
  moveToDir = (fileIds: number[], toDirId: number): Promise<Fa.Ret<boolean>> => this.post('moveToDir', { fileIds, toDirId });

  /** 复制到 */
  copyToDir = (fileIds: number[], toDirId: number): Promise<Fa.Ret<boolean>> => this.post('copyToDir', { fileIds, toDirId });

  /** 打标签 */
  addTags = (fileIds: number[], tagIds: any[]): Promise<Fa.Ret<boolean>> => this.post('addTags', { fileIds, tagIds });

  /** 获取实体List */
  queryFile = (params: any): Promise<Fa.Ret<Disk.StoreFile[]>> => this.post('queryFile', params);

  /** 检索文件分页 */
  queryFilePage = (params: Fa.BasePageProps): Promise<Fa.Ret<Fa.Page<Disk.StoreFile>>> => this.post('queryFilePage', params);

  /** 检索回收站文件分页 */
  queryTrashFilePage = (params: Fa.BasePageProps): Promise<Fa.Ret<Fa.Page<Disk.StoreFile>>> => this.post('queryTrashFilePage', params);

  /** 恢复到原处 */
  putBack = (fileIds: number[]): Promise<Fa.Ret<boolean>> => this.post('putBack', fileIds);

  /** 恢复到 */
  putBackToDir = (fileIds: number[], toDirId: number): Promise<Fa.Ret<boolean>> => this.post('putBackToDir', { fileIds, toDirId });

  /** 更新备注 */
  updateInfo = (id: number, params: any): Promise<Fa.Ret> => this.post('updateInfo', { id, ...params });
}

export default new Api(GATE_APP.disk.store, 'file');
