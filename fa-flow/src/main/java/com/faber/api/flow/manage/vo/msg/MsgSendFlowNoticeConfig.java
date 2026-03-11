package com.faber.api.flow.manage.vo.msg;

import com.faber.api.base.msg.entity.Msg;
import com.faber.api.base.msg.enums.MsgBuzzTypeEnum;
import com.faber.api.base.msg.enums.MsgTypeEnum;
import com.faber.api.base.msg.helper.config.MsgSendConfig;
import com.faber.api.base.msg.helper.config.PropKey;

import cn.hutool.json.JSONObject;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

/**
 * 系统通知
 */
@Data
@ToString
@PropKey(value = "", smsEnable = false)
public class MsgSendFlowNoticeConfig extends MsgSendConfig {

    private String content;
    private FaFlowTaskMsgVo taskMsg;

    @Builder
    public MsgSendFlowNoticeConfig(boolean sendAppPush, boolean sendSms, String buzzId, String content, FaFlowTaskMsgVo taskMsg) {
        super(true, false, MsgBuzzTypeEnum.SYS.getValue() + "", buzzId, MsgTypeEnum.FLOW);
        this.content = content;
        this.taskMsg = taskMsg;
    }

    @Override
    public void beforeSave(Msg msg) {
        // save taskMsg as buzzContent
        // transfer taskMsg to JSONOBject
        msg.setBuzzContent((new JSONObject(taskMsg)).toString());
    }

}

