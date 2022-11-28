package com.faber.buzz.admin.rest;

import com.faber.buzz.admin.biz.LogLoginBiz;
import com.faber.buzz.admin.entity.LogLogin;
import com.faber.common.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * BASE-登录日志
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-27 17:09:01
 */
@RestController
@RequestMapping("/api/admin/logLogin")
public class LogLoginController extends BaseController<LogLoginBiz, LogLogin, Integer> {

}