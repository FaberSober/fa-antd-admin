package com.faber.msg.vo;

import lombok.Data;
import lombok.ToString;
import lombok.experimental.Accessors;

@Data
@ToString
@Accessors(chain = true)
public class MsgStatisticVO {

    /**
     * 未读消息数量
     */
    private Long unreadCount;

}
