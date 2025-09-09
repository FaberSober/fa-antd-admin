package com.faber.api.im.core.vo.req;

import java.io.Serializable;

import lombok.Data;

@Data
public class ImMessagePageQueryVo implements Serializable {
    
    private Long maxId;
    private Long conversationId;

}
