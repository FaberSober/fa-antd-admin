package com.faber.core.exception.auth;


import com.faber.core.constant.CommonConstants;
import com.faber.core.exception.BaseException;

/**
 * 用户设备静止访问
 * @author xu.pengfei
 * @date 2022/11/28 14:19
 */
public class UserDeviceInvalidException extends BaseException {
    public UserDeviceInvalidException(String message) {
        super(message, CommonConstants.EX_USER_INVALID_DEVICE_CODE);
    }
}
