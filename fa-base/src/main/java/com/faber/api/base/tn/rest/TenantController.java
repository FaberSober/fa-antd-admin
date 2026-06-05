package com.faber.api.base.tn.rest;

import com.faber.api.base.tn.biz.TenantBiz;
import com.faber.api.base.tn.entity.Tenant;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@FaLogBiz("租户")
@RestController
@RequestMapping("/api/base/tn/tenant")
public class TenantController extends BaseController<TenantBiz, Tenant, String> {
}
