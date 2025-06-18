# jackson

## SpringBoot2 版本中spring.jackson.date-format设置以后不生效的速效解决方法

https://blog.csdn.net/u012581020/article/details/105955060

spring.jackson.date-format 这个属性在spring boot 1.x中有用，但是当你项目升级到spring boot2.x 以后，时间格式化变无效了
网上说的原因分析：
spring boot2 中推荐使用的拦截器为 WebMvcConfigurationSupport
spring boot1.x 中使用的是 WebMvcConfigurerAdapter ，但是在添加拦截器并继承WebMvcConfigurationSupport后会覆盖@EnableAutoConfiguration关于WebMvcAutoConfiguration的配置！从而导致所有的Date`返回都变成时间戳！

> 网上很多方案说弃用 WebMvcConfigurationSupport 改用 implements WebMvcConfigurer 这种方案

> 其实集成WebMvcConfigurationSupport  以后，直接实现 extendMessageConverters 方法即可,代码如下

```java
@Configuration
public class WebMvcConfigurer extends WebMvcConfigurationSupport {
	
	@Value("${spring.jackson.date-format}")
	private String dateFormatPattern;
	
	@Value("${spring.jackson.time-zone}")
	private String timeZone;
	
	@Override
	protected void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
		MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
		ObjectMapper objectMapper = converter.getObjectMapper();
		// 生成JSON时,将所有Long转换成String
		SimpleModule simpleModule = new SimpleModule();
		simpleModule.addSerializer(Long.class, ToStringSerializer.instance);
		simpleModule.addSerializer(Long.TYPE, ToStringSerializer.instance);
		objectMapper.registerModule(simpleModule);
		// 时间格式化
		objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		//这个可以引用spring boot yml 里的格式化配置和时区配置
		objectMapper.setDateFormat(new SimpleDateFormat(dateFormatPattern));
		objectMapper.setTimeZone(TimeZone.getTimeZone(timeZone));
		// 设置格式化内容
		converter.setObjectMapper(objectMapper);
		converters.add(0, converter);
		super.extendMessageConverters(converters);
	}
}
```


原文链接：https://blog.csdn.net/u012581020/article/details/105955060

# 常见问题

## 首字母多个连续大写
如果字段名为`nTenOrder`，返回前端的json key为`ntenOrder`，可以通过指定名称的方式，如下：
```java
@JsonProperty("nTenOrder")
private String nTenOrder;
```

