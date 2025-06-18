# upload文件上传

## 获取文件，不调用接口，直接前端获取选择的文件内容
```typescript jsx
<Upload
  beforeUpload={file => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const result = reader.result as string;
      if (onUpload) {
        onUpload(result)
      }
    };
    return false;
  }}
  showUploadList={false}
>
  <Button>上传配置</Button>
</Upload>
```