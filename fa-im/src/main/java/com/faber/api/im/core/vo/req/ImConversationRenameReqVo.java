package com.faber.api.im.core.vo.req;

import java.io.Serializable;

import com.dtflys.forest.annotation.NotNull;

import lombok.Data;

@Data
public class ImConversationRenameReqVo implements Serializable {

    @NotNull
    private String conversationId;

    /** 群聊用户ID */
    @NotNull
    private String title;
    
}
