package com.faber.core.vo.excel;

import cn.hutool.core.map.MapUtil;
import lombok.Data;
import lombok.ToString;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;

@Data
@ToString
public class CommonImportExcelReqVo extends LinkedHashMap<String, Object> {

    /**
     * 文件ID
     */
    private String fileId;

    /**
     * 业务类型
     */
    private String buzzType;

    public CommonImportExcelReqVo(Map<String, Object> params) {
        this.putAll(params);
        this.fileId = MapUtil.getStr(params, "fileId");
        this.buzzType = MapUtil.getStr(params, "buzzType");
    }

}
