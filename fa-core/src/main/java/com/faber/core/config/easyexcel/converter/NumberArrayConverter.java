package com.faber.core.config.easyexcel.converter;

import com.alibaba.excel.converters.Converter;
import com.alibaba.excel.enums.CellDataTypeEnum;
import com.alibaba.excel.metadata.data.WriteCellData;
import com.alibaba.excel.metadata.property.ExcelContentProperty;
import com.alibaba.excel.metadata.GlobalConfiguration;

import java.util.Arrays;
import java.util.stream.Collectors;

/**
 * 通用数组转换器，把 Number[] 转换为逗号分隔字符串
 * 例如 {1.2f, 3.4f} -> "1.2,3.4"
 */
public class NumberArrayConverter implements Converter<Number[]> {

    @Override
    public Class<?> supportJavaTypeKey() {
        // 支持所有 Number[]（Float[]、Double[]、Integer[]...）
        return Number[].class;
    }

    @Override
    public CellDataTypeEnum supportExcelTypeKey() {
        return CellDataTypeEnum.STRING;
    }

    @Override
    public WriteCellData<String> convertToExcelData(Number[] value,
            ExcelContentProperty contentProperty,
            GlobalConfiguration globalConfiguration) {
        if (value == null || value.length == 0) {
            return new WriteCellData<>("");
        }
        String result = Arrays.stream(value)
                .map(String::valueOf)
                .collect(Collectors.joining(","));
        return new WriteCellData<>(result);
    }
}
