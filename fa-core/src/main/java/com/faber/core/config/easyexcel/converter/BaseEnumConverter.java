package com.faber.core.config.easyexcel.converter;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.ReflectUtil;
import com.alibaba.excel.converters.Converter;
import com.alibaba.excel.enums.CellDataTypeEnum;
import com.alibaba.excel.metadata.GlobalConfiguration;
import com.alibaba.excel.metadata.data.ReadCellData;
import com.alibaba.excel.metadata.data.WriteCellData;
import com.alibaba.excel.metadata.property.ExcelContentProperty;
import com.baomidou.mybatisplus.annotation.IEnum;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * 导出Excel适配Enum类型属性的转换。
 * 约定如下：
 */
@Component
public class BaseEnumConverter implements Converter<IEnum> {

    @Override
    public Class supportJavaTypeKey() {
        return IEnum.class;
    }

    @Override
    public CellDataTypeEnum supportExcelTypeKey() {
        return CellDataTypeEnum.STRING;
    }

    @Override
    public IEnum convertToJavaData(ReadCellData<?> cellData, ExcelContentProperty contentProperty, GlobalConfiguration globalConfiguration) throws Exception {
        Class<IEnum> clazzField = (Class<IEnum>) contentProperty.getField().getType();

        Object bVal = cellData.getStringValue();

        // 通过枚举的values方法获取全部枚举
        return Arrays.stream(clazzField.getEnumConstants())
                .filter(a -> {
                    Object aVal = ReflectUtil.getFieldValue(a, "desc");
                    return ObjectUtil.equal(aVal, bVal);
                })
                .findFirst()
                .orElse(null);
    }

    @Override
    public WriteCellData<String> convertToExcelData(IEnum value, ExcelContentProperty contentProperty, GlobalConfiguration globalConfiguration) throws Exception {
        return new WriteCellData((String)ReflectUtil.getFieldValue(value, "desc"));
    }

}

