package com.faber.api.base.admin.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum SexEnum implements IEnum<Integer> {
    FEMALE(0, "女"),
    MALE(1, "男"),
    UNKNOWN(2, "保密");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    SexEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

}
