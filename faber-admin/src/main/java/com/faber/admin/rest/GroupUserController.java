package com.faber.admin.rest;

import com.alibaba.fastjson.JSONObject;
import com.faber.admin.vo.GroupUserVo;
import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.msg.TableResultResponse;
import com.faber.common.rest.BaseController;
import com.faber.admin.biz.GroupUserBiz;
import com.faber.admin.entity.GroupUser;
import org.apache.commons.collections4.MapUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@RequestMapping("/api/admin/groupUser")
public class GroupUserController extends BaseController<GroupUserBiz, GroupUser> {

    @RequestMapping(value = "/{id}/groupUser", method = RequestMethod.GET)
    @ResponseBody
    public TableResultResponse<GroupUserVo> groupUser(@PathVariable int id, @RequestParam Map<String, Object> params) {
        return baseBiz.getGroupUsers(id, params);
    }

    @RequestMapping(value = "/groupUser", method = RequestMethod.POST)
    @ResponseBody
    public TableResultResponse<GroupUserVo> groupUser(@RequestBody Map<String, Object> params) {
        int groupId = MapUtils.getIntValue(params, "groupId", -1);
        return baseBiz.getGroupUsers(groupId, params);
    }

    @RequestMapping(value = "/{id}/addUsers", method = RequestMethod.PUT)
    @ResponseBody
    public ObjectRestResponse<Boolean> addUsers(@PathVariable int id, @RequestBody JSONObject json) {
        baseBiz.addUsers(id, json);
        return ok();
    }

}