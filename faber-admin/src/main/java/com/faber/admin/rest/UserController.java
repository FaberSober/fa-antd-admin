package com.faber.admin.rest;

import com.faber.admin.biz.PermissionBiz;
import com.faber.admin.biz.UserBiz;
import com.faber.admin.entity.User;
import com.faber.admin.vo.FrontUser;
import com.faber.admin.vo.UserAccountVo;
import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.rest.BaseController;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.Map;

/**
 * ${DESCRIPTION}
 */
@RestController
@RequestMapping("/api/admin/user")
public class UserController extends BaseController<UserBiz, User> {

    @Resource
    private PermissionBiz permissionBiz;

    @RequestMapping(value = "/front/info", method = RequestMethod.GET)
    @ResponseBody
    @ApiOperation(value = "传入token返回用户信息")
    public ObjectRestResponse<FrontUser> getUserInfo() throws Exception {
        FrontUser userInfo = permissionBiz.getUserInfo();
        return new ObjectRestResponse<FrontUser>().data(userInfo);
    }

    @RequestMapping(value = "/resetPwd", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse resetPwd(@RequestBody Map<String, Object> params) {
        return baseBiz.resetPwd(params);
    }

    /**
     * 获取个人账户基本信息
     */
    @RequestMapping(value = "/account/base", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse accountBase() {
        User user = baseBiz.selectById(getCurrentUserId());
        return new ObjectRestResponse().data(user);
    }

    /**
     * 更新个人账户基本信息
     */
    @RequestMapping(value = "/account/base/update", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse accountBaseUpdate(@Valid @RequestBody UserAccountVo vo) {
        baseBiz.accountBaseUpdate(getCurrentUserId(), vo);
        return ok();
    }

    /**
     * 更新个人账户密码
     */
    @RequestMapping(value = "/account/base/updatePwd", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse accountBaseUpdatePwd(@RequestBody Map<String, Object> params) {
        baseBiz.accountBaseUpdatePwd(getCurrentUserId(), params);
        return ok();
    }

    /**
     * 更新账户ApiToken
     */
    @RequestMapping(value = "/account/base/updateApiToken", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse accountBaseUpdateApiToken(@RequestBody Map<String, Object> params) {
        baseBiz.accountBaseUpdateApiToken(getCurrentUserId());
        return ok();
    }

    /**
     * 管理员批量更新账户密码
     */
    @RequestMapping(value = "/account/admin/updatePwd", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse accountAdminUpdatePwd(@RequestBody Map<String, Object> params) {
        baseBiz.accountAdminUpdatePwd(params);
        return ok();
    }

    /**
     * 管理员批量删除账户
     */
    @RequestMapping(value = "/account/admin/delete", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse accountAdminDelete(@RequestBody Map<String, Object> params) {
        baseBiz.accountAdminDelete(params);
        return ok();
    }

}
