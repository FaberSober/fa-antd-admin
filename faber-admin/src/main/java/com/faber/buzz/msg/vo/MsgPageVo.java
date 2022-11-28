package com.faber.buzz.msg.vo;

import com.faber.buzz.admin.vo.UserInfo;
import com.faber.buzz.msg.entity.Msg;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class MsgPageVo extends Msg {

    private String buzzName;

    private UserInfo fromUser;

    private UserInfo toUser;

}
