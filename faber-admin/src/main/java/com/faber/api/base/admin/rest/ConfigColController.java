package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.ConfigColBiz;
import com.faber.api.base.admin.entity.ConfigCol;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/base/admin/configCol")
public class ConfigColController extends BaseController<ConfigColBiz, ConfigCol, Integer> {

}