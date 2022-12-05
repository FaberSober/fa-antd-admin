package com.faber.api.admin.rest;

import com.faber.api.admin.biz.SystemUpdateLogBiz;
import com.faber.api.admin.entity.SystemUpdateLog;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/base/systemUpdateLog")
public class SystemUpdateLogController extends BaseController<SystemUpdateLogBiz, SystemUpdateLog, Integer> {

}