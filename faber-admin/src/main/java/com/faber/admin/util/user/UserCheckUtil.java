package com.faber.admin.util.user;

import com.faber.admin.entity.User;
import com.faber.common.constant.DictConstants;
import com.faber.common.enums.DelStateEnum;
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
        if (!DictConstants.CommonUserStatus.Value.NORMAL.equals(user.getStatus())) {
            throw new UserInvalidException("账户被冻结，请联系管理员");
        }
        if (user.getDelState() == DelStateEnum.DELETED) {
            throw new UserInvalidException("账户被注销，请联系管理员");
        }
    }

}
