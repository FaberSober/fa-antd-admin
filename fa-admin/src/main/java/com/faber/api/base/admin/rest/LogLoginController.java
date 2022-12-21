package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.LogLoginBiz;
import com.faber.api.base.admin.entity.LogLogin;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * BASE-登录日志
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-27 17:09:01
 */
@FaLogBiz("登录日志")
@RestController
@RequestMapping("/api/base/admin/logLogin")
public class LogLoginController extends BaseController<LogLoginBiz, LogLogin, Integer> {

}