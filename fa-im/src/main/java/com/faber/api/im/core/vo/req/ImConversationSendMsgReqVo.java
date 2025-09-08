package com.faber.api.im.core.vo.req;

import java.io.Serializable;

import com.dtflys.forest.annotation.NotNull;
import com.faber.api.im.core.enums.ImMessageTypeEnum;

import lombok.Data;

@Data
public class ImConversationSendMsgReqVo implements Serializable {
    
    @NotNull
    private Long conversationId;

    @NotNull
    private String content;

    @NotNull
    private ImMessageTypeEnum type;

}
