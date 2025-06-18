package com.faber.core.config.easyexcel.converter;

import cn.hutool.core.util.ObjectUtil;
import com.alibaba.excel.converters.Converter;
import com.alibaba.excel.enums.CellDataTypeEnum;
import com.alibaba.excel.metadata.GlobalConfiguration;
import com.alibaba.excel.metadata.data.CellData;
import com.alibaba.excel.metadata.data.ReadCellData;
import com.alibaba.excel.metadata.data.WriteCellData;
import com.alibaba.excel.metadata.property.ExcelContentProperty;
import com.faber.core.config.easyexcel.type.FaJsonObj;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * @author xupengfei
 * @email faberxu@gmail.com
 * @date 2022/12/9 14:31
 */
@Component
public class ListConverter implements Converter<List> {
    @Override
    public Class supportJavaTypeKey() {
        return List.class;
    }

    @Override
    public CellDataTypeEnum supportExcelTypeKey() {
        return CellDataTypeEnum.STRING;
    }


    @Override
    public List convertToJavaData(ReadCellData<?> cellData, ExcelContentProperty contentProperty, GlobalConfiguration globalConfiguration) throws Exception {
        // TODO 目前不支持导入
        // Class<List> clazzField = (Class<FaJsonObj>) contentProperty.getField().getType();
        return null;
    }

    @Override
    public WriteCellData<String> convertToExcelData(List value, ExcelContentProperty contentProperty, GlobalConfiguration globalConfiguration) throws Exception {
        StringBuilder stringBuilder = new StringBuilder();
        value.forEach(o -> {
            stringBuilder.append(ObjectUtil.toString(o) + ",");
        });
        return new WriteCellData(ObjectUtil.toString(value));
    }

}

