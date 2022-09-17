package com.faber.admin.rest;

import com.faber.admin.biz.ResourceAuthorityBiz;
import com.faber.admin.entity.ResourceAuthority;
import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.rest.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
@RequestMapping("/api/admin/resourceAuthority")
public class ResourceAuthorityController extends BaseController<ResourceAuthorityBiz, ResourceAuthority> {

    /**
     * 更新角色权限
     */
    @RequestMapping(value = "/updateGroupAuth", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<Boolean> updateGroupAuth(@RequestBody Map<String, Object> params) {
        baseBiz.updateGroupAuth(params);
        return ok();
    }

}
