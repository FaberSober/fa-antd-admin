# fa-im 即时通讯模块

## 模块介绍

fa-im 是一个基于 Spring Boot 和 React 的即时通讯模块，提供好友管理、会话管理、消息收发等核心功能。

## 功能特性

1. 好友管理
   - 好友列表展示
   - 好友添加/删除
   - 好友分组管理

2. 会话管理
   - 单聊支持
   - 群聊支持
   - 会话列表展示

3. 消息管理
   - 文本消息发送
   - 图片消息发送
   - 文件消息发送
   - 语音消息发送
   - 视频消息发送
   - 表情包消息发送
   - 消息已读/未读状态

4. 群组管理
   - 群组创建/解散
   - 群成员管理
   - 群公告设置

## 数据库表结构

- im_friend: 用户好友关系表
- im_friend_group: 好友分组表
- im_chat_session: 聊天会话表
- im_group: 群聊信息表
- im_group_member: 群成员表
- im_message: 消息表
- im_user_message: 用户消息状态表

## 技术栈

### 后端
- Spring Boot 3.3.3
- MyBatis-Plus 3.5.12
- MySQL 8.3.0
- Redis 4

### 前端
- React 18
- Ant Design 5.x
- Vite 3
- TypeScript

## 目录结构

```
fa-im/
├── src/
│   ├── main/
│   │   ├── java/com/faber/api/im/
│   │   │   ├── friend/              # 好友管理模块
│   │   │   │   ├── biz/
│   │   │   │   ├── entity/
│   │   │   │   ├── mapper/
│   │   │   │   └── rest/
│   │   │   ├── session/             # 会话管理模块
│   │   │   │   ├── biz/
│   │   │   │   ├── entity/
│   │   │   │   ├── mapper/
│   │   │   │   └── rest/
│   │   │   ├── message/             # 消息管理模块
│   │   │   │   ├── biz/
│   │   │   │   ├── entity/
│   │   │   │   ├── mapper/
│   │   │   │   └── rest/
│   │   │   ├── group/               # 群组管理模块
│   │   │   │   ├── biz/
│   │   │   │   ├── entity/
│   │   │   │   ├── mapper/
│   │   │   │   └── rest/
│   │   │   └── ImApplication.java   # 启动类
│   │   └── resources/
│   │       ├── mapper/              # MyBatis映射文件
│   │       └── sql/                 # SQL脚本
│   └── test/
└── pom.xml
```

## 前端目录结构

```
frontend/apps/admin/features/fa-im-pages/
├── components/                # 公共组件
│   ├── chat/                  # 聊天组件
│   ├── friend/                # 好友组件
│   └── session/               # 会话组件
├── pages/                     # 页面组件
│   ├── admin/                 # 管理端页面
│   │   └── im/                # 即时通讯页面
│   │       ├── friend/        # 好友管理页面
│   │       ├── session/       # 会话管理页面
│   │       └── chat/          # 聊天页面
├── services/                  # API服务
│   ├── friend/                # 好友相关API
│   ├── session/               # 会话相关API
│   ├── message/               # 消息相关API
│   └── group/                 # 群组相关API
├── types/                     # TypeScript类型定义
│   ├── friend/                # 好友相关类型
│   ├── session/               # 会话相关类型
│   ├── message/               # 消息相关类型
│   └── group/                 # 群组相关类型
└── index.ts                   # 模块入口文件
```

## 快速开始

1. 创建数据库表结构：
   执行 `db/im-mysql.sql` 文件创建表结构

2. 启动后端服务：
   ```bash
   mvn spring-boot:run -pl fa-im
   ```

3. 启动前端服务：
   ```bash
   cd frontend
   pnpm dev
   ```

## API接口

### 好友管理
- GET /api/im/friend/list - 获取好友列表
- POST /api/im/friend/save - 添加好友
- DELETE /api/im/friend/remove/{id} - 删除好友

### 好友分组
- GET /api/im/friend/group/list - 获取好友分组列表
- POST /api/im/friend/group/save - 添加好友分组
- PUT /api/im/friend/group/update - 更新好友分组
- DELETE /api/im/friend/group/remove/{id} - 删除好友分组

### 会话管理
- GET /api/im/session/list - 获取会话列表
- POST /api/im/session/save - 创建会话
- PUT /api/im/session/update - 更新会话
- DELETE /api/im/session/remove/{id} - 删除会话

### 消息管理
- GET /api/im/message/list - 获取消息列表
- POST /api/im/message/send - 发送消息
- PUT /api/im/message/recall/{id} - 撤回消息

### 用户消息状态
- GET /api/im/message/user/list - 获取用户消息状态列表
- PUT /api/im/message/read/{messageId}/{userId} - 标记消息已读

### 群组管理
- GET /api/im/group/list - 获取群组列表
- POST /api/im/group/save - 创建群组
- PUT /api/im/group/update - 更新群组
- DELETE /api/im/group/remove/{id} - 解散群组

### 群成员管理
- GET /api/im/group/member/list - 获取群成员列表
- POST /api/im/group/member/save - 添加群成员
- DELETE /api/im/group/member/remove/{id} - 移除群成员