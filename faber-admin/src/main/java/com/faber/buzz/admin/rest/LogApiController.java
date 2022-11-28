package com.faber.buzz.admin.rest;

import com.faber.buzz.admin.biz.LogApiBiz;
import com.faber.buzz.admin.entity.LogApi;
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
