package com.faber.core.config.websocket;

public class ServiceException extends RuntimeException {

    private Integer code;

    private String msg;

    public ServiceException(Integer code, String msg) {
        super();
        this.msg = msg;
        this.code = code;
    }

    public ServiceException(String msg) {
        this(1, msg);
    }

    @Override
    public String getMessage() {
        return msg;
    }

    /**
     * xx
     * @return code
     */
    public Integer getCode() {
        return code;
    }
}

