# 文件与复杂交互组件

归并自 `upload.md`、`office.md`、`dnd.md`、`scrollList.md`、`3dmodal.md` 和 `formEditor.md`。

## 目录

- 上传组件选择
- 文件 ID、展示与业务处理
- 仅前端读取
- Office 查看/编辑
- 拖拽排序
- 滚动列表
- 3D 模型
- FormEditor

## 上传组件选择

业务页面优先使用 `@fa/ui` 的平台上传组件，不自行拼上传地址、认证头或 `FormData`：

| 场景 | 组件 | 表单值 |
|---|---|---|
| 单个普通文件 | `UploadFileLocal` | `string \| undefined` |
| 多个普通文件 | `UploadFileLocalMultiple` | `string[]` |
| 单张图片/头像/封面 | `UploadImgLocal` | `string \| undefined` |
| 仅浏览器解析、不上传 | Ant Design `Upload` | `File`/解析结果 |

组件当前源码位于 `frontend/fa-ui/packages/ui/src/components/base-uploader`。使用前打开类型声明核对 `value`、`onChange`、`maxCount`、`accept` 等实际签名。

表单可直接绑定文件 ID：

```tsx
<Form.Item name="coverFileId" label="项目封面">
  <UploadImgLocal />
</Form.Item>
```

编辑回填只设置已有文件 ID，由组件获取文件信息。单图不要用普通上传组件伪装 `picture-card`；多文件不要把单文件字符串强转成数组。

## 文件 ID、展示与业务处理

- 数据库和接口保存 `fileId`/`fileIds`，不保存浏览器路径、Base64 或前端猜测的存储路径。
- URL 使用 `fileSaveApi.genLocalGetFile(fileId)` 和 `genLocalGetFilePreview(fileId)`，不拼接服务域名。
- 上传成功只表示文件已进入平台文件服务。图片解析、SHA-256 去重、OCR、ZIP 导入等由业务后端接口处理。
- 删除上传控件中的条目通常只清空业务字段，不代表物理删除平台文件。
- 前端限制格式/大小只改善体验，后端仍必须校验。
- 业务创建需要多个文件时，先完成上传，再把 file IDs 交给专用业务接口。

## 仅前端读取

导入页面配置/JSON 且不需要保存文件时，可使用 Ant Design `Upload`，在 `beforeUpload` 返回 `false` 并通过 `FileReader` 解析：

```tsx
<Upload
  beforeUpload={(file) => {
    const reader = new FileReader();
    reader.onload = () => onLoad(reader.result as string);
    reader.readAsText(file);
    return false;
  }}
  showUploadList={false}
>
  <Button>导入配置</Button>
</Upload>
```

处理解析异常、编码、大小上限和 schema 校验，不把不可信内容直接渲染为 HTML。

## Office 查看/编辑

复用后台现有文档路由，通过 `MenuLayoutContext.addTab` 打开内部标签：

```ts
addTab({
  key: `/admin/common/doc/view/${fileId}`,
  path: `/admin/common/doc/view/${fileId}`,
  name: `查看文档-${name}`,
  type: 'inner',
  closeable: true,
});
```

编辑使用当前 `/admin/common/doc/edit/:fileId` 路由。打开前确认用户权限、文件类型和路由仍存在；tab key 保持唯一稳定。详细标签操作见 [navigation-state-events.md](navigation-state-events.md)。

## 拖拽排序

优先使用 `@fa/ui` 的 `FaSortList`/`FaSortGrid`。当前示例位于 `fa-admin-demo-pages/pages/admin/demo/biz/drag.tsx`，不要使用旧 `faber-admin/src/main/frontend` 路径。

- 列表项提供稳定唯一 key，不用数组下标作为持久身份。
- `onSortEnd` 更新本地顺序；需要保存时将明确的 ID/排序值提交后端。
- 保存失败时恢复或重新加载服务端顺序。
- 键盘操作、拖拽句柄和禁用态跟随组件当前能力。

## 滚动列表

竖向轮播优先使用 `FaScrollList`，当前组件位于 `fa-admin-pages/components/scroll/FaScrollList.tsx`：

```tsx
<FaScrollList
  list={items}
  num={5}
  interval={5000}
  itemMinHeight={60}
  renderItem={(item, _index, seq) => <Item item={item} seq={seq} />}
/>
```

外层必须有可计算高度。为记录提供稳定 key；列表过短时不滚动。除非需要修改通用行为，不复制历史 200 行的单文件轮播实现。

## 3D 模型

将 GLB 转 React 组件可使用项目实际依赖对应的 `gltfjsx`：

```shell
npx gltfjsx model.glb
```

生成后人工检查资源路径、材质、坐标、模型大小和 Three/React Three Fiber 版本；不要未经审查直接提交生成代码或大模型资源。依赖安装遵循 [tooling-vite.md](tooling-vite.md)。

## FormEditor

低代码表单/表格编辑任务先查当前 FormEditor 实现和 schema 类型，不只依赖历史草案。历史概念包括：

- `JsonConfig`：数据库表、列和表单项。
- `DataConfig`：主表和字段排序。
- `TableConfig`：查询列、展示列和 table props。
- 表单 item/container children、字段 type、默认值、multiple 等。

新增 schema 字段时同时更新 TypeScript 类型、编辑器、预览/解析器和持久化兼容逻辑；保留旧配置的默认行为，并对导入 JSON 做版本及结构校验。
