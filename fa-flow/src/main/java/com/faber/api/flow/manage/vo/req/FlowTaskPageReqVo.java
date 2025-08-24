package com.faber.api.flow.manage.vo.req;

import java.io.Serializable;
import java.util.Date;

import lombok.Data;

/**
 * task page query
 */
@Data
public class FlowTaskPageReqVo implements Serializable {

    private Date beginTime;
    private Date endTime;
    private Long instanceId;
    private String instanceState;
    private String processName;

}
