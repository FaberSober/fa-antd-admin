package com.faber.common.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum DelStateEnum implements IEnum<Integer> {
    VALID(0, "有效"),
    DELETED(1, "删除");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    DelStateEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

}
