# 消息与实时通信

归并自 `ai.md`、`msg.md`、`socket.md`、`websocket.md`、`mqtt.md` 和 `kafka.md`。

## 目录

- 技术选择
- SSE 与流式响应
- 站内信与短信
- 项目 WebSocket
- Socket.IO
- MQTT
- Kafka

## 技术选择

- 单请求、服务端持续输出：使用 SSE。
- 浏览器双向长连接且沿用项目统一消息格式：使用项目 WebSocket。
- 既有客户端明确使用 Socket.IO 协议：使用 netty-socketio 方案。
- 设备/物联网主题发布订阅：使用 MQTT。
- 服务间高吞吐、可消费确认或事务消息：使用 Kafka。
- 用户站内通知和已配置短信模板：使用项目消息中心。

不要仅因“实时”同时引入多套机制。先搜索目标模块和当前依赖，复用已经启用的设施。

## SSE 与流式响应

返回 `SseEmitter` 或 `produces = MediaType.TEXT_EVENT_STREAM_VALUE` 的接口必须绕过 `RequestAgainFilter`。该过滤器默认包装并缓存响应，等待请求完成后统一写回，会破坏实时输出。

当前 `FilterInitRunner` 先扫描带 `@NoFilter` 的类，再注册类中同样带 `@NoFilter` 的方法，因此类和流式方法必须同时标注：

```java
@NoFilter
@FaLogBiz("大模型")
@RestController
@RequestMapping("/api/ai/llm/chat")
public class AiChatController {

    @NoFilter
    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(@RequestBody ChatReqVo req) {
        return chatBiz.stream(req);
    }
}
```

- 导入 `com.faber.core.config.annotation.NoFilter`。
- 类必须有 `@RequestMapping`；`FilterInitRunner` 用类路径和方法路径拼接 skip URL。
- 方法显式声明 `TEXT_EVENT_STREAM_VALUE`。
- 处理超时、完成、错误和客户端断开，及时清理后台任务/订阅。
- 不把 token、完整提示词、隐私数据或超大响应写入日志。
- 变更映射注解形式后检查 `FilterInitRunner` 当前支持情况；它当前只解析 `@RequestMapping`、`@GetMapping`、`@PostMapping`。

## 站内信与短信

消息模板在应用配置的消息模板区域维护，真实 access key、secret、签名等通过环境配置注入，不写入源码或 skill。

定义业务消息 Bean 时：

- 继承当前 `MsgSendConfig`。
- 使用 `@PropKey` 关联模板 key，并按需开启短信。
- Bean 字段名必须和模板占位符 keys 一致。
- 设置稳定的 `buzzType`、`buzzId` 便于追踪业务对象。

发送站内信优先使用 `MsgHelper`。需要以管理员身份发布时按现有调用使用 `BaseContextHandler.useAdmin()`，并确保调用结束后不会污染线程上下文。明确接收人、渠道、重复发送/重试和失败记录。

## 项目 WebSocket

服务端发送前设置业务频道，再发布统一类型消息：

```java
WsHolder.setChannel("PullNewData");
WsHolder.sendMessage(WsTypeEnum.PLAIN_TEXT, "开始处理...");
```

项目 WebSocket 消息统一使用 JSON。请求和响应至少保持业务 `type` 与 `data`，响应还使用项目当前的 `code`、`msg`：

```json
{
  "code": 0,
  "type": "request",
  "msg": "success",
  "data": {}
}
```

频道名和 `type` 是前后端契约，先搜索前端订阅事件再修改。大量发送优先异步 remote；需要严格同步完成的小消息才考虑 basic remote。处理断线、心跳、并发发送、消息大小和鉴权。

## Socket.IO

只有现有客户端依赖 Socket.IO 时，实现项目的 `SocketIOService` 并在 `addListener(SocketIOServer server)` 注册事件：

```java
@Service
public class DemoSocketImpl implements SocketIOService {
    @Override
    public void addListener(SocketIOServer server) {
        server.addEventListener("chatEvent", ChatObject.class, (client, data, ack) -> {
            client.sendEvent("chatEvent", data);
        });
    }
}
```

依赖版本必须与客户端 Socket.IO 协议版本兼容。不要照搬历史文档中的旧版本号；以父 POM和已锁定依赖为准。校验事件输入并避免记录敏感载荷。

## MQTT

使用 MQTT 时通常包含：配置属性、连接 Service、`MqttCallbackExtended` 回调、Spring 初始化配置。

- broker、用户名、密码使用环境变量/密钥管理；示例中只写 `${MQTT_HOST}` 等占位符。
- client ID 必须在部署实例间唯一，可使用应用/实例标识加随机后缀。
- 明确 QoS、clean session、retained、自动重连、连接超时、keepalive 和订阅主题。
- `connectComplete` 重连后恢复必要订阅；`messageArrived` 做幂等、异常隔离和耗时任务转交。
- 主题遵循项目命名空间，避免订阅过宽的通配符。

不要仅依据历史文档重新实现一套客户端；先搜索仓库当前 MQTT 配置和封装。

## Kafka

使用 `spring-kafka` 时先确认父 POM 和 Spring Boot 管理版本。生产者需明确：

- `bootstrap-servers`、key/value serializer。
- `acks`、`retries`、batch/buffer。
- 是否真的需要事务；启用时设置唯一事务前缀，并只在正确事务边界发送。

消费者需明确：

- group ID、key/value deserializer 和可信包范围。
- 单条/批量模式、并发数、offset 提交方式。
- 重试、死信、幂等、顺序性和自定义错误处理。

发送回调记录 topic/partition/offset 和必要业务标识，不记录完整敏感消息。配置中的 broker 地址、账号和证书均由环境注入。
