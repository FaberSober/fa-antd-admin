package com.faber.buzz.msg.vo;

import com.faber.buzz.admin.entity.User;
import com.faber.buzz.msg.entity.Msg;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class MsgPageVo extends Msg {

    private String buzzName;

    private User fromUser;

    private User toUser;

}
