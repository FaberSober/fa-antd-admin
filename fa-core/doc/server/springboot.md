# springboot常用方法收集

## 获取request、response
request
```java
HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
```

response
```java
HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();
```

## 获取当前启动环境
```java
import cn.hutool.extra.spring.SpringUtil;

SpringUtil.getActiveProfile()
```
