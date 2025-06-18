package com.faber.core.config.websocket;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

/**
 * WebSocketConfig类的主要功能是配置和管理WebSocket端点，
 * 确保它们在应用程序启动时被正确初始化和注册，以便能够处理WebSocket连接和通信。
 *
 * @author qf
 * @since 2024/08/29 20:02
 */
@Configuration
public class WebSocketConfig {

    /**
     * 该方法用来创建并返回一个ServerEndpointExporter实例。
     * 这个实例的作用是扫描并自动配置所有使用@ServerEndpoint注解标记的WebSocket端点
     *
     * @return ServerEndpointExporter：这是一个用于自动检测和管理WebSocket端点的类。
     *          通过将其实例化并配置为Spring管理的Bean，可以确保所有WebSocket端点在应用程序启动时被自动初始化和注册。
     */
    @Bean
    public ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter();
    }

}

