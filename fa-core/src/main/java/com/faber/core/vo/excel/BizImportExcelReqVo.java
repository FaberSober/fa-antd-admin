package com.faber.core.vo.excel;

import lombok.Data;
import lombok.ToString;

import java.io.Serializable;

@Data
@ToString
public class BizImportExcelReqVo<T> implements Serializable {

    /**
     * 文件ID
     */
    private String fileId;

    private T bizId;

}
