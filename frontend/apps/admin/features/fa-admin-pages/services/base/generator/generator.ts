import { BaseZeroApi, type Fa } from '@fa/ui';
import { GATE_APP } from '@/configs';
import type { Generator } from '@/types';

class Api extends BaseZeroApi {
  /** 查询表 */
  pageTable = (params: Fa.BasePageQuery<Generator.TableQueryVo>): Promise<Fa.Ret<Fa.Page<Generator.TableVo>>> => this.post('pageTable', params);

  /** 预览代码 */
  preview = (params: Generator.CodeGenReqVo): Promise<Fa.Ret<Generator.CodeGenRetVo>> => this.post('preview', params);

  /** 复制当前文件 */
  copyOne = (params: Generator.CodeGenReqVo): Promise<Fa.Ret<boolean>> => this.post('copyOne', params);

  /** 复制当前文件 */
  copyOneToPath = (params: Generator.CodeCopyToReqVo): Promise<Fa.Ret<boolean>> => this.post('copyOneToPath', params);

  /** 复制当前文件 */
  copyBatch = (params: any): Promise<Fa.Ret<boolean>> => this.post('copyBatch', params);

  /** 复制全部文件 */
  copyAll = (params: Generator.CodeCopyVo): Promise<Fa.Ret<boolean>> => this.post('copyAll', params);
}

export default new Api(GATE_APP.generator, 'generator');
