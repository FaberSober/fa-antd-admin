package com.faber.api.admin.rest;

import com.faber.api.admin.biz.LogApiBiz;
import com.faber.api.admin.entity.LogApi;
import com.faber.core.web.rest.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * URL请求日志
 */
@Controller
@RequestMapping("/api/admin/logApi")
public class LogApiController extends BaseController<LogApiBiz, LogApi, Long> {

}
