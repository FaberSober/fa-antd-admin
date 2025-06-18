package com.faber.core.config.socket.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum SocketMsgActEnum implements IEnum<String> {
    TEXT("TEXT", "TEXT"), // simple show text
    LINK("LINK", "LINK"), // simple show text with link
    LINK_IMG("LINK_IMG", "LINK_IMG"), // simple show text and img with link
    LINK_VIDEO("LINK_VIDEO", "LINK_VIDEO"), // simple show text and video with link
    JSON("JSON", "JSON"), // json格式数据
    OPERATION_DONE("OPERATION_DONE", "OPERATION_DONE"), // 当前操作结束
    ONLINE_MSG("ONLINE_MSG", "ONLINE_MSG"); // online-站内ws消息

    @JsonValue
    @EnumValue
    private final String value;
    private final String desc;

    SocketMsgActEnum(String value, String desc) {
        this.value = value;
        this.desc = desc;
    }

}
