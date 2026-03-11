package com.faber.api.flow.manage.vo.req;

import java.io.Serializable;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 流程任务认领请求对象
 * 
 * @author xu.pengfei
 * @date 2025-01-02
 */
@Data
public class FlowTaskClaimReqVo implements Serializable {

    /**
     * 任务ID - 必填参数
     */
    @NotNull(message = "任务ID不能为空")
    private Long taskId;

}