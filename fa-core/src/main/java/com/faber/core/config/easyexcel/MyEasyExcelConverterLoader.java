package com.faber.core.config.easyexcel;

import cn.hutool.core.util.ClassUtil;
import com.alibaba.excel.converters.Converter;
import com.alibaba.excel.converters.ConverterKeyBuild;
import com.alibaba.excel.converters.DefaultConverterLoader;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.faber.core.config.easyexcel.converter.*;
import com.faber.core.config.easyexcel.type.FaJsonObj;
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
        FaBooleanStringConverter faBooleanStringConverter = new FaBooleanStringConverter();
        FaJsonObjConverter faJsonObjConverter = new FaJsonObjConverter();
        ListConverter listConverter = new ListConverter();

        Map<ConverterKeyBuild.ConverterKey, Converter<?>> defaultWriteConverter = DefaultConverterLoader.loadDefaultWriteConverter();
        defaultWriteConverter.put(ConverterKeyBuild.buildKey(localDateConverter.supportJavaTypeKey()), localDateConverter);
        defaultWriteConverter.put(ConverterKeyBuild.buildKey(listConverter.supportJavaTypeKey()), listConverter);
        defaultWriteConverter.put(ConverterKeyBuild.buildKey(faBooleanStringConverter.supportJavaTypeKey()), faBooleanStringConverter);

        Map<ConverterKeyBuild.ConverterKey, Converter<?>> allConverter = DefaultConverterLoader.loadAllConverter();
        allConverter.put(ConverterKeyBuild.buildKey(localDateConverter.supportJavaTypeKey(), localDateConverter.supportExcelTypeKey()), localDateConverter);
        allConverter.put(ConverterKeyBuild.buildKey(listConverter.supportJavaTypeKey(), listConverter.supportExcelTypeKey()), listConverter);
        allConverter.put(ConverterKeyBuild.buildKey(faBooleanStringConverter.supportJavaTypeKey(), faBooleanStringConverter.supportExcelTypeKey()), faBooleanStringConverter);

        // 扫描com.faber包下的枚举类
        ClassUtil.scanPackageBySuper("com.faber", IEnum.class).forEach((clazz -> {
            defaultWriteConverter.put(ConverterKeyBuild.buildKey(clazz), baseEnumConverter);
            allConverter.put(ConverterKeyBuild.buildKey(clazz, baseEnumConverter.supportExcelTypeKey()), baseEnumConverter);
        }));

        // 扫描com.faber包下的枚举类
        ClassUtil.scanPackageBySuper("com.faber", FaJsonObj.class).forEach((clazz -> {
            defaultWriteConverter.put(ConverterKeyBuild.buildKey(clazz), faJsonObjConverter);
            allConverter.put(ConverterKeyBuild.buildKey(clazz, faJsonObjConverter.supportExcelTypeKey()), faJsonObjConverter);
        }));

        return converters;
    }
}

