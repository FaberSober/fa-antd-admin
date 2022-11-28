package com.faber.common.exception.auth;


import com.faber.common.constant.CommonConstants;
import com.faber.common.exception.BaseException;

/**
 * 用户无权限
 * @author xu.pengfei
 * @date 2022/11/28 14:18
 */
public class UserNoPermissionException extends BaseException {
    public UserNoPermissionException(String message) {
        super(message, CommonConstants.EX_USER_NO_PERMISSION);
    }
}
