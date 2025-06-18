package com.faber.config.websocket;

import cn.hutool.json.JSONObject;

public interface WsBaseService {

    void onMessage(WsClientInfoEntity entity, JSONObject msg);

}
