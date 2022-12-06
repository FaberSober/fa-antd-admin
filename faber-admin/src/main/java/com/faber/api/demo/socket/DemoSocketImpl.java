package com.faber.api.demo.socket;

import com.corundumstudio.socketio.SocketIOServer;
import com.faber.config.socketio.FaSocketUtils;
import com.faber.config.socketio.SocketIOService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;


/**
 * @author xupengfei
 * @email faberxu@gmail.com
 * @date 2022/12/5 17:38
 */
@Slf4j
@Service
public class DemoSocketImpl implements SocketIOService {

    @Override
    public void addListener(SocketIOServer server) {
        server.addEventListener("chatevent", Map.class, (client, map, ackRequest) -> {
            String clientIp = FaSocketUtils.getIpByClient(client);
            log.debug(clientIp + " *********************** " + "chatevent");
            log.debug("data: " + map.toString());
            map.put("message", map.get("message") + "[已收到]");
            client.sendEvent("chatevent", map);
        });
    }

}
