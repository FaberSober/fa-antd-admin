package com.faber.api.flow.manage.vo.ret;

import java.io.Serializable;

import lombok.Data;

@Data
public class FlowTaskCountRet implements Serializable {
    
    /** 任务数量-待审批 */
    private Integer pendingApprovalCount;
    
    /** 任务数量-我的申请 */
    private Integer myApplicationCount;
    
    /** 任务数量-我收到的 */
    private Integer myReceivedCount;
    
    /** 任务数量-认领任务 */
    private Integer claimTaskCount;
    
    /** 任务数量-已审批 */
    private Integer auditedCount;

}
