package com.faber.core.config.websocket;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WsRet implements Serializable {

    private int code = 0;
    private String type;
    private String msg = "success";
    private Object data;
    private long timestamp = 0;

    public WsRet(int code, String msg) {
        WsRet wsRet = new WsRet();
        wsRet.setCode(code);
        wsRet.setMsg(msg);
    }

    public static WsRet error(int errorCode, String msg) {
        return new WsRet(errorCode, msg);
    }

    public static WsRet success() {
        return new WsRet(0, "success");
    }

    public static WsRet success(String type, Object data) {
        return new WsRet(0, type, "success", data, System.currentTimeMillis());
    }

}
