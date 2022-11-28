package com.faber.common.exception.auth;


import com.faber.common.constant.CommonConstants;
import com.faber.common.exception.BaseException;

/**
 * 用户无效
 * @author xu.pengfei
 * @date 2022/11/28 14:18
 */
public class UserInvalidException extends BaseException {
    public UserInvalidException() {
        super("用户无效", CommonConstants.EX_USER_PASS_INVALID_CODE);
    }

    public UserInvalidException(String message) {
        super(message, CommonConstants.EX_USER_PASS_INVALID_CODE);
    }
}
