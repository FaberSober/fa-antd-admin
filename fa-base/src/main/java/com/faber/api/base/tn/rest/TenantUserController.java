package com.faber.api.base.tn.rest;

import com.faber.api.base.tn.biz.TenantUserBiz;
import com.faber.api.base.tn.entity.TenantUser;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@FaLogBiz("租户用户关联")
@RestController
@RequestMapping("/api/base/tn/tenantUser")
public class TenantUserController extends BaseController<TenantUserBiz, TenantUser, String> {

    @GetMapping("/myTenants")
    public Ret<List<TenantUser>> myTenants() {
        return ok(baseBiz.getUserTenants(getCurrentUserId()));
    }

}
