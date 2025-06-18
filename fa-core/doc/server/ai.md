# AI
## AI接口定义
1. `Controller`增加`@NoFilter`注解；
2. `Controller`下的具体方法增加`@NoFilter`注解；
3. 返回`SseEmiter`;
```java
@NoFilter // 必须添加，用于跳过某些filter
@FaLogBiz("大模型")
@RestController
@RequestMapping("/api/ai/llm/chat")
public class AiChatController extends BaseResHandler {

    @Resource AiChatBiz chatBiz;

    @NoFilter // 必须添加，用于跳过某些filter
    @FaLogOpr(value = "测试", crud = LogCrudEnum.C)
    @PostMapping(value = "/testAiChat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter testAiChat(@RequestBody TestAiChatReqVo params) {
        return chatBiz.testAiChat(params);
    }

}
```
