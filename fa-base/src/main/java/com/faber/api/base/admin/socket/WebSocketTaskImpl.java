package com.faber.api.base.admin.socket;

import cn.hutool.json.JSONObject;
import com.faber.config.websocket.WsBaseService;
import com.faber.config.websocket.WsClientInfoEntity;
import com.faber.core.annotation.FaWsService;
import com.faber.core.vo.socket.SocketTaskVo;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@FaWsService(type = WebSocketTaskImpl.TYPE)
public class WebSocketTaskImpl implements WsBaseService {
    public static final String TYPE = "WebSocketTaskDemo";

    private static final Map<String, WsClientInfoEntity> uavWebSocketInfoMap = new ConcurrentHashMap<String, WsClientInfoEntity>();

    @Override
    public void onMessage(WsClientInfoEntity entity, JSONObject msg) {
        String taskId = msg.getStr("taskId");
        uavWebSocketInfoMap.put(taskId, entity);
    }

    public static void sendProgress(SocketTaskVo socketTaskVo) {
        WsClientInfoEntity entity = uavWebSocketInfoMap.get(socketTaskVo.getTaskId());
        if (entity == null) return;

        entity.sendMessage(TYPE, socketTaskVo);
    }

}
