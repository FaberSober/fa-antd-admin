package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.ConfigBiz;
import com.faber.api.base.admin.entity.Config;
import com.faber.api.base.admin.entity.ConfigSys;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.*;

@FaLogBiz("前端配置")
@RestController
@RequestMapping("/api/base/admin/config")
public class ConfigController extends BaseController<ConfigBiz, Config, Integer> {

    @FaLogOpr("获取唯一配置")
    @RequestMapping(value = "/getOne", method = RequestMethod.GET)
    @ResponseBody
    public Ret<Config> getOne(@RequestParam("biz") String biz, @RequestParam("type") String type) {
        Config o = baseBiz.getOne(biz, type);
        return ok(o);
    }

}