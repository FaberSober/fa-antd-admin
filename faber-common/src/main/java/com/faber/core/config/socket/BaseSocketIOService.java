package com.faber.core.config.socket;

import cn.hutool.core.util.ClassUtil;
import cn.hutool.extra.spring.SpringUtil;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author xupengfei
 * @email faberxu@gmail.com
 * @date 2022/12/6 09:38
 */
@Slf4j
@Service
public class BaseSocketIOService {

    @Autowired
    private SocketIOServer server;

    /**
     * 存放已登录连接的客户端。
     * Key: 用户ID
     * SocketIOClient: 设备的socketio连接
     */
    protected static Map<String, SocketIOClient> clientMap = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        start();
    }

    /**
     * Spring IoC容器在销毁SocketIOServiceImpl Bean之前关闭,避免重启项目服务端口占用问题
     */
    @PreDestroy
    private void destroy() {
        if (server != null) {
            server.stop();
            server = null;
        }
    }

    public void start() {
        // 监听客户端连接
        server.addConnectListener(client -> {
            log.debug("************ 客户端： " + FaSocketUtils.getIpByClient(client) + " 已连接 ************");
            // 自定义事件`connected` -> 与客户端通信  （也可以使用内置事件，如：Socket.EVENT_CONNECT）
            client.sendEvent("connected", "你成功连接上了哦...");
            // 这里可以加clientMap加入逻辑
        });

        // 监听客户端断开连接
        server.addDisconnectListener(client -> {
            String clientIp = FaSocketUtils.getIpByClient(client);
            log.debug(clientIp + " *********************** " + "客户端已断开连接");
            client.disconnect();
            // 这里可以加clientMap移除逻辑
        });

        // 扫描实现了SocketIOService的业务bean，注册server监听接口
        ClassUtil.scanPackageBySuper("com.faber", SocketIOService.class).forEach(clazz -> {
            SocketIOService impl = (SocketIOService) SpringUtil.getBean(clazz);
            impl.addListener(server);
        });

        // 启动服务
        server.start();
    }

}
