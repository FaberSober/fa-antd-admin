# 首个真实业务试点：个人消息中心

## 结论

M0 将“个人消息中心”冻结为首个生产业务试点，归属 `fa-h5-base-pages`。Student CRUD 仍作为 M4 的技术模板，但不作为真实业务验收对象。

选择消息中心的原因：

- 用户天然存在移动查看和标记已读需求。
- 后端已有按当前用户过滤的分页和更新接口。
- 交互可以覆盖列表、筛选、无限加载、下拉刷新、批量选择和缓存失效。
- 不需要新增复杂编辑表单。
- 可以验证登录、权限、租户和未读角标等平台能力。

## 用户故事

- 作为登录用户，我可以查看只属于自己的消息。
- 我可以按消息类型、关键字和已读状态筛选。
- 我可以下拉刷新并继续加载下一页。
- 我可以将单条或选中的消息标记为已读。
- 我可以确认后把所有未读消息标记为已读。
- 我可以看到当前未读数量，并在操作成功后立即更新角标。

## H5 页面范围

| 页面/交互 | 路由 | 说明 |
|---|---|---|
| 消息列表 | `/app/messages` | 卡片/List 展示消息摘要、来源、类型、时间和已读状态 |
| 筛选 Popup | 同页 | 类型、已读状态、内容关键字 |
| 消息内容展开 | 同页 | 使用当前列表返回数据，不调用通用 `getById` |
| 批量选择 | 同页模式 | 只支持批量已读 |
| 全部已读 | 同页操作 | 必须二次确认 |

不进入首期：

- 删除消息。
- 通过通用 `getById` 获取任意消息。
- 渲染 `buzzContent` 中的任意 HTML。
- 根据未知 `buzzType` 自动跳转任意 URL。
- 消息创建、发送和后台管理。

## 后端接口清单

网关前缀：`/api/base/admin/msg`。

### 1. 个人分页

```http
POST /api/base/admin/msg/pageMine
Content-Type: application/json
Authorization: <token>
fa-tn-tenant-id: <tenantId>  # 仅租户启用时
```

请求使用现有 `QueryParams`/分页结构，建议首期：

```json
{
  "pagination": {
    "current": 1,
    "pageSize": 20
  },
  "sorter": {
    "field": "crtTime",
    "order": "descend"
  },
  "query": {
    "type": 1,
    "isRead": false,
    "content": "关键字"
  }
}
```

后端会覆盖/增加 `toUserId = 当前登录用户`，前端不能把传入 `toUserId` 当作数据权限边界。

返回：现有 `TableRet<Msg>`，H5 适配为统一 `Ret<Page<Message>>` 读取方式。

### 2. 未读统计

```http
GET /api/base/admin/msg/countMine
```

返回主体：

```json
{
  "unreadCount": 3
}
```

### 3. 单条/批量已读

```http
POST /api/base/admin/msg/batchRead
Content-Type: application/json

[1001, 1002]
```

后端更新条件同时包含消息 ID 和当前用户 ID，可以用于单条及批量已读。成功返回 `Ret<boolean>`。

### 4. 全部已读

```http
GET /api/base/admin/msg/readAll
```

后端只更新当前用户的未读消息。成功返回 `Ret<boolean>`。

## 类型基线

```ts
interface Message extends BaseDelEntity {
  id: number;
  fromUserName: string;
  fromUserId: string;
  toUserName: string;
  toUserId: string;
  content: string;
  isRead: boolean;
  readTime?: string | null;
  buzzType?: string | null;
  buzzId?: string | null;
  type: 1 | 2;
  buzzContent?: string | null;
}

interface MessageStatistics {
  unreadCount: number;
}
```

已发现的现有 Admin 类型漂移：

| 项目 | 后端真实契约 | Admin 当前声明 | H5 决策 |
|---|---|---|---|
| 消息主键 | Java `Long` | `Admin.Msg.id: string` | H5 使用 `number` |
| `batchRead` 参数 | `List<Long>` | `string[]` | H5 使用 `number[]` |
| `readAll` 返回 | `Ret<Boolean>` | `Ret<{ unreadCount: number }>` | H5 使用 `Ret<boolean>`，成功后重新请求统计 |

M0 不顺带修改 Admin 类型；H5 不复制这些漂移。

## 权限和数据范围

- 路由 permission：`/h5/app/messages`。
- RBAC 菜单 scope：`2`（APP）。
- 进入试点前需要新增或配置对应 `scope=2` 菜单并分配给目标角色。
- `pageMine`、`batchRead` 和 `readAll` 已在后端按当前用户收口。
- 通用 `remove`/`removeBatchByIds` 没有在 `MsgController` 中覆盖个人数据范围，因此 H5 不提供删除。
- 不调用继承自通用 Controller 的 `getById` 作为个人消息详情接口。

## Query 规则

建议 Query Key：

```ts
const messageKeys = {
  all: ['fa-h5-base-pages', 'messages'] as const,
  list: (tenantId: string | undefined, filters: MessageFilters) =>
    [...messageKeys.all, 'list', tenantId, filters] as const,
  statistics: (tenantId: string | undefined) =>
    [...messageKeys.all, 'statistics', tenantId] as const,
};
```

Mutation 成功后：

- 失效当前消息列表。
- 失效未读统计。
- 不乐观更新“全部已读”；等待服务端成功后刷新。
- 切换租户时清理旧租户消息 Query。

## 移动交互验收

- 默认按 `crtTime` 倒序，每页 20 条。
- 首屏显示骨架或 Loading；空列表显示 Empty。
- 下拉刷新只刷新第一页和未读统计。
- 加载下一页时避免重复触发请求。
- 未读消息有清晰但不过度依赖颜色的标识。
- 标记已读后消息状态和全局角标同步。
- 全部已读必须弹出确认。
- 接口失败保留当前列表，并提供重试。
- `content` 和 `buzzContent` 作为不可信文本处理。

## 后端依赖结论

现有业务 API 足以完成试点，不需要新增消息业务接口。上线前唯一必须准备的数据项是 `scope=2` 的消息中心菜单/角色授权；它是已明确的 M3 后端任务，不是未确认的接口设计问题。
