# 起步
1. 安装依赖
```
yarn
```

2. 启动项目
```
yarn start
```
或
```
yarn dev
```

3. 打包
```
yarn build
```

# IE兼容
- query-string: 不要使用`query-string`，会触发`SyntaxError: let is a reserved identifier`错误，改用`querystring`
