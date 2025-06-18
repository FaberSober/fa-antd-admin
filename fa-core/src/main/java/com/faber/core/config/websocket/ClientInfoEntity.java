package com.faber.core.config.websocket;

import cn.hutool.json.JSONUtil;
import jakarta.websocket.Session;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * WebSocket client info entity
 */
@Data
public class ClientInfoEntity {

    /**
     * 客户端唯一标识
     */
    private String token;

    /**
     * 客户端连接的session
     */
    private Session session;

    /**
     * 连接存活时间
     */
    private LocalDateTime existTime;

    public void sendSuccess() {
        this.sendMessage(WsRet.success());
    }

    /**
     * send message async remote
     * @param wsRet
     */
    public void sendMessage(WsRet wsRet) {
        String msgStr = JSONUtil.toJsonStr(wsRet);
        this.session.getAsyncRemote().sendText(msgStr);
    }

    public void sendMessage(String type, Object data) {
        sendMessage(WsRet.success(type, data));
    }

}
