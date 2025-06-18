package com.faber.api.app.app.rest;

import cn.hutool.core.map.MapUtil;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.annotation.LogNoRet;
import com.faber.core.config.annotation.IgnoreUserToken;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.vo.msg.Ret;
import com.faber.core.vo.query.QueryParams;
import com.faber.core.web.rest.BaseController;
import com.faber.api.app.app.biz.ApkVersionBiz;
import com.faber.api.app.app.entity.ApkVersion;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * APP-APK版本表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2023-01-18 20:31:39
 */
@FaLogBiz("APP-APK版本表")
@RestController
@RequestMapping("/api/app/app/apkVersion")
public class ApkVersionController extends BaseController<ApkVersionBiz, ApkVersion, Integer> {

    @IgnoreUserToken
    @FaLogOpr(value = "获取APP历史版本", crud = LogCrudEnum.R)
    @LogNoRet
    @RequestMapping(value = "/listByAppId", method = RequestMethod.POST)
    @ResponseBody
    public Ret<List<ApkVersion>> listByApkId(@RequestBody Map<String, Object> params) {
        Integer appId = MapUtil.getInt(params, "appId");
        List<ApkVersion> list = baseBiz.listByAppId(appId);
        return ok(list);
    }

    @IgnoreUserToken
    @FaLogOpr(value = "下载数加一", crud = LogCrudEnum.C)
    @LogNoRet
    @RequestMapping(value = "/addDownloadNum", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> addDownloadNum(@RequestBody Map<String, Object> params) {
        Integer id = MapUtil.getInt(params, "id");
        baseBiz.addDownloadNum(id);
        return ok();
    }

}