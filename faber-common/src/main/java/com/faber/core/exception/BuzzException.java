package com.faber.core.exception;


import com.faber.core.constant.CommonConstants;

/**
 * 业务类型异常
 * @author xu.pengfei
 * @date 2022/11/28 14:19
 */
public class BuzzException extends BaseException {
    public BuzzException(String message) {
        super(message, CommonConstants.EX_OTHER_CODE);
    }
}
