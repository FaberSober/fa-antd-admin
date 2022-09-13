package com.faber.admin.rest;

import com.faber.admin.biz.GateLogBiz;
import com.faber.admin.entity.GateLog;
import com.faber.common.rest.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * URL请求日志
 */
@Controller
@RequestMapping("/api/admin/gateLog")
public class GateLogController extends BaseController<GateLogBiz, GateLog> {

}
