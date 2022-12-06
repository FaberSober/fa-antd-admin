# Nginx部署配置

## fa.dward.cn官网域名nginx配置如下
```
server {
    listen 80;
    server_name fa.dward.cn;
    client_max_body_size 0;
    rewrite ^ https://$host$1 permanent;
}

server {
    listen 443  default ssl http2;
    server_name  fa.dward.cn;

    ssl_certificate      /etc/nginx/ssl/8899770_fa.dward.cn.pem;
    ssl_certificate_key  /etc/nginx/ssl/8899770_fa.dward.cn.key;
    ssl_session_timeout  5m;
    ssl_session_cache    shared:SSL:1m;
    ssl_ciphers          ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:aNULL:!MD5:!ADH:!RC4;
    ssl_protocols        TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers  on;

    server_tokens off;
    # disable any limits to avoid HTTP 413 for large image uploads
    client_max_body_size 0;

    # Add extra headers
    # add_header X-Frame-Options DENY;
    # add_header Content-Security-Policy "frame-ancestors 'none'";

    location /{
        proxy_pass http://127.0.0.1:8580;
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /druid/ {
        absolute_redirect off;
        proxy_pass http://127.0.0.1:8580;
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # phpRedisAdmin
    location /phpRedisAdmin/ {
        proxy_set_header Host $host;
        proxy_set_header X-Real-Ip $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_pass http://127.0.0.1:8182/;
        proxy_http_version 1.1;
        proxy_read_timeout   3600s;
        # 超时设置
        # 启用支持websocket连接
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

}
```

## fa.socket.dward.cn长链接域名nginx配置如下
```
server {
  listen       80;
  server_name  fa.socket.dward.cn;

  location / {
    root   html;
    index  index.html index.htm;
    proxy_pass http://127.0.0.1:8581;

    proxy_redirect off;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}

server {
    listen       443;
    server_name  fa.socket.dward.cn;


    ssl_certificate      /etc/nginx/ssl/8948100_fa.socket.dward.cn.pem;
    ssl_certificate_key  /etc/nginx/ssl/8948100_fa.socket.dward.cn.key;
    ssl_session_timeout  5m;
    ssl_session_cache    shared:SSL:1m;
    ssl_ciphers          ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:aNULL:!MD5:!ADH:!RC4;
    ssl_protocols        TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers  on;

    location / {
      root   html;
      index  index.html index.htm;
      proxy_pass http://127.0.0.1:8581;

      proxy_redirect off;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
    }
}
```
