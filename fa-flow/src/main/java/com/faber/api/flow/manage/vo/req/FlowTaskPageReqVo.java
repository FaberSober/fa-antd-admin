package com.faber.api.flow.manage.vo.req;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

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
    private String actorId;
    private List<String> actorIds;
    private String createId;
    /**
     * 参与者类型 0，用户 1，角色 2，部门
     */
    protected Integer actorType;

}
