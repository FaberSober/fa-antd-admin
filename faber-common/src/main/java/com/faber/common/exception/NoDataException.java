package com.faber.common.exception;


import com.faber.common.constant.CommonConstants;

/**
 * 用户无效
 */
public class NoDataException extends BaseException {
    public NoDataException() {
        super("No Data Found!", CommonConstants.EX_OTHER_CODE);
    }
    public NoDataException(String message) {
        super(message, CommonConstants.EX_OTHER_CODE);
    }
}
