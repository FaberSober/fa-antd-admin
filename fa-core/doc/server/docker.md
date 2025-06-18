# docker
## 打包发布到hub.docker.com
1. 登录docker客户端
2. fa-admin/pom.xml中放开docker部分注释
```xml
<executions>
    <execution>
        <id>build-docker-image</id>
        <goals>
            <!-- 发布docker放开下面build、save、push的注释 -->
            <goal>build</goal>
            <goal>save</goal>
            <goal>push</goal>
        </goals>
        <phase>package</phase>
    </execution>
</executions>
```
3. 执行mvn package