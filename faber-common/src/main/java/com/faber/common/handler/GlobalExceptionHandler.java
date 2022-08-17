package com.faber.common.handler;

import com.faber.common.constant.CommonConstants;
import com.faber.common.exception.BaseException;
import com.faber.common.exception.auth.UserInvalidException;
import com.faber.common.exception.auth.UserNoPermissionException;
import com.faber.common.exception.auth.UserTokenException;
import com.faber.common.msg.BaseResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.servlet.http.HttpServletResponse;

/**
 * 统一拦截异常并处理
 */
@ControllerAdvice("com.faber")
//@ControllerAdvice
@ResponseBody
public class GlobalExceptionHandler {
    private Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(UserTokenException.class)
    public BaseResponse userTokenExceptionHandler(HttpServletResponse response, UserTokenException ex) {
//        logger.error(ex.getMessage(), ex);
        return new BaseResponse(ex.getStatus(), ex.getMessage());
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(UserInvalidException.class)
    public BaseResponse userInvalidExceptionHandler(HttpServletResponse response, UserInvalidException ex) {
//        logger.error(ex.getMessage(), ex);
        return new BaseResponse(ex.getStatus(), ex.getMessage());
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(UserNoPermissionException.class)
    public BaseResponse userNoPermissionExceptionHandler(HttpServletResponse response, UserNoPermissionException ex) {
//        logger.error(ex.getMessage(), ex);
        return new BaseResponse(ex.getStatus(), ex.getMessage());
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(BaseException.class)
    public BaseResponse baseExceptionHandler(HttpServletResponse response, BaseException ex) {
        logger.error(ex.getMessage(), ex);
        return new BaseResponse(ex.getStatus(), ex.getMessage());
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(Exception.class)
    public BaseResponse otherExceptionHandler(HttpServletResponse response, Exception ex) {
        logger.error(ex.getMessage(), ex);
        String errMsg = ex.getMessage();
        return new BaseResponse(CommonConstants.EX_OTHER_CODE, errMsg);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public BaseResponse handleValidationExceptions(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        return new BaseResponse(CommonConstants.EX_OTHER_CODE, msg);
    }

}
