package com.faber.common.config;

import com.alibaba.excel.converters.Converter;
import com.alibaba.excel.converters.ConverterKeyBuild;
import com.alibaba.excel.converters.DefaultConverterLoader;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

/**
 * EasyExcel 自定义类型转换器Converter-全局类型转换器
 * 加载自定义类型转换器（加载器）
 * https://blog.csdn.net/qq_38974638/article/details/119295809
 */
@Configuration
public class CustomConverterLoader {

    @Bean
    public DefaultConverterLoader defaultConverterLoader() {
        DefaultConverterLoader converters = new DefaultConverterLoader();

        LocalDateTimeConverter localDateConverter = new LocalDateTimeConverter();
        BaseEnumConverter baseEnumConverter = new BaseEnumConverter();

        Map<ConverterKeyBuild.ConverterKey, Converter<?>> defaultWriteConverter = DefaultConverterLoader.loadDefaultWriteConverter();
        defaultWriteConverter.put(ConverterKeyBuild.buildKey(localDateConverter.supportJavaTypeKey()), localDateConverter);
        defaultWriteConverter.put(ConverterKeyBuild.buildKey(baseEnumConverter.supportJavaTypeKey()), baseEnumConverter);

        Map<ConverterKeyBuild.ConverterKey, Converter<?>> allConverter = DefaultConverterLoader.loadAllConverter();
        allConverter.put(ConverterKeyBuild.buildKey(localDateConverter.supportJavaTypeKey(), localDateConverter.supportExcelTypeKey()), localDateConverter);
        allConverter.put(ConverterKeyBuild.buildKey(baseEnumConverter.supportJavaTypeKey(), baseEnumConverter.supportExcelTypeKey()), baseEnumConverter);

        return converters;
    }
}

