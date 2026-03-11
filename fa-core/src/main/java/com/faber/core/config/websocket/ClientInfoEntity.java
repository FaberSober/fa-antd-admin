package com.faber.core.config.websocket;

import java.time.LocalDateTime;

import com.faber.core.utils.FaJsonUtils;

import jakarta.websocket.Session;
import lombok.Data;

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
        String msgStr = FaJsonUtils.toJSONString(wsRet); // 可以正确转换IEnum
        // 核心修正：使用 synchronized 块确保写入操作串行化
        synchronized (this.session) {
            try {
                this.session.getAsyncRemote().sendText(msgStr);
            } catch (IllegalStateException e) {
                // 推荐：捕获并记录日志，而不是让线程崩溃
                System.err.println("WebSocket 消息发送失败 (可能由于并发冲突或连接已关闭): " + e.getMessage());
                // 如果需要，这里可以添加逻辑来处理连接关闭等情况
            }
        }
    }

    public void sendMessage(String type, Object data) {
        sendMessage(WsRet.success(type, data));
    }

    public void sendMessage(String type, String channel, Object data) {
        sendMessage(WsRet.success(type, channel, data));
    }

}
