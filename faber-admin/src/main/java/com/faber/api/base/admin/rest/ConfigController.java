package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.ConfigBiz;
import com.faber.api.base.admin.entity.Config;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/base/admin/config")
public class ConfigController extends BaseController<ConfigBiz, Config, Integer> {

}