package com.faber.config.utils.user;

import com.faber.api.base.admin.entity.User;
import com.faber.core.exception.auth.UserInvalidException;

/**
 * 用户信息检查
 * @author xu.pengfei
 * @date 2022/11/28 11:30
 */
public class UserCheckUtil {

    /**
     * 校验用户有效性
     * @param user
     */
    public static void checkUserValid(User user) {
        if (user == null) {
            throw new UserInvalidException();
        }
        if (!user.getStatus()) {
            throw new UserInvalidException("账户被冻结，请联系管理员");
        }
    }

}
