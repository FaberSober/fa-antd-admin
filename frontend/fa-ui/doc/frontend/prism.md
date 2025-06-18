# prism.js代码块格式化

## 官网下载
1. [点击官网下载](https://prismjs.com/download.html)
2. 选择Core、Languages、Plugins后，下载`prism.js`、`prism.css`
3. 将下载后的`prism.js`、`prism.css`放到目录`frontend/apps/admin/public/plugins/prism/1.29.0`
4. 在html中引入js、css，代码如下：
    ```html
    <!-- prism -->
    <script src="/plugins/prism/1.29.0/prism.js"></script>
    <link rel="stylesheet" type="text/css" href="/plugins/prism/1.29.0/prism.css">
    ```
5. 默认页面加载完，会自动给`<pre><code></code></pre>`里设置代码块样式
6. 如果页面属于动态加载，可以手动出发，js代码为
    ```javascript
    window.Prism.highlightAll()
    ```
