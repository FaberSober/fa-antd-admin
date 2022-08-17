package com.faber.common.exception;


import com.faber.common.constant.CommonConstants;

/**
 * 用户无效
 */
public class BuzzException extends BaseException {
    public BuzzException(String message) {
        super(message, CommonConstants.EX_OTHER_CODE);
    }
}
