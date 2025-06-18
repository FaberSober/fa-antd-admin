# Nginx部署配置

## http模式
```
server {
    listen 80;
    server_name  wind.predict.dward.cn;

    server_tokens off;
    # disable any limits to avoid HTTP 413 for large image uploads
    client_max_body_size 0;

    # Add extra headers
    # add_header X-Frame-Options DENY;
    # add_header Content-Security-Policy "frame-ancestors 'none'";

    # 开启gzip
    gzip on;
    # 启用gzip压缩的最小文件，小于设置值的文件将不会压缩
    gzip_min_length 1k;
    # gzip 压缩级别，1-10，数字越大压缩的越好，也越占用CPU时间
    gzip_comp_level 1;
    # 进行压缩的文件类型。javascript有多种形式。其中的值可以在 mime.types 文件中找到。
    gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    # 是否在http header中添加Vary: Accept-Encoding，建议开启。
    gzip_vary on;
    # 禁用IE 6 gzip
    gzip_disable "MSIE [1-6]\.";

    location / {
        proxy_pass http://127.0.0.1:18911;
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location ~ /.*[api|druid]/{
        proxy_pass http://127.0.0.1:18911;
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # spring-boot-admin健康检测地址
    location /apij/{
        # 限制访问域名
        allow 1.1.1.1;
        deny all;
        proxy_pass http://127.0.0.1:18911;
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
        proxy_pass http://127.0.0.1:18902/;
        proxy_http_version 1.1;
        proxy_read_timeout   3600s;
        # 超时设置
        # 启用支持websocket连接
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

}
```

## https
### 单独jar部署模式
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

    # 开启gzip
    gzip on;
    # 启用gzip压缩的最小文件，小于设置值的文件将不会压缩
    gzip_min_length 1k;
    # gzip 压缩级别，1-10，数字越大压缩的越好，也越占用CPU时间
    gzip_comp_level 1;
    # 进行压缩的文件类型。javascript有多种形式。其中的值可以在 mime.types 文件中找到。
    gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    # 是否在http header中添加Vary: Accept-Encoding，建议开启。
    gzip_vary on;
    # 禁用IE 6 gzip
    gzip_disable "MSIE [1-6]\.";

    location / {
        proxy_pass http://127.0.0.1:8585;
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location ~ /.*[api|druid]/{
        proxy_pass http://127.0.0.1:8585;
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # spring-boot-admin健康检测地址
    location /apij/{
        # 限制访问域名
        allow 1.1.1.1;
        deny all;
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


### 前后端分离模式
1. 前端的dist部署到单独的目录，nginx访问路径；
2. 后端/api等接口转发到jar server；
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

    # 开启gzip
    gzip on;
    # 启用gzip压缩的最小文件，小于设置值的文件将不会压缩
    gzip_min_length 1k;
    # gzip 压缩级别，1-10，数字越大压缩的越好，也越占用CPU时间
    gzip_comp_level 1;
    # 进行压缩的文件类型。javascript有多种形式。其中的值可以在 mime.types 文件中找到。
    gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    # 是否在http header中添加Vary: Accept-Encoding，建议开启。
    gzip_vary on;
    # 禁用IE 6 gzip
    gzip_disable "MSIE [1-6]\.";

    root /etc/nginx/html/fa-admin/admin;

    # html、js文件代理到html文件夹
    location / {
        # url 切换时始终返回index.html
        # 这样能适配browser history
        try_files $uri /index.html;
    }

    location ~ /.*[api|druid]/{
        proxy_pass http://127.0.0.1:8585;
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # spring-boot-admin健康检测地址
    location /apij/{
        # 限制访问域名
        allow 1.1.1.1;
        deny all;
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
