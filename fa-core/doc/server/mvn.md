# mvn

## 更新命令
1. `mvn versions:display-dependency-updates` scans a project's dependencies and produces a report of those dependencies which have newer versions available.
2. `mvn versions:display-plugin-updates` scans a project's plugins and produces a report of those plugins which have newer versions available.
3. `mvn versions:display-property-updates` scans a project and produces a report of those properties which are used to control artifact versions and which properies have newer versions available.

## 检查maven是否有新的依赖版本
```shell
mvn versions:display-dependency-updates
```

https://stackoverflow.com/questions/3516538/how-to-check-pom-xml-for-updated-dependencies