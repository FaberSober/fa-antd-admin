package com.faber.admin.biz;

import com.faber.admin.entity.User;
import com.faber.admin.util.jwt.JWTInfo;
import com.faber.admin.util.user.JwtAuthenticationRequest;
import com.faber.admin.util.user.JwtTokenUtil;
import com.faber.admin.vo.UserInfo;
import com.faber.common.exception.BuzzException;
import com.faber.common.exception.auth.UserInvalidException;
import org.apache.commons.collections4.MapUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.util.Map;

@Service
public class AuthBiz {

    @Resource
    private JwtTokenUtil jwtTokenUtil;

    @Resource
    private PermissionBiz permissionBiz;

    @Resource
    private UserBiz userBiz;

    public String login(JwtAuthenticationRequest authenticationRequest) throws Exception {
        UserInfo info = permissionBiz.validate(authenticationRequest.getUsername(), authenticationRequest.getPassword());
        if (!StringUtils.isEmpty(info.getId())) {
            return jwtTokenUtil.generateToken(new JWTInfo(info.getUsername(), info.getId() + "", info.getName()));
        }
        throw new UserInvalidException("用户不存在或账户密码错误！");
    }

    public String loginByTel(Map<String, Object> params) throws Exception {
        String tel = MapUtils.getString(params, "tel");


        long count = userBiz.lambdaQuery().eq(User::getMobilePhone, tel).count();
        if (count < 1) {
            throw new BuzzException("该手机号对应账户不存在，请确认。");
        }
        if (count > 1) {
            throw new BuzzException("该手机号对应多个账户，请联系管理员确认。");
        }

        User info = userBiz.getUserByMobilePhone(tel);
        if (!StringUtils.isEmpty(info.getId())) {
            return jwtTokenUtil.generateToken(new JWTInfo(info.getUsername(), info.getId() + "", info.getName()));
        }
        throw new UserInvalidException("账户信息未找到，请联系管理员！");
    }

    public String loginByUserId(Map<String, Object> params) throws Exception {
        String userId = MapUtils.getString(params, "userId");

        User info = userBiz.getById(userId);
        if (info != null && !StringUtils.isEmpty(info.getId())) {
            return jwtTokenUtil.generateToken(new JWTInfo(info.getUsername(), info.getId() + "", info.getName()));
        }
        throw new UserInvalidException("账户信息未找到，请联系管理员！");
    }

}
