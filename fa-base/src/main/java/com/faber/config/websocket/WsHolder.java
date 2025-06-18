package com.faber.config.websocket;

import cn.hutool.core.util.StrUtil;
import cn.hutool.extra.spring.SpringUtil;
import cn.hutool.json.JSONObject;
import com.faber.core.annotation.FaWsService;
import com.faber.core.context.BaseContextHandler;
import com.faber.core.enums.WsTypeEnum;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
public class WsHolder {

    public static final Map<String, List<WsBaseService>> SERVICE_MAP = new ConcurrentHashMap<>();

    /**
     * 添加服务
     * @param clazz
     */
    public static void addService(Class<WsBaseService> clazz) {
        FaWsService faWsServiceAnno = clazz.getAnnotation(FaWsService.class);
        if (faWsServiceAnno == null) {
            throw new RuntimeException("服务未添加@FaWsService注解");
        }

        String type = faWsServiceAnno.type();
        if (StrUtil.isEmpty(type)) {
            throw new RuntimeException("服务类型不能为空");
        }

        WsBaseService impl = (WsBaseService) SpringUtil.getBean(clazz);

        List<WsBaseService> list = SERVICE_MAP.get(type);
        if (list == null) {
            list = new java.util.ArrayList<>();
        }
        list.add(impl);
        SERVICE_MAP.put(type, list);
    }

    public static void processMessage(WsClientInfoEntity entity, String type, JSONObject msg) {
        List<WsBaseService> list = SERVICE_MAP.get(type);
        if (list == null) {
            log.warn("未找到服务：{}", type);
            return;
        }
        for (WsBaseService impl : list) {
            impl.onMessage(entity, msg);
        }
    }

    /**
     * send message to session user
     * @param type
     * @param msg
     */
    public static void sendMessage(WsTypeEnum type, Object msg) {
        sendMessage(type.getValue(), msg);
    }

    public static void sendMessage(String type, Object msg) {
        try {
            String userId = BaseContextHandler.getUserId();
            WsChatEndpoint.sendMessageToUser(userId, type, msg);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    public static void sendMessage(String userId, String type, Object msg) {
        try {
            WsChatEndpoint.sendMessageToUser(userId, type, msg);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

}
