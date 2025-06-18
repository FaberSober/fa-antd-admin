package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.ConfigBiz;
import com.faber.api.base.admin.entity.Config;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.config.validator.validator.Vg;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;
import org.springframework.validation.annotation.Validated;
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

    @FaLogOpr("获取全局唯一配置")
    @RequestMapping(value = "/getOneGlobal", method = RequestMethod.GET)
    @ResponseBody
    public Ret<Config> getOneGlobal(@RequestParam("biz") String biz, @RequestParam("type") String type) {
        Config o = baseBiz.getOneGlobal(biz, type);
        return ok(o);
    }

    @FaLogOpr(value = "保存全局唯一配置", crud = LogCrudEnum.C)
    @RequestMapping(value = "/saveGlobal", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Config> saveGlobal(@Validated(value = Vg.Crud.C.class) @RequestBody Config entity) {
        baseBiz.saveGlobal(entity);
        return ok(entity);
    }

}