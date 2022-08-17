package com.faber.msg.vo;

import com.faber.admin.vo.UserInfo;
import com.faber.msg.entity.Msg;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class MsgPageVo extends Msg {

    private String buzzName;

    private UserInfo fromUser;

    private UserInfo toUser;

}
