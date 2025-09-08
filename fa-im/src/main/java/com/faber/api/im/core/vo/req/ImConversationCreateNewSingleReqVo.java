package com.faber.api.im.core.vo.req;

import java.io.Serializable;

import com.dtflys.forest.annotation.NotNull;

import lombok.Data;

@Data
public class ImConversationCreateNewSingleReqVo implements Serializable {

    /** 单聊对方用户ID */
    @NotNull
    private String toUserId;
    
}
