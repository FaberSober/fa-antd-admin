# fa-ai-pages

Portal 的 AI 页面模块，对应后端 `fa-ai`。当前包含登录用户的智能体聊天页面，使用 `/api/portal/ai/**` 接口和流式 SSE 响应。

模块依赖 `fa-admin-pages` 提供的 Portal 认证能力，但不导入 Admin 应用源码或 UI 依赖。
