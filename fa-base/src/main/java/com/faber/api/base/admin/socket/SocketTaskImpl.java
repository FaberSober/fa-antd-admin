//package com.faber.api.base.admin.socket;
//
//import com.corundumstudio.socketio.SocketIOClient;
//import com.corundumstudio.socketio.SocketIOServer;
//import com.faber.core.config.socket.FaSocketUtils;
//import com.faber.core.config.socket.SocketIOService;
//import com.faber.core.vo.socket.SocketTaskVo;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Service;
//
//import java.util.Map;
//import java.util.concurrent.ConcurrentHashMap;
//
//
///**
// * 通用任务执行socket
// */
//@Slf4j
//@Service
//public class SocketTaskImpl implements SocketIOService {
//
//    /**
//     * 存放已登录连接的客户端。
//     * Key: 任务ID
//     * SocketIOClient: 设备的socket.io连接
//     */
//    protected static Map<String, SocketIOClient> clientMap = new ConcurrentHashMap<>();
//
//    @Override
//    public void addListener(SocketIOServer server) {
//        server.addEventListener("link_task", String.class, (client, data, ackRequest) -> {
//            String clientIp = FaSocketUtils.getIpByClient(client);
//            log.debug("************ 客户端： " + clientIp + " [link_task] ************");
//            log.debug("data: " + data);
//            clientMap.put(data, client);
//        });
//    }
//
//    /**
//     * 发送任务进度
//     */
//    public static void sendProgress(SocketTaskVo socketTaskVo) {
//        if (!clientMap.containsKey(socketTaskVo.getTaskId())) return;
//
//        clientMap.get(socketTaskVo.getTaskId()).sendEvent("on_progress", socketTaskVo);
//    }
//
//}
