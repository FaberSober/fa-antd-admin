package com.faber.core.vo.socket;

import lombok.Data;

import java.io.Serializable;

@Data
public class SocketTaskStopVo implements Serializable {

    /**
     * 任务ID
     */
    private String taskId;

}
