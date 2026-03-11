import { Fa } from '@fa/ui';


// Media模块相关的类型定义
namespace Media {

  /** 媒体-视频信息表 */
  export interface MediaVideo extends Fa.BaseDelEntity {
    /** 视频记录唯一ID */
    id: string;
    /** 关联业务ID（如文章ID、动态ID、课程ID等） */
    businessId: string;
    /** 业务类型（如 post、moment、course 等） */
    businessType: string;
    /** 原视频文件ID -> base_file_save.id */
    originFileId: string;
    /** 原始视频文件名（冗余存储，便于查询展示） */
    originFilename: string;
    /** 原始视频宽度（像素） */
    originWidth: number;
    /** 原始视频高度（像素） */
    originHeight: number;
    /** 原始视频码率（kbps） */
    originBitrate: number;
    /** 原始视频时长（秒） */
    originDuration: number;
    /** 原始视频大小（MB） */
    originSizeMb: number;
    /** 720p转码视频文件ID -> base_file_save.id */
    trans720pFileId: string;
    /** 720p视频大小（MB） */
    trans720pSizeMb: number;
    /** 720p转码进度百分比（0-100，0表示未开始，100表示完成） */
    trans720pProgress: number;
    /** 720p转码详细状态：0=未开始,1=转码中,2=成功,3=失败,4=已取消 */
    trans720pStatus: number;
    /** 720p转码失败或警告的详细信息（如错误日志） */
    trans720pMessage: string;
    /** 720p转码开始时间 */
    trans720pStartTime: string;
    /** 720p转码结束时间 */
    trans720pEndTime: string;
    /** 封面图文件ID -> base_file_save.id */
    coverFileId: string;
    /** 预览视频文件ID -> base_file_save.id */
    previewFileId: string;
    /** 预览视频时长（秒） */
    previewDuration: number;
    /** 视频容器格式（如 mp4、mov、webm） */
    format: string;
    /** 视频编码（如 h264、h265、vp9） */
    codecVideo: string;
    /** 音频编码（如 aac、mp3） */
    codecAudio: string;
    /** 帧率 */
    fps: number;
    /** 视频状态：0=转码中,1=正常,-1=转码失败,-2=违规 */
    status: number;
    /** 审核状态：0=待审核,1=通过,2=拒绝 */
    auditStatus: number;
  }

}

export default Media;
