package com.faber.api.base.admin.rest;

import com.faber.core.annotation.FaLogBiz;
import com.faber.core.web.rest.BaseController;
import com.faber.api.base.admin.biz.UserTokenBiz;
import com.faber.api.base.admin.entity.UserToken;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * BASE-用户token
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2023-01-24 19:10:40
 */
@FaLogBiz("BASE-用户token")
@RestController
@RequestMapping("/api/base/admin/userToken")
public class UserTokenController extends BaseController<UserTokenBiz, UserToken, Integer> {

}