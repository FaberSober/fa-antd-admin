package com.faber.api.disk.doc.rest;

import com.faber.api.base.doc.dto.Track;
import com.faber.api.base.doc.models.enums.Mode;
import com.faber.api.base.doc.vo.ret.OnlyofficeRet;
import com.faber.api.base.doc.vo.ret.OpenFileRetVo;
import com.faber.api.disk.doc.biz.DiskOnlyofficeBiz;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.config.annotation.IgnoreUserToken;
import com.faber.core.utils.BaseResHandler;
import com.faber.core.vo.msg.Ret;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;

/**
 * Onlyoffice在线文档对接
 *
 * @author Farando
 * @date 2023/3/13 16:32
 * @description
 */
@FaLogBiz("网盘Onlyoffice")
@RestController
@RequestMapping("/api/disk/doc/onlyoffice")
public class DiskOnlyofficeController extends BaseResHandler {

    @Resource
    DiskOnlyofficeBiz diskOnlyofficeBiz;

    @FaLogOpr("打开文件Token")
    @GetMapping("/openFile/{storeFileId}")
    @ResponseBody
    public Ret<OpenFileRetVo> openFile(@PathVariable("storeFileId") Integer storeFileId, @RequestParam(value = "mode", required = false) String mode) {
        OpenFileRetVo data = diskOnlyofficeBiz.openFile(storeFileId, Mode.valueOf(mode));
        return ok(data);
    }

    @FaLogOpr("onlyoffice回调")
    @PostMapping("/track")
    @ResponseBody
    @IgnoreUserToken
    public OnlyofficeRet track(@RequestBody final Track body) {
        diskOnlyofficeBiz.track(body);
        return new OnlyofficeRet();
    }

}
