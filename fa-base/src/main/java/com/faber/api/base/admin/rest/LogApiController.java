package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.LogApiBiz;
import com.faber.api.base.admin.entity.LogApi;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.annotation.LogNoRet;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.vo.msg.Ret;
import com.faber.core.vo.query.QueryParams;
import com.faber.core.web.rest.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * URL请求日志
 */
@FaLogBiz("请求日志")
@Controller
@RequestMapping("/api/base/admin/logApi")
public class LogApiController extends BaseController<LogApiBiz, LogApi, Long> {

    @FaLogOpr(value = "清空日志", crud = LogCrudEnum.D)
    @LogNoRet
    @RequestMapping(value = "/deleteAll", method = RequestMethod.DELETE)
    @ResponseBody
    public Ret<Boolean> deleteAll() {
        baseBiz.deleteAll();
        return ok();
    }

}
