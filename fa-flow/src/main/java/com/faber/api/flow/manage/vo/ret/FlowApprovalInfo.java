package com.faber.api.flow.manage.vo.ret;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.aizuda.bpm.engine.entity.FlwProcess;
import com.aizuda.bpm.engine.entity.FlwTask;
import com.faber.api.flow.core.enums.FaInstanceStateEnum;
import com.faber.api.flow.manage.entity.FlowProcess;

import lombok.Data;

@Data
public class FlowApprovalInfo implements Serializable {

    private Long instanceId;
    private FaInstanceStateEnum instanceState;

    private String createBy;
    private String createId;
    private Date createTime;

    /**
     * 表单内容，存储的是表单业务数据，形如：
     * {
            "formId": 3,
            "formData": {
                "days": 1,
                "date": "2026-01-09 16:37:21",
                "reason": "aaaaa",
                "id": "5"
            }
        }
     */
    private String formContent;

    /**
     * 当前任务
     */
    private FlwTask currentTask;

    /**
     * 流程配置json {@link FlwProcess#getModelContent()}
     */
    private String modelContent;

    /**
     * 展示节点的状态。
     * flk_1766028199425_wmmxhpaa: "0"
     * flk_1766028199426_rfwzffue: "1"
     */
    private Map<String, Object> renderNodes;

    // private FlwHisInstance flwHisInstance;
    // private FlwExtInstance flwExtInstance;
    private FlwProcess flwProcess;
    private FlowProcess flowProcess;

    /**
     * 流程审批历史记录列表
     */
    private List<FlowProcessApprovalVo> processApprovals;

}
