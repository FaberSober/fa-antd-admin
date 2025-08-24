package com.faber.api.flow.manage.vo.ret;

import java.io.Serializable;
import java.util.Date;
import java.util.Map;

import com.aizuda.bpm.engine.entity.FlwProcess;

import lombok.Data;

@Data
public class FlowApprovalInfo implements Serializable {

    private Long instanceId;
    private Integer instanceState;

    private String createBy;
    private String createId;
    private Date createTime;
    private String formContent;
    // private String modelContent;

    private Map<String, Object> renderNodes;

    // private FlwHisInstance flwHisInstance;
    // private FlwExtInstance flwExtInstance;
    private FlwProcess flwProcess;

}
