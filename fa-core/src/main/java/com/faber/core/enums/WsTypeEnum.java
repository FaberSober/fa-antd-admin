package com.faber.core.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;


/**
 * 一些自定义的WebSocket枚举type
 */
@Getter
public enum WsTypeEnum implements IEnum<String> {
    PLAIN_TEXT("PLAIN_TEXT", "纯文本"),
    ;

    @JsonValue
    @EnumValue
    private final String value;
    private final String desc;

    WsTypeEnum(String value, String desc) {
        this.value = value;
        this.desc = desc;
    }

}
