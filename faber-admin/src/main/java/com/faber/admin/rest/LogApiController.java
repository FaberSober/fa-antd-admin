package com.faber.admin.rest;

import com.faber.admin.biz.LogApiBiz;
import com.faber.admin.entity.LogApi;
import com.faber.common.rest.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * URL请求日志
 */
@Controller
@RequestMapping("/api/admin/logApi")
public class LogApiController extends BaseController<LogApiBiz, LogApi, Long> {

}
