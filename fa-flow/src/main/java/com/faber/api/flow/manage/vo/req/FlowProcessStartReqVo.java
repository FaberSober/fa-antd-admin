package com.faber.api.flow.manage.vo.req;

import java.io.Serializable;
import java.util.Map;

import com.alibaba.excel.annotation.ExcelProperty;
import com.dtflys.forest.annotation.NotNull;

import lombok.Data;

@Data
public class FlowProcessStartReqVo implements Serializable {

    @NotNull
    @ExcelProperty("流程定义ID")
    private Long processId;

    @Deprecated
    @ExcelProperty("流程定义 key 唯一标识")
    private String processKey;

    /**
     * 流程实例的业务数据
     */
    private Map<String, Object> args;

}
