package com.faber.api.base.admin.socket;

import cn.hutool.core.collection.ConcurrentHashSet;
import cn.hutool.json.JSONObject;
import com.faber.config.websocket.WsBaseService;
import com.faber.config.websocket.WsClientInfoEntity;
import com.faber.core.annotation.FaWsService;
import com.faber.core.config.logmonitor.LoggerMessage;
import com.faber.core.config.logmonitor.LoggerQueue;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.Executor;

@Slf4j
@Service
@FaWsService(type = LogWebSocketImpl.TYPE)
public class LogWebSocketImpl implements WsBaseService, CommandLineRunner {
    public static final String TYPE = "WebSocketLogMonitor";

    private static final Set<WsClientInfoEntity> uavWebSocketInfoSet = new ConcurrentHashSet<>();

    @Autowired Executor executor;

    @Override
    public void onMessage(WsClientInfoEntity entity, JSONObject msg) {
        String action = msg.getStr("action");
        switch (action) {
            case "start": {
                uavWebSocketInfoSet.add(entity);
            }
            break;
            case "stop": {
                uavWebSocketInfoSet.remove(entity);
            }
            break;
        }
    }

    public static void sendInfo(LoggerMessage loggerMessage) {
        for (WsClientInfoEntity client : uavWebSocketInfoSet) {
            client.sendMessage(TYPE, loggerMessage);
        }
    }

    public void startMonitor() {
        executor.execute(() -> {
            // 线程中执行
            while (true) {
                try {
                    LoggerMessage log = LoggerQueue.getInstance().poll();
                    if (log != null) {
                        sendInfo(log);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

    }

    @Override
    public void run(String... args) throws Exception {
        log.info("------------ 系统监听日志 BEGIN ------------>>>");
        // TODO 需要优化为有开启监听的时候才执行
        // this.startMonitor();
    }

}
