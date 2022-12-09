package com.faber.api.base.msg.vo;

import com.faber.api.base.admin.entity.User;
import com.faber.api.base.msg.entity.Msg;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class MsgPageVo extends Msg {

    private String buzzName;

    private User fromUser;

    private User toUser;

}
