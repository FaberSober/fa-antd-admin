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
import com.faber.core.config.easyexcel.type.FaJsonObj;
import org.springframework.stereotype.Component;

import java.util.Arrays;


/**
 * @author xupengfei
 * @email faberxu@gmail.com
 * @date 2022/12/9 14:15
 */
@Component
public class FaJsonObjConverter implements Converter<FaJsonObj> {

    @Override
    public Class supportJavaTypeKey() {
        return FaJsonObj.class;
    }

    @Override
    public CellDataTypeEnum supportExcelTypeKey() {
        return CellDataTypeEnum.STRING;
    }

    @Override
    public FaJsonObj convertToJavaData(ReadCellData<?> cellData, ExcelContentProperty contentProperty, GlobalConfiguration globalConfiguration) throws Exception {
        // TODO 目前不支持导入
        Class<FaJsonObj> clazzField = (Class<FaJsonObj>) contentProperty.getField().getType();
        return null;
    }

    @Override
    public WriteCellData<String> convertToExcelData(FaJsonObj value, ExcelContentProperty contentProperty, GlobalConfiguration globalConfiguration) throws Exception {
        return new WriteCellData(ObjectUtil.toString(value));
    }

}
