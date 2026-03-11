package com.faber.api.im.core.vo.req;

import java.io.Serializable;
import java.util.List;

import com.dtflys.forest.annotation.NotNull;

import lombok.Data;

@Data
public class ImConversationAddGroupUsersReqVo implements Serializable {

    @NotNull
    private String conversationId;

    /** 群聊用户ID */
    @NotNull
    private List<String> userIds;
    
}
