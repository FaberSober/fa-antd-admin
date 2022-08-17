package com.faber.common.exception.auth;


import com.faber.common.constant.CommonConstants;
import com.faber.common.exception.BaseException;

/**
 * 用户令牌无效
 */
public class UserTokenException extends BaseException {
    public UserTokenException(String message) {
        super(message, CommonConstants.EX_USER_INVALID_CODE);
    }
}
