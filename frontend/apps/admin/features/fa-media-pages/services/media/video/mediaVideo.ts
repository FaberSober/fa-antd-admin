import { GATE_APP } from '@/configs';
import { BaseApi, Fa } from '@fa/ui';
import { Media } from '@/types';

/** ------------------------------------------ 媒体-视频信息表 操作接口 ------------------------------------------ */
class Api extends BaseApi<Media.MediaVideo, string> {

  /** 新增 */
  create = (params: any): Promise<Fa.Ret<Media.MediaVideo>> => this.post('create', params);

  /** 启动压缩 */
  startCompressVideo = (id: string): Promise<Fa.Ret<boolean>> => this.get(`startCompressVideo/${id}`);

}

export default new Api(GATE_APP.media.video, 'mediaVideo');
