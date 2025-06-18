package com.faber.base.socket;

import io.socket.client.IO;
import io.socket.client.Socket;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;

import java.net.URISyntaxException;

@Slf4j
public class SocketioTest {

    @Test
    public void testHello() throws URISyntaxException, InterruptedException {
        final Socket socket = getSocket();
        socket.on(Socket.EVENT_CONNECT, args1 -> socket.send("hello..."));
        Thread.sleep(3000);
    }

    @Test
    public void testClient() throws URISyntaxException, InterruptedException {
        final Socket socket = getSocket();

        socket.on(Socket.EVENT_CONNECT, args1 -> socket.send("hello..."));

        // 自定义事件`connected` -> 接收服务端成功连接消息
        socket.on("connected", objects -> log.debug("服务端:" + objects[0].toString()));
        // 自定义事件`disconnect` -> 接收服务端成功连接消息
        socket.on("disconnect", objects -> log.debug("服务端:" + objects[0].toString()));

        // 自定义事件`push_data_event` -> 接收服务端消息
        socket.on("push_data_event", objects -> log.debug("服务端:" + objects[0].toString()));

        // 自定义事件`myBroadcast` -> 接收服务端广播消息
        socket.on("myBroadcast", objects -> log.debug("服务端：" + objects[0].toString()));

        socket.connect();

//        while (true) {
//            Thread.sleep(3000);
//            // 自定义事件`push_data_event` -> 向服务端发送消息
//            socket.emit("push_data_event", "发送数据 " + DateUtil.now());
//
//            JSONObject json = new JSONObject();
//            json.set("userName", "xx");
//            json.set("message", "");
//            socket.emit("ackevent1", json.toString());
//        }
    }

    private String getMsg(Object... objects) {
        String msg = "";
        if (objects != null && objects.length > 0) {
            msg = objects[0].toString();
        }
        return msg;
    }


    @Test
    public void connect() throws URISyntaxException, InterruptedException {
        Socket socket = getSocket();
        socket.on(Socket.EVENT_CONNECT, args1 -> socket.send("hello..."));

        // 自定义事件`connected` -> 接收服务端成功连接消息
        socket.on("connected", objects -> {
            log.debug("connected {}", "server:" + getMsg(objects));

            sendMsg(socket);
        });
        socket.on("disconnect", objects -> {
            log.debug("disconnect {}", "server:" + getMsg(objects));
        });

        // 自定义事件`ping` -> 接收服务端消息
        socket.on("ping", objects -> {
            log.debug("ping {}", "server:" + getMsg(objects));
        });

        socket.on("chatevent", objects -> {
            log.debug("chatevent {}", "server:" + getMsg(objects));
        });
        socket.on("hello", objects -> {
            log.debug("hello {}", "server:" + getMsg(objects));
        });

        socket.connect();

        Thread.sleep(3000);
    }

    private void sendMsg(Socket socket) {
        ChatObject chatObject = new ChatObject();
        chatObject.setUserName("client1");
        chatObject.setMessage("hello");
        socket.emit("chatevent", chatObject.toString());

//        Map<String, Object> map = new HashMap<>();
//        map.put("userName", "client1");
//        map.put("message", "hello");
//        socket.emit("chatevent", map);
//
//        JSONObject json = new JSONObject();
//        json.put("userName", "client1");
//        json.put("message", "hello");
//        socket.emit("chatevent", json.toJSONString());
//
//        socket.emit("hello", "foo");
    }

    private Socket getSocket() throws URISyntaxException {
        // 服务端socket.io连接通信地址
        String url = "http://127.0.0.1:8081";
//        String url = "http://127.0.0.1:9092";
//        String url = "http://file.web.socket.dward.cn";

        IO.Options options = new IO.Options();
        options.transports = new String[]{"websocket"};
        options.reconnectionAttempts = 2;
        // 失败重连的时间间隔
        options.reconnectionDelay = 1000;
        // 连接超时时间(ms)
        options.timeout = 500;

        return IO.socket(url, options);
    }

}
