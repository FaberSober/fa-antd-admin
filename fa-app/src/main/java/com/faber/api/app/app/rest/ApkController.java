package com.faber.api.app.app.rest;

import cn.hutool.core.map.MapUtil;
import com.faber.api.app.app.biz.ApkBiz;
import com.faber.api.app.app.entity.Apk;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.annotation.LogNoRet;
import com.faber.core.config.annotation.ApiToken;
import com.faber.core.config.annotation.IgnoreUserToken;
import com.faber.core.config.validator.validator.Vg;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * APP-APK表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2023-01-18 20:31:39
 */
@FaLogBiz("APP-APK表")
@RestController
@RequestMapping("/api/app/app/apk")
public class ApkController extends BaseController<ApkBiz, Apk, Integer> {

    @FaLogOpr(value = "解析APK信息", crud = LogCrudEnum.R)
    @RequestMapping(value = "/getApkInfo/{fileId}", method = RequestMethod.GET)
    @ResponseBody
    public Ret<Apk> getApkInfo(@PathVariable("fileId") String fileId) throws IOException {
        Apk o = baseBiz.getApkInfo(fileId);
        return ok(o);
    }

    @FaLogOpr(value = "新增apk", crud = LogCrudEnum.C)
    @RequestMapping(value = "/create", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Apk> create(@Validated(value = Vg.Crud.C.class) @RequestBody Apk entity) {
        baseBiz.create(entity);
        return ok(entity);
    }

    @FaLogOpr(value = "获取APK最新版本", crud = LogCrudEnum.R)
    @RequestMapping(value = "/getApkLastRelease/{id}", method = RequestMethod.GET)
    @ResponseBody
    @IgnoreUserToken
    public Ret<Apk> getApkLastRelease(@PathVariable("id") Integer id) {
        Apk o = baseBiz.getApkLastRelease(id);
        return ok(o);
    }

    @IgnoreUserToken
    @FaLogOpr(value = "最新版本下载数加一", crud = LogCrudEnum.C)
    @LogNoRet
    @RequestMapping(value = "/addLastDownloadNum/{id}", method = RequestMethod.GET)
    @ResponseBody
    public Ret<Boolean> addLastDownloadNum(@PathVariable("id") Integer id) {
        baseBiz.addLastDownloadNum(id);
        return ok();
    }

    @FaLogOpr(value = "API上传APK", crud = LogCrudEnum.C)
    @PostMapping("/apiUpload")
    @ResponseBody
    @ApiToken
    public Ret<Apk> apiUpload(@RequestParam("file") MultipartFile file,
                              @RequestParam("appId") Integer appId,
                              @RequestParam("remark") String remark) throws IOException {
        Apk data = baseBiz.apiUpload(file, appId, remark);
        return ok(data);
    }

    @IgnoreUserToken
    @FaLogOpr(value = "短码获取APP信息", crud = LogCrudEnum.C)
    @RequestMapping(value = "/getByShortCode", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Apk> getByShortCode(@RequestBody Map<String, Object> params) {
        String shortCode = MapUtil.getStr(params, "shortCode");
        Apk data = baseBiz.getByShortCode(shortCode);
        return ok(data);
    }

}