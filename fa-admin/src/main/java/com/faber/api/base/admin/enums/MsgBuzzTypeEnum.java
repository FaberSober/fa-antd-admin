package com.faber.api.base.admin.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum MsgBuzzTypeEnum implements IEnum<Integer> {
    SYS(1, "系统通知"),
    SMS_CODE(2, "短信验证码");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    MsgBuzzTypeEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

}
