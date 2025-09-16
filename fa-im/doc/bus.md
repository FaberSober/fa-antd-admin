# 通讯

## 前端Bus通讯

| 通讯Key | 描述 | 来源/发起 | 监听/接收 |
|---------|------|-----------|-----------|
| `@@ws/RECEIVE/IM` | 接收WebSocket IM消息 | WebSocket服务器推送 | ImChatMsgPanel - 接收消息后更新聊天列表和消息列表，如果是当前打开的聊天则标记已读 |
| `@@event/CREATE_NEW_SINGLE` | 创建新的单聊对话 | ImUserView - 点击用户头像创建单聊 | ImChatMsgPanel - 接收到新建单聊事件后，添加到聊天列表并选中该聊天 |
| `@@api/IM_REFRESH_UNREAD_COUNT` | 刷新未读消息数量 | 1. ImChatMsgPanel - 点击聊天后标记已读<br>2. ImChatMsgPanel - 接收到新消息后标记已读 | ImHeaderCube - 刷新顶部导航栏的未读消息数量气泡 |

## 后端WebSocket通讯

后端使用 `WsHolder.sendMessage` 发送WebSocket消息，`WsTypeEnum` 中定义了消息类型。

### IM消息类型

| 类型Key | 描述 | 使用场景 | 发送内容 |
|---------|------|----------|----------|
| `WsTypeEnum.IM` | 即时通讯消息 | 1. 发送新消息时，通知其他在线用户<br>2. 退出群聊时，通知群成员更新群聊信息<br>3. 添加群成员时，通知群成员更新群聊信息 | 1. 新消息：`ImMessage` 对象，包含消息内容和发送者信息<br>2. 群聊信息：更新后的 `ImConversation` 对象
