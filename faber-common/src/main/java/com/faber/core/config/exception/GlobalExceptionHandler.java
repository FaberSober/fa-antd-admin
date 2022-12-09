package com.faber.core.config.exception;

import com.faber.core.constant.CommonConstants;
import com.faber.core.exception.BaseException;
import com.faber.core.exception.auth.UserInvalidException;
import com.faber.core.exception.auth.UserNoPermissionException;
import com.faber.core.exception.auth.UserTokenException;
import com.faber.core.vo.msg.BaseRet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;
import java.util.stream.Collectors;

/**
 * 统一拦截异常并处理
 * @author xupengfei
 */
@ControllerAdvice("com.faber")
//@ControllerAdvice
@ResponseBody
public class GlobalExceptionHandler {
    private Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(UserTokenException.class)
    public BaseRet userTokenExceptionHandler(HttpServletResponse response, UserTokenException ex) {
        return new BaseRet(ex.getStatus(), ex.getMessage());
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(UserInvalidException.class)
    public BaseRet userInvalidExceptionHandler(HttpServletResponse response, UserInvalidException ex) {
        return new BaseRet(ex.getStatus(), ex.getMessage());
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(UserNoPermissionException.class)
    public BaseRet userNoPermissionExceptionHandler(HttpServletResponse response, UserNoPermissionException ex) {
        return new BaseRet(ex.getStatus(), ex.getMessage());
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(BaseException.class)
    public BaseRet baseExceptionHandler(HttpServletResponse response, BaseException ex) {
        logger.error(ex.getMessage(), ex);
        return new BaseRet(ex.getStatus(), ex.getMessage());
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(Exception.class)
    public BaseRet otherExceptionHandler(HttpServletResponse response, Exception ex) {
        logger.error(ex.getMessage(), ex);
        String errMsg = ex.getMessage();
        return new BaseRet(CommonConstants.EX_OTHER_CODE, errMsg);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(value = {BindException.class, ValidationException.class, MethodArgumentNotValidException.class})
    public BaseRet handleValidationExceptions(Exception e) {
        String errMsg = "";
        if (e instanceof MethodArgumentNotValidException) {
            // BeanValidation exception
            MethodArgumentNotValidException ex = (MethodArgumentNotValidException) e;
            errMsg = ex.getBindingResult().getAllErrors().stream()
                    .map(GlobalExceptionHandler::objectErrorToStr)
                    .collect(Collectors.joining("; "));
        } else if (e instanceof ConstraintViolationException) {
            // BeanValidation GET simple param
            ConstraintViolationException ex = (ConstraintViolationException) e;
            errMsg = ex.getConstraintViolations().stream()
                    .map(ConstraintViolation::getMessage)
                    .collect(Collectors.joining("; "));
        } else if (e instanceof BindException) {
            // BeanValidation GET object param
            BindException ex = (BindException) e;
            errMsg = ex.getAllErrors().stream()
                    .map(GlobalExceptionHandler::objectErrorToStr)
                    .collect(Collectors.joining("; "));
        }

        return new BaseRet(CommonConstants.EX_OTHER_CODE, errMsg);
    }

    private static String objectErrorToStr(ObjectError error) {
        if (error instanceof FieldError) {
            return ((FieldError) error).getField() + ":" + error.getDefaultMessage();
        }
        return error.getDefaultMessage();
    }

}
