# SpringBoot 整合 Kafka

## 1. 导入 Maven 依赖

在 `pom.xml` 中添加以下依赖：

```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
```
## 2. 配置
### 2.1 配置文件 (application.yml)
```yaml
  kafka:
    producer:
      # Kafka服务器
      bootstrap-servers: 192.168.5.7:9093
      # 开启事务，必须在开启了事务的方法中发送，否则报错
      transaction-id-prefix: kafkaTx-
      # 发生错误后，消息重发的次数，开启事务必须设置大于0。
      retries: 3
      # acks=0 ： 生产者在成功写入消息之前不会等待任何来自服务器的响应。
      # acks=1 ： 只要集群的首领节点收到消息，生产者就会收到一个来自服务器成功响应。
      # acks=all ：只有当所有参与复制的节点全部收到消息时，生产者才会收到一个来自服务器的成功响应。
      # 开启事务时，必须设置为all
      acks: all
      # 当有多个消息需要被发送到同一个分区时，生产者会把它们放在同一个批次里。该参数指定了一个批次可以使用的内存大小，按照字节数计算。
      batch-size: 16384
      # 生产者内存缓冲区的大小。
      buffer-memory: 1024000
      # 键的序列化方式
      key-serializer: org.springframework.kafka.support.serializer.JsonSerializer
      # 值的序列化方式（建议使用Json，这种序列化方式可以无需额外配置传输实体类）
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
```
### 2.2 生产者 Config (KafkaProviderConfig.java)
`KafkaProviderConfig` Spring 配置类，配置 Kafka 生产者相关设置。它通过 `@Value` 注解读取配置文件中的 Kafka 生产者参数，创建 Kafka 生产者的工厂、事务管理器以及 Kafka 模板的 Bean。

#### 主要功能

1. **配置 Kafka 生产者**：通过 `producerConfigs` 方法设置 Kafka 生产者的相关配置参数，如 `bootstrapServers`、`acks`、`retries` 等。
2. **创建 Kafka 生产者工厂**：通过 `producerFactory` 方法创建一个 Kafka 生产者工厂，并配置事务前缀。
3. **创建 Kafka 事务管理器**：通过 `kafkaTransactionManager` 方法创建 Kafka 事务管理器。
4. **创建 Kafka 模板**：通过 `kafkaTemplate` 方法创建一个 `KafkaTemplate` 实例，用于发送消息。

### 2.3消费者 Config (KafkaConsumerConfig.java)

`KafkaConsumerConfig` Spring 配置类，配置 Kafka 消费者。从配置文件中读取 Kafka 消费者相关参数，并通过 `@Bean` 注解提供 Kafka 消费者工厂、监听器容器工厂等 Bean 配置。该类为 Kafka 消费者提供了自动化的配置方式，支持批量消费、手动提交消息等功能。

#### 主要功能

1. **配置 Kafka 消费者**：通过 `consumerConfigs` 方法设置 Kafka 消费者的相关配置参数，如 `bootstrapServers`、`groupId`、`enableAutoCommit` 等。
2. **创建 Kafka 消费者工厂**：通过 `consumerFactory` 方法创建 Kafka 消费者工厂，配置反序列化方式和可信赖包。
3. **创建 Kafka 监听器容器工厂**：通过 `kafkaListenerContainerFactory` 方法创建并配置 Kafka 监听器容器，包括并发线程数、自动提交方式等。


### 2.4 成功回调 (KafkaSendResultHandler.java)
`KafkaSendResultHandler` 处理 Kafka 消息发送结果的回调类。实现 `ProducerListener<Object, Object>` 接口，提供了消息发送成功和失败时的处理逻辑。通过该类可以实现对 Kafka 消息发送结果的监听，记录成功与失败的消息，进行相应的处理。

#### 主要功能

- **消息发送成功时的处理**：`onSuccess` 方法会在消息成功发送后被调用，打印发送成功的消息信息。
- **消息发送失败时的处理**：`onError` 方法会在消息发送失败时被调用，打印失败的消息信息以及异常详情。

### 2.5 异常处理(MyKafkaListenerErrorHandler.java)
`MyKafkaListenerErrorHandler` 处理 Kafka 消费者监听过程中异常的自定义错误处理类。实现 `KafkaListenerErrorHandler` 接口，提供处理异常的具体实现。该类用于捕获和处理 Kafka 消费者监听器执行失败时的异常信息，并提供相关的上下文信息。

#### 主要功能

- **异常处理**：在 Kafka 消费者监听过程中，当出现异常时，`handleError` 方法会被调用，用于处理错误并提供相应的日志输出。
- **提供消费者信息**：当异常发生时，记录消费者信息，包括消费者的元数据和监听的主题。
