package com.faber.api.media.video.utils;

import java.nio.file.Path;
import java.nio.file.Paths;

import com.faber.api.media.video.vo.meta.VideoMetaInfo;
import com.github.kokorin.jaffree.LogLevel;
import com.github.kokorin.jaffree.StreamType;
import com.github.kokorin.jaffree.ffmpeg.FFmpeg;
import com.github.kokorin.jaffree.ffmpeg.ProgressListener;
import com.github.kokorin.jaffree.ffmpeg.UrlInput;
import com.github.kokorin.jaffree.ffmpeg.UrlOutput;
import com.github.kokorin.jaffree.ffprobe.FFprobe;
import com.github.kokorin.jaffree.ffprobe.FFprobeResult;
import com.github.kokorin.jaffree.ffprobe.Format;
import com.github.kokorin.jaffree.ffprobe.Stream;

/**
 * 视频、音频工具类
 */
public class FaMediaUtils {
    
    /**
     * 获取远程视频详细元数据
     * @param videoUrl 视频URL（需带签名参数）
     * @return VideoMetaInfo 实体
     */
    public static VideoMetaInfo getVideoMeta(String videoUrl) {
        VideoMetaInfo info = new VideoMetaInfo();
        
        try {
            FFprobeResult result = FFprobe.atPath()
                    .setInput(videoUrl)
                    // 建议增加网络读取超时限制（单位微秒，此处为5秒）
                    .addArgument("-rw_timeout").addArgument("5000000")
                    .setShowStreams(true)
                    .setShowFormat(true)
                    .execute();

            // 1. 获取全局格式信息 (时长和文件大小)
            Format format = result.getFormat();
            if (format != null) {
                info.setDuration(format.getDuration() != null ? format.getDuration().doubleValue() : 0.0);
                info.setFileSize(format.getSize()); 
            }

            // 2. 遍历流信息
            for (Stream stream : result.getStreams()) {
                if (StreamType.VIDEO.equals(stream.getCodecType())) {
                    info.setWidth(stream.getWidth());
                    info.setHeight(stream.getHeight());
                    info.setVideoCodec(stream.getCodecName());
                    // getRFrameRate() 返回的是 Rational (如 "24/1")
                    info.setFrameRate(stream.getRFrameRate() != null ? stream.getRFrameRate().toString() : "");
                } else if (StreamType.AUDIO.equals(stream.getCodecType())) {
                    info.setAudioCodec(stream.getCodecName());
                    info.setSampleRate(stream.getSampleRate());
                }
            }
        } catch (Exception e) {
            // 这里可以根据实际业务需求抛出自定义异常或打日志
            System.err.println("解析视频元数据失败: " + e.getMessage());
            return null;
        }

        return info;
    }

    /**
     * 压缩视频到720P分辨率
     * @param videoUrl 视频URL（需带签名参数）
     * @param outputFilePath 输出文件路径
     */
    public static void compressVideo720(String videoUrl, String outputFilePath, ProgressListener progressListener) {
        FFmpeg.atPath()
            .addInput(UrlInput.fromUrl(videoUrl)) // 直接使用视频 URL
            .addOutput(UrlOutput.toUrl(outputFilePath))
            // 限制线程，防止占满服务器 CPU
            // .addArguments("-threads", "2")
            // 视频编码优化 (720p, 24fps)
            .addArguments("-c:v", "libx264")
            .addArguments("-crf", "26")
            .addArguments("-vf", "scale=1280:-2,fps=24")
            .addArguments("-pix_fmt", "yuv420p")
            // 开启快启模式，方便 uniapp 播放
            .addArguments("-movflags", "+faststart")
            // 音频优化
            .addArguments("-c:a", "aac")
            .addArguments("-b:a", "128k")
            .setOverwriteOutput(true)
            .setProgressListener(progressListener)
            .execute();
    }

    /**
     * 抽取视频前10秒作为鼠标悬浮预览短MP4
     * @param videoPath 源视频
     * @param outputFilePath 输出预览MP4路径，例如 "/tmp/preview.mp4"
     */
    public static void extractVideoPreview(String videoPath, String outputFilePath) {
        FFmpeg.atPath()
                .addInput(
                    UrlInput.fromUrl(videoPath)
                        .setPosition(0)  // 从第0秒开始
                        .setDuration(10 * 1000)  // 持续10秒（毫秒）
                )
                .addOutput(UrlOutput.toUrl(outputFilePath))
                // 限制 CPU 使用
                .addArguments("-threads", "2")
                
                // 视频参数优化
                .addArguments("-c:v", "libx264")
                .addArguments("-crf", "30")          // 预览图不需要极高画质，30 可以在保持清晰的同时极大减小体积
                .addArguments("-preset", "faster")   // 提高处理速度
                .addArguments("-vf", "scale=480:-2,fps=15") // 降低帧率到15帧，预览够用了
                .addArguments("-pix_fmt", "yuv420p") // 保证手机端兼容性
                
                // 预览图关键：静音 + 快启
                .addArgument("-an")                 // 移除音频，减少约 15% 的体积
                .addArguments("-movflags", "+faststart") // 必须加！让预览视频在 uniapp 里实现秒开
                
                .setOverwriteOutput(true)
                .execute();
    }

    /**
     * 从视频 URL 提取封面图（thumbnail）
     * @param videoUrl 视频的远程 URL，例如 "https://example.com/video.mp4"
     * @param thumbnailPath 输出封面图路径，例如 "/path/to/cover.jpg"
     * @param seekTime 提取帧的时间点（秒），推荐 1-10 秒，避免黑屏开头
     */
    public static void extractThumbnail(String videoUrl, String thumbnailPath, long seekTime) {
        FFmpeg.atPath()  // FFmpeg 可执行文件路径，如果在 PATH 中可省略
            .addInput(
                UrlInput.fromUrl(videoUrl)
                    .setPosition(seekTime * 1000)  // -ss 参数：seek 到指定毫秒（放在输入前更高效）
            )
            .addOutput(
                UrlOutput.toPath(Paths.get(thumbnailPath))
                    .setFrameCount(StreamType.VIDEO, 1L)              // 只输出 1 帧 (-frames:v 1)
                    // .disableAudio()                // 无音频 (-an)
                    // .disableSubtitle()             // 无字幕
                    // .setVideoCodec("mjpeg")        // 输出为 JPEG
                    .setFormat("image2")           // 图像格式
            )
            .setOverwriteOutput(true)             // 覆盖已有文件
            .setLogLevel(LogLevel.INFO)           // 可选：设置日志级别
            .execute();                           // 执行 FFmpeg 命令
    }

}
