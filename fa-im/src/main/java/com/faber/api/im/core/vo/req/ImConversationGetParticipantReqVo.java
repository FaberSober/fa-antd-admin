package com.faber.api.im.core.vo.req;

import java.io.Serializable;

import com.dtflys.forest.annotation.NotNull;

import lombok.Data;

@Data
public class ImConversationGetParticipantReqVo implements Serializable {

    @NotNull
    private String conversationId;

    private String name;

}
