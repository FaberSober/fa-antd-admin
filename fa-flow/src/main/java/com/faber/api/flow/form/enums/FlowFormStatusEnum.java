package com.faber.api.flow.form.enums;

import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.ObjUtil;
import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * 状态：1启用/2禁止
 * 
 * @author xu.pengfei
 * @date 2025-08-25 17:25:29
 */
@Getter
public enum FlowFormStatusEnum implements IEnum<Integer> {
    /** 1启用 */
    ENABLED(1, "启用"),
    /** 2禁止 */
    DISABLED(2, "禁止");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    FlowFormStatusEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public static FlowFormStatusEnum fromValue(Integer value) {
        FlowFormStatusEnum result = ArrayUtil.firstMatch(i -> ObjUtil.equals(i.value, value), values());
        if (result == null) {
            throw new IllegalArgumentException("Invalid FlowFormTypEnum value: " + value);
        }
        return result;
    }

    public static FlowFormStatusEnum fromDesc(String value) {
        FlowFormStatusEnum result = ArrayUtil.firstMatch(i -> ObjUtil.equals(i.desc, value), values());
        if (result == null) {
            throw new IllegalArgumentException("Invalid FlowFormTypEnum desc: " + value);
        }
        return result;
    }

}