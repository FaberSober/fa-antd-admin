package com.faber.api.base.doc.rest;

import com.faber.api.base.doc.biz.OnlyofficeBiz;
import com.faber.api.base.doc.dto.Track;
import com.faber.api.base.doc.models.enums.Mode;
import com.faber.api.base.doc.vo.ret.OnlyofficeRet;
import com.faber.api.base.doc.vo.ret.OpenFileRetVo;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.config.annotation.IgnoreUserToken;
import com.faber.core.utils.BaseResHandler;
import com.faber.core.vo.msg.Ret;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;

/**
 * Onlyoffice在线文档对接
 * @author Farando
 * @date 2023/3/13 16:32
 * @description
 */
@FaLogBiz("Onlyoffice")
@RestController
@RequestMapping("/api/base/doc/onlyoffice")
public class OnlyofficeController extends BaseResHandler {

    @Resource
    OnlyofficeBiz onlyofficeBiz;

    @FaLogOpr("打开文件Token")
    @GetMapping("/openFile/{fileId}")
    @ResponseBody
    public Ret<OpenFileRetVo> openFile(@PathVariable("fileId") String fileId, @RequestParam(value = "mode", required = false) String mode) {
        OpenFileRetVo data = onlyofficeBiz.openFile(fileId, Mode.valueOf(mode));
        return ok(data);
    }

    @FaLogOpr("onlyoffice回调")
    @PostMapping("/track")
    @ResponseBody
    @IgnoreUserToken
    public OnlyofficeRet track(@RequestBody final Track body) {
        onlyofficeBiz.track(body);
        return new OnlyofficeRet();
    }

}
