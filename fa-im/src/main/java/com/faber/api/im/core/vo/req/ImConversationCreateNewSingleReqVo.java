package com.faber.api.im.core.vo.req;

import java.io.Serializable;

import lombok.Data;

@Data
public class ImConversationCreateNewSingleReqVo implements Serializable {

    /** 单聊对方用户ID */
    private String toUserId;
    
}
