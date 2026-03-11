package com.faber.core.config.easyexcel.converter;

import com.alibaba.excel.converters.Converter;
import com.alibaba.excel.enums.CellDataTypeEnum;
import com.alibaba.excel.metadata.GlobalConfiguration;
import com.alibaba.excel.metadata.data.WriteCellData;
import com.alibaba.excel.metadata.property.ExcelContentProperty;

import java.text.DecimalFormat;

/**
 * EasyExcel自定义转换器：将 Float 类型数据格式化为标准小数形式（避免科学记数法）
 */
public class CustomFloatConverter implements Converter<Float> {

    // 格式化器：使用足够的精度，例如 10 位小数。
    // 如果你的 float 数据精度要求更高，请调整后面的 0 的数量。
    private static final DecimalFormat FORMATTER = new DecimalFormat("0.0000000000");

    @Override
    public Class supportJavaTypeKey() {
        // 1. 修改为支持 Float 类型
        return Float.class;
    }

    @Override
    public CellDataTypeEnum supportExcelTypeKey() {
        // 最终写入 CSV 仍是字符串格式
        return CellDataTypeEnum.STRING; 
    }

    /**
     * 将 Float 对象转换为 Excel/CSV 单元格的字符串值
     */
    @Override
    public WriteCellData<String> convertToExcelData(Float value, ExcelContentProperty contentProperty, 
                                                    GlobalConfiguration globalConfiguration) {
        if (value == null) {
            return new WriteCellData("");
        }
        
        // 使用 DecimalFormat 进行格式化，输出为标准小数字符串
        // Float 类型会自动提升为 double 类型进行格式化操作
        String formattedString = FORMATTER.format(value);

        return new WriteCellData(formattedString);
    }
    
    // 省略 convertToJavaData 方法，因为 CSV 写入通常不需要反向转换。
}
