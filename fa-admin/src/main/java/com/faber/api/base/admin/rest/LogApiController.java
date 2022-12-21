package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.LogApiBiz;
import com.faber.api.base.admin.entity.LogApi;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.web.rest.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * URL请求日志
 */
@FaLogBiz("请求日志")
@Controller
@RequestMapping("/api/base/admin/logApi")
public class LogApiController extends BaseController<LogApiBiz, LogApi, Long> {

}
