package com.faber.core.exception;


import com.faber.core.constant.CommonConstants;

/**
 * 未查找到数据异常
 * @author xu.pengfei
 * @date 2022/11/28 14:19
 */
public class NoDataException extends BaseException {
    public NoDataException() {
        super("No Data Found!", CommonConstants.EX_OTHER_CODE);
    }

    public NoDataException(String message) {
        super(message, CommonConstants.EX_OTHER_CODE);
    }
}
