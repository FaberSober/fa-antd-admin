package com.faber.core.socket;

import com.alibaba.fastjson.JSONObject;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.websocket.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArraySet;

/**
 * websocket长链接
 *
 * @Author: xu.pengfei
 * @Email: faberxu@gmail.com
 * @Date: 2020-03-13
 */
@Data
public abstract class BaseWebSocket {

    protected final Logger _logger = LoggerFactory.getLogger(this.getClass());

    // 静态变量，用来记录当前在线连接数。应该把它设计成线程安全的。
    private static int onlineCount = 0;

    // concurrent包的线程安全Set，用来存放每个客户端对应的MyWebSocket对象。
    private static CopyOnWriteArraySet<BaseWebSocket> webSocketSet = new CopyOnWriteArraySet<>();

    // 与某个客户端的连接会话，需要通过它来给客户端发送数据
    private Session session;
    private Long userId; // 用户uid
    private Long lastTickTime; // 上一次心跳时间

    @PostConstruct
    public void init() {
        // 初始化启动定时检查线程
        new Thread(() -> {
            while (true) {
                CopyOnWriteArraySet<BaseWebSocket> webSockets = BaseWebSocket.getWebsocketList();
                webSockets.forEach(socket -> {
                    // 超过30s无心跳链接，移出该socket连接
                    if (socket.getLastTickTime() == null || socket.getLastTickTime() + 60 * 1000 < System.currentTimeMillis()) {
                        _logger.info("remove websocket for 60s dead: \t" + socket.getInfo());
                        if (socket.session != null) {
                            try {
                                socket.session.close(new CloseReason(CloseReason.CloseCodes.GOING_AWAY, ""));
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        }
                        webSockets.remove(socket);
                    }
                });
                try {
                    Thread.sleep(5 * 1000); // 每隔5s运行一次
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }

    /**
     * 连接建立成功调用的方法
     */
    @OnOpen
    public void onOpen(Session session) {
        this.session = session;
        this.setLastTickTime(System.currentTimeMillis());
        webSocketSet.add(this);     //加入set中
        addOnlineCount();           //在线数加1
        _logger.info("有新连接加入！当前在线人数为" + getOnlineCount());
        sendMessage(Msg.text("连接成功，开始同步操作"));
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose(Session session) {
        // 从set中删除
        webSocketSet.remove(findBySession(session));
        // 在线数减1
        subOnlineCount();
        _logger.info("有一连接关闭！当前在线人数为" + getOnlineCount());
    }

    /**
     * 收到客户端消息后调用的方法
     *
     * @param message 客户端发送过来的消息
     */
    @OnMessage
    public void onMessage(String message, Session session) {
//        _logger.debug("来自客户端的消息:" + message);
        try {
            JSONObject json = JSONObject.parseObject(message);
            String act = json.getString("act");

            if ("tick".equals(act)) {
                this.onMessageTick(json);
            }
        } catch (Exception e) {

        }
    }

    /**
     * 处理心跳链接
     *
     * @param json
     */
    public void onMessageTick(JSONObject json) {
        Long userId = json.getLong("userId");

        BaseWebSocket socket = findBySession(session);
        if (socket != null) {
            socket.setUserId(userId);
            socket.setLastTickTime(System.currentTimeMillis());
        }
    }

    /**
     * 发生错误时调用
     */
    @OnError
    public void onError(Session session, Throwable error) {
        _logger.warn("发生错误");
        error.printStackTrace();
    }

    private void sendMessage(BaseWebSocket webSocket, String msg) {
        if (webSocket == null || msg == null) {
            return;
        }
        webSocket.sendMessage(msg);
    }


    public void sendMessage(String message) {
        if (this.session != null) {
            _logger.info("······>>> sendMessage: " + message);
            try {
                this.session.getBasicRemote().sendText(message);
            } catch (IOException e) {
                _logger.error(e.getMessage(), e);
            }
        }
    }


    /**
     * 群发自定义消息
     */
    public void sendAll(String message) {
        for (BaseWebSocket item : webSocketSet) {
            item.sendMessage(message);
        }
    }

    public static synchronized int getOnlineCount() {
        return onlineCount;
    }

    public static synchronized void addOnlineCount() {
        BaseWebSocket.onlineCount++;
    }

    public static synchronized void subOnlineCount() {
        BaseWebSocket.onlineCount--;
    }

    /* ------------ 功能代码 ------------ */
    protected static BaseWebSocket findBySession(Session session) {
        for (BaseWebSocket item : webSocketSet) {
            if (item.session == session) {
                return item;
            }
        }
        return null;
    }

    protected static BaseWebSocket findByUserId(long userId) {
        for (BaseWebSocket item : webSocketSet) {
            if (item.userId == userId) {
                return item;
            }
        }
        return null;
    }


    public static List<Map<String, Object>> getOnlineList() {
        List<Map<String, Object>> list = new ArrayList<>();
        webSocketSet.forEach(socket -> {
            Map<String, Object> map = new HashMap<>();
            map.put("userId", socket.getUserId());
            map.put("lastTickTime", socket.getLastTickTime());
            list.add(map);
        });
        return list;
    }

    public static CopyOnWriteArraySet<BaseWebSocket> getWebsocketList() {
        return webSocketSet;
    }

    public String getInfo() {
        return "[userId=" + userId + ", lastTickTime=" + lastTickTime + "]";
    }

    /* ------------ 业务代码 ------------ */
    public static void sendMsgByUserId(long userId, String msg) {
        BaseWebSocket socket = findByUserId(userId);
        if (socket != null) {
            socket.sendMessage(msg);
        }
    }

}
