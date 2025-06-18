package com.faber.core.enums;

import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.ObjUtil;
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

    public static SexEnum fromValue(Integer value) {
        SexEnum result = ArrayUtil.firstMatch(i -> ObjUtil.equals(i.value, value), values());
        if (result == null) {
            throw new IllegalArgumentException("Invalid SexEnum value: " + value);
        }
        return result;
    }

    public static SexEnum fromDesc(String value) {
        SexEnum result = ArrayUtil.firstMatch(i -> ObjUtil.equals(i.desc, value), values());
        if (result == null) {
            throw new IllegalArgumentException("Invalid SexEnum desc: " + value);
        }
        return result;
    }

}
