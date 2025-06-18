package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.ConfigSysBiz;
import com.faber.api.base.admin.entity.ConfigSys;
import com.faber.api.base.admin.vo.ret.SystemConfigPo;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.config.annotation.IgnoreUserToken;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.*;


/**
 * BASE-配置-系统配置
 * @author xu.pengfei
 * @email faberxu@gmail.com
 * @date 2022/12/12 10:11
 */
@FaLogBiz("系统配置")
@RestController
@RequestMapping("/api/base/admin/configSys")
public class ConfigSysController extends BaseController<ConfigSysBiz, ConfigSys, Integer> {

    @FaLogOpr("获取完整配置")
    @RequestMapping(value = "/getOne", method = RequestMethod.GET)
    @ResponseBody
    public Ret<ConfigSys> getOne() {
        ConfigSys o = baseBiz.getOne();
        return ok(o);
    }

    @FaLogOpr("获取前端配置")
    @RequestMapping(value = "getSystemConfig", method = RequestMethod.GET)
    @ResponseBody
    @IgnoreUserToken
    public Ret<SystemConfigPo> getSystemConfig() {
        SystemConfigPo data = baseBiz.getSystemConfig();
        return ok(data);
    }

}