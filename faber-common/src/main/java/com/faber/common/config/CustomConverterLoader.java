package com.faber.common.config;

import cn.hutool.core.util.ClassUtil;
import com.alibaba.excel.converters.Converter;
import com.alibaba.excel.converters.ConverterKeyBuild;
import com.alibaba.excel.converters.DefaultConverterLoader;
import com.baomidou.mybatisplus.annotation.IEnum;
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

        Map<ConverterKeyBuild.ConverterKey, Converter<?>> allConverter = DefaultConverterLoader.loadAllConverter();
        allConverter.put(ConverterKeyBuild.buildKey(localDateConverter.supportJavaTypeKey(), localDateConverter.supportExcelTypeKey()), localDateConverter);

        // 扫描com.faber.common.enums包下的枚举类
        ClassUtil.scanPackageBySuper("com.faber.common.enums", IEnum.class).forEach((clazz -> {
            defaultWriteConverter.put(ConverterKeyBuild.buildKey(clazz), baseEnumConverter);
            allConverter.put(ConverterKeyBuild.buildKey(clazz, baseEnumConverter.supportExcelTypeKey()), baseEnumConverter);
        }));

        return converters;
    }
}

