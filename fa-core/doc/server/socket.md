# socket

## 后端实现socket监听
参考代码：`faber-admin/src/main/java/com/faber/api/demo/socket/DemoSocketImpl.java`

代码如下：
```java
import com.corundumstudio.socketio.SocketIOServer;
import com.faber.core.configScene.socket.FaSocketUtils;
import com.faber.core.configScene.socket.SocketIOService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 继承SocketIOService接口，添加socket监听即可
 */
@Slf4j
@Service
public class DemoSocketImpl implements SocketIOService {

    @Override
    public void addListener(SocketIOServer server) {
        server.addEventListener("chatevent", ChatObject.class, (client, data, ackRequest) -> {
            String clientIp = FaSocketUtils.getIpByClient(client);
            log.debug(clientIp + " *********************** " + "chatevent");
            log.debug("data: " + data.toString());
            data.setMessage(data.getMessage() + "[已收到]");
            client.sendEvent("chatevent", data);
        });
    }

}

```


## socketio服务端
> 服务端使用组件[netty-socketio](https://github.com/mrniko/netty-socketio)

```xml
<!-- netty-socketio -->
<dependency>
    <groupId>com.corundumstudio.socketio</groupId>
    <artifactId>netty-socketio</artifactId>
    <version>1.7.22</version>
</dependency>
```

## socket java client
> java客户端使用[socket.io-client-java](https://github.com/socketio/socket.io-client-java)


```xml
<!-- socket.io客户端 -->
<dependency>
    <groupId>io.socket</groupId>
    <artifactId>socket.io-client</artifactId>
    <version>1.0.2</version>
    <scope>test</scope>
</dependency>
```

### Compatibility
| Client version | Socket.IO server |
| :--- | :--- |
| 0.9.x | 1.x |
| 1.x | 2.x (or 3.1.x / 4.x with allowEIO3: true) |
| 2.x | 3.x / 4.x |


