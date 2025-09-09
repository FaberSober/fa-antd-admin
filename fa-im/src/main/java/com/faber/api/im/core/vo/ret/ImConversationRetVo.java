package com.faber.api.im.core.vo.ret;

import com.alibaba.excel.annotation.ExcelProperty;
import com.faber.api.im.core.entity.ImConversation;
import com.faber.core.annotation.SqlEquals;

import lombok.Data;

@Data
public class ImConversationRetVo extends ImConversation {
    
    @SqlEquals
    @ExcelProperty("最后一条已读消息ID")
    private Long lastReadMessageId;

    @ExcelProperty("未读消息数量")
    private Integer unreadCount;
    
    // 如用户A与用户B的单聊：针对用户A，会话标题为用户B。针对用户B，会话标题为用户A
    @ExcelProperty("用户标题")
    private String convTitle;


}
