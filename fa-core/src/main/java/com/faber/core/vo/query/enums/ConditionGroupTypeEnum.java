package com.faber.core.vo.query.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum ConditionGroupTypeEnum implements IEnum<String> {
    AND("and", "AND"),
    OR("or", "OR");

    @JsonValue
    @EnumValue
    private final String value;
    private final String desc;

    ConditionGroupTypeEnum(String value, String desc) {
        this.value = value;
        this.desc = desc;
    }

}
