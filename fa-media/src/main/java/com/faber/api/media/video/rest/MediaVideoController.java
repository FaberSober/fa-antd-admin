package com.faber.api.media.video.rest;

import java.util.Map;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.faber.api.media.video.biz.MediaVideoBiz;
import com.faber.api.media.video.entity.MediaVideo;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;

import cn.hutool.core.map.MapUtil;

/**
 * 媒体-视频信息表
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2026-01-07 13:58:32
 */
@FaLogBiz("媒体-视频信息表")
@RestController
@RequestMapping("/api/media/video/mediaVideo")
public class MediaVideoController extends BaseController<MediaVideoBiz, MediaVideo, String> {

    @FaLogOpr(value = "新增", crud = LogCrudEnum.C)
    @RequestMapping(value = "/create", method = RequestMethod.POST)
    @ResponseBody
    public Ret<MediaVideo> create(@RequestBody Map<String, Object> params) {
        String originFileId = MapUtil.getStr(params, "originFileId");
        MediaVideo data = baseBiz.create(originFileId);
        return ok(data);
    }

    @FaLogOpr(value = "启动压缩", crud = LogCrudEnum.R)
    @RequestMapping(value = "/startCompressVideo/{id}", method = RequestMethod.GET)
    @ResponseBody
    public Ret<Boolean> startCompressVideo(@PathVariable String id) {
        baseBiz.startCompressVideo(id);
        return ok();
    }

}
