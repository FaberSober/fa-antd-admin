# SpringBoot 整合 MQTT

在 SpringBoot 项目中整合 MQTT 协议，实现消息的发布与订阅功能。

## 1. 导入 Maven 依赖

在 `pom.xml` 中添加以下依赖：

```xml
<!-- MQTT 客户端依赖 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-integration</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.integration</groupId>
        <artifactId>spring-integration-stream</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.integration</groupId>
        <artifactId>spring-integration-mqtt</artifactId>
    </dependency>
```
## 2. 配置
### 2.1 配置文件 (application.yml)
```yaml
#MQTT配置信息
mqtt:
  # emqx服务器地址
  host: tcp://47.113.146.104:18751
  # 用户名
  username: admin
  # 密码
  password: 103tiger
  # 客户端id
  clientId: mqttx_${random.uuid}
  # 定义连接超时时间 默认为10秒 如果未在属性中指定 则使用默认值
  connectionTimeout: 10
  # 消息服务质量
  qos: 2
  # 连接保持检查周期 秒
  keepAliveInterval: 20
  # 开启自动重连
  automaticReconnect: true
  # 是否清除会话session
  cleanSession: true
  # 默认订阅主题
  defaultSubscribeTopic: testtopic
  # 是否保留发布消息
  retained: false
```
### 2.2 MQTT 常量类 (MqttConstant.java)
#### 用于配置和管理与MQTT相关的常量和连接参数，如服务器地址、用户名、密码、客户端ID等

### 2.3 MQTT 服务类 (MqttService.java)
#### MqttService 类概述

`MqttService` 用于管理和操作 MQTT 连接的服务类，提供连接、订阅和发布消息等功能。主要功能和方法：

#### 主要功能

1. **MQTT连接管理**
    - 通过 `connect` 方法连接到 MQTT 服务器，设置连接参数并指定回调。

2. **消息订阅**
    - 使用 `subscribe(String topic)` 方法订阅单个主题。
    - 使用 `subscribe(String[] topic)` 方法订阅多个主题。

3. **消息发布**
    - 通过 `publish(String topic, String msg)` 方法向指定的主题推送消息。

### 2.4 MQTT 服务回调类 (MqttCallbackHandler.java)
`MqttCallback` 实现 `MqttCallbackExtended` 接口，用于处理 MQTT 客户端的回调事件。处理 MQTT 消息接收、连接状态变更和消息发布完成等事件。

#### 主要功能

1. **客户端连接断开**：当客户端与服务器的连接丢失时，触发 `connectionLost` 方法。
2. **接收消息**：当客户端收到消息时，触发 `messageArrived` 方法，并处理接收到的消息。
3. **消息发布成功**：当消息成功发布到主题时，触发 `deliveryComplete` 方法。
4. **客户端连接成功**：当客户端成功连接到服务器时，触发 `connectComplete` 方法，并订阅默认主题。

### 2.5  MQTT 配置类 (MqttConfig.java)
#### MqttConfig 类概述

`MqttConfig`  Spring 配置类，用于配置和初始化 MQTT 客户端的连接选项，并调用 `MqttService` 来完成实际的连接操作。该类通过读取 `MqttConstants` 中的配置信息，设置 MQTT 连接的相关参数，并在应用启动时自动进行连接。

#### 主要功能

1. **配置 MQTT 连接选项**：使用 `MqttConnectOptions` 来配置连接的用户名、密码、超时时间、心跳间隔等。
2. **初始化 MQTT 客户端连接**：在应用启动后通过 `@PostConstruct` 注解的 `mqttClient()` 方法，自动连接到 MQTT 服务器。

