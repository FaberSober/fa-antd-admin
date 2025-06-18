package com.faber.core.config.websocket;

import org.springframework.context.annotation.Configuration;

import jakarta.servlet.http.HttpSession;
import jakarta.websocket.HandshakeResponse;
import jakarta.websocket.server.HandshakeRequest;
import jakarta.websocket.server.ServerEndpointConfig;
import java.util.Map;
import java.util.UUID;

/**
 * 主要用于WebSocket的握手配置
 * @author qf
 * @since 2024/08/29 19:55
 */
@Configuration
public class GetHttpSessionConfig  extends ServerEndpointConfig.Configurator {

    /**
     * 注意:  每一个客户端发起握手，端点就有一个新的实列，那么引用的这个配置也是新的实列，这里sec的用户属性也不同就不会产生冲突。
     * 修改握手机制  就是第一次http发送过来的握手
     * @param sec   服务器websocket端点的配置
     * @param request
     * @param response
     */
    @Override
    public void modifyHandshake(ServerEndpointConfig sec, HandshakeRequest request, HandshakeResponse response) {
        // 将从握手的请求中获取httpsession
        HttpSession httpSession =(HttpSession) request.getHttpSession();

        /*
         * 一般会在请求头中添加token 解析出来id作为键值对
         */
        Map<String, Object> properties = sec.getUserProperties();

        /*
         * 一个客户端和和服务器发起一次请求交互 就有一个唯一session
         * 设置唯一标识：为每个客户端生成一个唯一的UUID作为连接标识，并将其存储在UserProperties中，便于后续跟踪与管理
         */
        // properties.put(HttpSession.class.getName(),httpSession);
        String sessionKey = UUID.randomUUID().toString().replaceAll("-", "");
        properties.put("Connected",sessionKey);
    }

}

