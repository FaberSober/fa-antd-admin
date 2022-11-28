package com.faber.common.utils.user;

import com.faber.admin.entity.User;
import com.faber.common.enums.BoolEnum;
import com.faber.common.exception.auth.UserInvalidException;

public class UserCheckUtil {

    /**
     * 校验用户有效性
     * @param user
     */
    public static void checkUserValid(User user) {
        if (user == null) {
            throw new UserInvalidException();
        }
        if (user.getStatus() == BoolEnum.NO) {
            throw new UserInvalidException("账户被冻结，请联系管理员");
        }
//        if (user.getDelState() == DelStateEnum.DELETED) {
//            throw new UserInvalidException("账户被注销，请联系管理员");
//        }
    }

}
