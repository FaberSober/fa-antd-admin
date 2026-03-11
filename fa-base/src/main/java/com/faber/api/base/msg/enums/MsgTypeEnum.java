package com.faber.api.base.msg.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * 消息来源：1-系统消息，2-流程消息
 */
@Getter
public enum MsgTypeEnum implements IEnum<Integer> {
    SYSTEM(1, "系统消息"),
    FLOW(2, "流程消息");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    MsgTypeEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

}
