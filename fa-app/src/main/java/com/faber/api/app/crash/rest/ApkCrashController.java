package com.faber.api.app.crash.rest;

import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.config.annotation.IgnoreUserToken;
import com.faber.core.config.validator.validator.Vg;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;
import com.faber.api.app.crash.biz.ApkCrashBiz;
import com.faber.api.app.crash.entity.ApkCrash;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * APP-APK崩溃日志表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2023-01-20 13:59:18
 */
@FaLogBiz("APP-APK崩溃日志表")
@RestController
@RequestMapping("/api/app/crash/apkCrash")
public class ApkCrashController extends BaseController<ApkCrashBiz, ApkCrash, Integer> {

    @FaLogOpr(value = "上传奔溃日志", crud = LogCrudEnum.C)
    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    @ResponseBody
    @IgnoreUserToken
    public Ret<Boolean> upload(@Validated(value = Vg.Crud.C.class) @RequestBody ApkCrash entity) {
        baseBiz.upload(entity);
        return ok();
    }

}