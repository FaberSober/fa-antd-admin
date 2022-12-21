package com.faber.core.exception.auth;


import com.faber.core.constant.CommonConstants;
import com.faber.core.exception.BaseException;

/**
 * 用户令牌无效
 * @author xu.pengfei
 * @date 2022/11/28 14:19
 */
public class UserTokenException extends BaseException {
    public UserTokenException(String message) {
        super(message, CommonConstants.EX_USER_INVALID_CODE);
    }
}
