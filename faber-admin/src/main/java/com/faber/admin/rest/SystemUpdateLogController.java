package com.faber.admin.rest;

import com.faber.common.rest.BaseController;
import com.faber.admin.biz.SystemUpdateLogBiz;
import com.faber.admin.entity.SystemUpdateLog;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/base/systemUpdateLog")
public class SystemUpdateLogController extends BaseController<SystemUpdateLogBiz,SystemUpdateLog> {

}