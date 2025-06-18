# WebSocket

# 发送数据
## 发送简单文本
```java
WsHolder.sendMessage(WsTypeEnum.PLAIN_TEXT, "开始下载NWP数据...");
```

# 如何使用
## 接受数据
```typescript jsx
import useBus from "use-bus";

useBus(
    ['@@ws/RECEIVE/WebSocketTaskDemo'],
    ({ type, payload }) => {
        console.log(type, payload);
    },
    [],
)
```

## 本项目websocket数据格式说明
> 统一使用JSON格式
### 请求参数
```json
{
  "type": "request", // 请求类型，对应分发到不同的业务
  "data": {
    "id": "123456",
    "content": "Hello, World!"
  }
}
```

### 返回参数
```json
{
  "code": 0, // 错误码
  "type": "request", // 返回类型，对应分发到不同的业务
  "msg": "success", // 错误信息
  "data": {
    "id": "123456",
    "content": "Hello, World!"
  }
}
```

## websocket中Session的 getBasicRemote() 和 getAsyncRemote() 方法的区别
websocket中Session的 getBasicRemote() 和 getAsyncRemote() 方法有以下主要区别

同步 vs 异步
1. getBasicRemote()：同步发送消息的方式。发送消息时会阻塞当前线程，直到消息发送完成。
2. getAsyncRemote()：异步发送消息的方式。发送消息后立即返回，不阻塞当前线程。

性能和并发
1. getBasicRemote()：由于同步特性，可能会导致性能瓶颈，尤其是在高并发场景下。
2. getAsyncRemote()：异步特性使得它更适合高并发场景，提高系统的响应速度和吞吐量。

使用场景
1. getBasicRemote()：适用于消息量较小且对实时性要求较高的场景。
2. getAsyncRemote()：适用于大量消息发送或者对实时性要求相对较低的场景。

总之两者的使用场景为：
- getBasicRemote()：同步发送，适合小量消息和高实时性需求。
- getAsyncRemote()：异步发送，适合大量消息和高并发场景。

原文链接：https://blog.csdn.net/weixin_46425661/article/details/141897511

## Reference
[Springboot整合websocket(附详细案例代码)](https://blog.csdn.net/weixin_46425661/article/details/141897511)
