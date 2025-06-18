package com.faber.core.enums;

import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.ObjUtil;
import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;


/**
 * 通用审核状态
 */
@Getter
public enum AuditEnum implements IEnum<Integer> {
    TODO(0, "待审核"),
    PASS(1, "通过"),
    NO_PASS(2, "不通过");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    AuditEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public static AuditEnum fromValue(Integer value) {
        AuditEnum result = ArrayUtil.firstMatch(i -> ObjUtil.equals(i.value, value), values());
        if (result == null) {
            throw new IllegalArgumentException("Invalid BoolEnum value: " + value);
        }
        return result;
    }

    public static AuditEnum fromDesc(String value) {
        AuditEnum result = ArrayUtil.firstMatch(i -> ObjUtil.equals(i.desc, value), values());
        if (result == null) {
            throw new IllegalArgumentException("Invalid BoolEnum desc: " + value);
        }
        return result;
    }

}
