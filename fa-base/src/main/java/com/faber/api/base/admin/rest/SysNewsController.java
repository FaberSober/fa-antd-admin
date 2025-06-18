package com.faber.api.base.admin.rest;

import com.faber.core.annotation.FaLogBiz;
import com.faber.core.web.rest.BaseController;
import com.faber.api.base.admin.biz.SysNewsBiz;
import com.faber.api.base.admin.entity.SysNews;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * BASE-系统-新闻
 *
 * @author xu.pengfei
 * @email faberxu@gmail.com
 * @date 2023-12-18 10:17:27
 */
@FaLogBiz("BASE-系统-新闻")
@RestController
@RequestMapping("/api/base/admin/sysNews")
public class SysNewsController extends BaseController<SysNewsBiz, SysNews, Integer> {

}