package com.faber.api.media.video.vo.meta;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class VideoMetaInfo {
    private Long fileSize;        // 文件大小 (bytes)
    private Double duration;      // 时长 (s)
    private Integer width;        // 宽
    private Integer height;       // 高
    private String videoCodec;    // 视频编码
    private String frameRate;     // 帧率
    private String audioCodec;    // 音频编码
    private Integer sampleRate;   // 音频采样率
}
