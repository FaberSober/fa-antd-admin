package com.faber.common.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@Getter
public enum RbacLinkTypeEnum implements IEnum<Integer> {
    INNER(1, "内部链接"),
    OUT(2, "外部链接");

    @JsonValue
    @EnumValue
    private final Integer code;
    private final String val;

    RbacLinkTypeEnum(Integer code, String val) {
        this.code = code;
        this.val = val;
    }

    @Override
    public Integer getValue() {
        return code;
    }
}
