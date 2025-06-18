package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.SystemUpdateLogBiz;
import com.faber.api.base.admin.entity.SystemUpdateLog;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@FaLogBiz("系统更新")
@RestController
@RequestMapping("/api/base/admin/systemUpdateLog")
public class SystemUpdateLogController extends BaseController<SystemUpdateLogBiz, SystemUpdateLog, Integer> {

}