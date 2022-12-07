package com.faber.core.config.socket;

import com.corundumstudio.socketio.SocketIOClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * socket帮助类
 * @author xupengfei
 * @email faberxu@gmail.com
 * @date 2022/12/6 09:34
 */
public class FaSocketUtils {

    /**
     * 获取连接的客户端ip地址
     *
     * @param client: 客户端
     * @return: java.lang.String
     */
    public static String getIpByClient(SocketIOClient client) {
        String sa = client.getRemoteAddress().toString();
        return sa.substring(1, sa.indexOf(":"));
    }

    /**
     * 获取客户端url参数
     * @param client
     * @return
     */
    public static String getParamsByClient(SocketIOClient client, String key) {
        Map<String, List<String>> params = client.getHandshakeData().getUrlParams();// 获取客户端url参数
        List<String> list = params.get(key);
        if (list == null || list.isEmpty()) return null;
        return list.get(0);
    }

    public static Map<String, Object> genRet(int status, String message) {
        Map<String, Object> ret = new HashMap<>();
        ret.put("status", status);
        ret.put("message", message);
        return ret;
    }

    public static void pushMessageToUser(SocketIOClient client, String pushEvent, Object msgContent) {
        if (client != null) {
            client.sendEvent(pushEvent, msgContent);
        }
    }

}
