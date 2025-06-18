package com.faber.api.base.demo.websocket;

import cn.hutool.json.JSONObject;
import com.faber.config.websocket.WsBaseService;
import com.faber.config.websocket.WsClientInfoEntity;
import com.faber.core.annotation.FaWsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;


@Slf4j
@Component
@FaWsService(type = WsTestService.TYPE)
public class WsTestService implements WsBaseService {

    public static final String TYPE = "test";

    @Override
    public void onMessage(WsClientInfoEntity entity, JSONObject data) {
        log.info("收到消息：{}", data.toString());
        String msg = data.getStr("msg");
        entity.sendMessage(TYPE, msg + " - received!");
    }

}
