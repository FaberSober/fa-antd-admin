package com.faber.common.enums;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

import java.util.Arrays;

@Getter
public enum SexEnum implements IEnum<Integer>, BaseEnum {
    FEMALE(0, "女"),
    MALE(1, "男"),
    UNKNOWN(2, "未知");

    @JsonValue
    @EnumValue
    private final Integer code;
    private final String val;

    SexEnum(Integer code, String val) {
        this.code = code;
        this.val = val;
    }

    @Override
    public Integer getValue() {
        return code;
    }

    @Override
    public String getValDesc() {
        return val;
    }

    @Override
    public BaseEnum parseFromString(String val) {
        return Arrays.stream(SexEnum.values())
                .filter(a -> ObjectUtil.equal(a.val, val))
                .findFirst().orElse(null);
    }
}
