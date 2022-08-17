package com.faber.msg.vo;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class MsgStatisticVO {

    /**
     * 未读消息数量
     */
    private Integer unreadCount;

}
