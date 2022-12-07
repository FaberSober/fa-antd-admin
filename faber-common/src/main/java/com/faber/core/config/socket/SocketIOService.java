package com.faber.core.config.socket;

import com.corundumstudio.socketio.SocketIOServer;

/**
 * @author xupengfei
 * @email faberxu@gmail.com
 * @date 2022/12/6 09:34
 */
public interface SocketIOService {

    /**
     * 添加socket监听接口
     */
    void addListener(SocketIOServer server);

}
