# socket

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


