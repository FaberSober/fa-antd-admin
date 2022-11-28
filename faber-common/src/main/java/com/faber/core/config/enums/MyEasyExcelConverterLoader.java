package com.faber.core.config.enums;

import cn.hutool.core.util.ClassUtil;
import com.alibaba.excel.converters.Converter;
import com.alibaba.excel.converters.ConverterKeyBuild;
import com.alibaba.excel.converters.DefaultConverterLoader;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.faber.core.converter.BaseEnumConverter;
import com.faber.core.converter.LocalDateTimeConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

/**
 * EasyExcel 自定义类型转换器Converter-全局类型转换器
 * 加载自定义类型转换器（加载器）
 * https://blog.csdn.net/qq_38974638/article/details/119295809
 * @author xu.pengfei
 * @date 2022/11/28 14:00
 */
@Configuration
public class MyEasyExcelConverterLoader {

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
        ClassUtil.scanPackageBySuper("com.faber", IEnum.class).forEach((clazz -> {
            defaultWriteConverter.put(ConverterKeyBuild.buildKey(clazz), baseEnumConverter);
            allConverter.put(ConverterKeyBuild.buildKey(clazz, baseEnumConverter.supportExcelTypeKey()), baseEnumConverter);
        }));

        return converters;
    }
}

