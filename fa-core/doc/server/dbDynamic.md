# dynamic datasource 多数据源 动态数据源

- 官网：https://www.kancloud.cn/tracy5546/dynamic-datasource/2264611
- github：https://github.com/baomidou/dynamic-datasource

## 1. 添加pom依赖包

###### 在 pom.xml 中添加 dynamic-datasource 的依赖：

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>dynamic-datasource-spring-boot-starter</artifactId>
    <version>4.3.0</version>
    <exclusions>
        <exclusion> <!-- 排除HikariCP -->
            <groupId>com.zaxxer</groupId>
            <artifactId>HikariCP</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```
## 2. 配置application.yml数据源
###### 在 application.yml 配置文件中添加多个数据源的配置信息，并设置默认数据源:
```yaml
  datasource:
    dynamic:
      primary: master #设置默认的数据源或者数据源组,默认值即为master
      strict: false #严格匹配数据源,默认false. true未匹配到指定数据源时抛异常,false使用默认数据源
      datasource:
        master:
          url: jdbc:mysql://${MYSQL_HOST:dwardserver1.dward.cn}:${MYSQL_PORT:18731}/${MYSQL_DBNAME:nm_als_dev}?useUnicode=true&characterEncoding=UTF8&serverTimezone=GMT%2B8&useSSL=false
          username: ${MYSQL_USERNAME:nm_als_dev}
          password: ${MYSQL_PASSWORD:nm_als_dev@dward#1203}
          driver-class-name: com.mysql.cj.jdbc.Driver
        tdengine:
          url: jdbc:TAOS-RS://192.168.5.7:6060?useSSL=false&user=root&password=taosdata
          username: root
          password: taosdata
          driver-class-name: com.taosdata.jdbc.rs.RestfulDriver
```
* primary: 用于指定默认数据源（master 是默认数据源）。
* datasource: 定义了多个数据源，包括主数据源（master）和从数据源（tdengine）
* 在需要切换数据源的地方，使用 @DS 注解来指定数据源。
### 示例：使用 @DS 注解切换数据源
```java
package com.faber.api.iot.tdengine.equipmentInfo.service.impl;

import com.baomidou.dynamic.datasource.annotation.DS;
import com.faber.api.iot.tdengine.equipmentInfo.entity.EquipmentInfo;
import com.faber.api.iot.tdengine.equipmentInfo.mapper.EquipmentInfoMapper;
import com.faber.api.iot.tdengine.equipmentInfo.service.IEquipmentInfoService;
import com.faber.api.iot.tdengine.taos.service.impl.BaseTaosServiceImpl;
import org.springframework.stereotype.Service;



/**
 * @author 余国龙
 */
@DS("tdengine")
@Service
public class EquipmentInfoServiceImpl extends BaseTaosServiceImpl<EquipmentInfoMapper, EquipmentInfo> implements IEquipmentInfoService {
}

```
## 3. 测试
```java
package com.faber.iot.tdengine;

import com.faber.FaTestApp;
import com.faber.api.iot.tdengine.equipmentInfo.entity.EquipmentInfo;
import com.faber.api.iot.tdengine.equipmentInfo.service.IEquipmentInfoService;
import lombok.extern.slf4j.Slf4j;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static org.junit.Assert.*;

@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest(classes = {FaTestApp.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class TDengineTest {
    @Autowired
    private IEquipmentInfoService equipmentInfoService;
    
    @Test
    public void testEntityInit() {
        // 创建数据库和超级表
        EquipmentInfo equipmentInfo = new EquipmentInfo();
        equipmentInfoService.createSTable(equipmentInfo);
    }

    @Test
    public void testSingleInsert() {
        // 输入模拟数据
        EquipmentInfo equipmentInfo = new EquipmentInfo();
        equipmentInfo.setIntValue(123);
        equipmentInfo.setStrValue("采集成功");
        equipmentInfo.setEqpId("1977607896");
        // 设置子表名
        equipmentInfo.setTableName("eqp_1977607896");
        equipmentInfoService.insert(equipmentInfo);
    }

    @Test
    public void testQuery() {
// 查询数据
        EquipmentInfo equipmentInfo = new EquipmentInfo();
        equipmentInfo.setEqpId("1977607896");
        equipmentInfo.setTableName("eqp_1977607896");
        LocalDateTime startTime = LocalDateTime.of(2024, 4, 26, 16, 58, 42);
        ZoneId zoneId = ZoneId.of("Asia/Shanghai");
        ZonedDateTime zonedDateTime = startTime.atZone(zoneId);
        Instant instant = zonedDateTime.toInstant();
        long timestamp = instant.toEpochMilli();
        // 格式化时间为yyyy-MM-dd HH:mm:ss
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String format = startTime.format(formatter);
        List<EquipmentInfo> list = equipmentInfoService.lambdaQuery()
                .ge(EquipmentInfo::getTs, timestamp)
                .eq(EquipmentInfo::getEqpId, equipmentInfo.getEqpId())
                .list();
        log.info("查询结果：{}", list);
    }
}

```