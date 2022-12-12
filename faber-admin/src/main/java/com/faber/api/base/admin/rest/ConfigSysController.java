package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.ConfigSysBiz;
import com.faber.api.base.admin.entity.ConfigSys;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * BASE-配置-系统配置
 * @author xu.pengfei
 * @email faberxu@gmail.com
 * @date 2022/12/12 10:11
 */
@RestController
@RequestMapping("/api/base/admin/configSys")
public class ConfigSysController extends BaseController<ConfigSysBiz, ConfigSys, Integer> {

}