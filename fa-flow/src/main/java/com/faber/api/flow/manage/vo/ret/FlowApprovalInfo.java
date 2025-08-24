package com.faber.api.flow.manage.vo.ret;

import java.io.Serializable;
import java.util.Map;

import com.aizuda.bpm.engine.entity.FlwInstance;
import com.aizuda.bpm.engine.entity.FlwProcess;

import lombok.Data;

@Data
public class FlowApprovalInfo implements Serializable {

    private Long instanceId;
    private Integer instanceState;

    private FlwInstance flwInstance;
    private FlwProcess flwProcess;

    private Map<String, Object> renderNodes;

}
