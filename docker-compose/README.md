# 部署说明

## Linux环境修改data目录读写权限
```
sudo chmod 777 -R data
```

## 拉起环境配置
```
docker-compose up -d
```

## 访问服务
1. 浏览器打开：http://127.0.0.1
2. 登录账户：admin/888888

## 更新服务
1. win：双击运行`update.bat`
2. linux：双击运行`update.sh`

# 配置项目说明

## nginx
nginx示例代码配置了http、https访问，ssl证书存放在`docker-compose/services/nginx/conf.d/ssl`
