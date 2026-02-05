package com.faber.api.flow.form.enums;

import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.ObjUtil;
import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * 流程实例状态枚举
 * 
 * @author xu.pengfei
 * @date 2025-08-25 17:25:29
 */
@Getter
public enum FlowFormTypeEnum implements IEnum<Integer> {
    /** 1设计表单 */
    DESIGN(1, "设计表单"),
    /** 2系统表单 */
    SYSTEM(2, "系统表单");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    FlowFormTypeEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public static FlowFormTypeEnum fromValue(Integer value) {
        FlowFormTypeEnum result = ArrayUtil.firstMatch(i -> ObjUtil.equals(i.value, value), values());
        if (result == null) {
            throw new IllegalArgumentException("Invalid FlowFormTypEnum value: " + value);
        }
        return result;
    }

    public static FlowFormTypeEnum fromDesc(String value) {
        FlowFormTypeEnum result = ArrayUtil.firstMatch(i -> ObjUtil.equals(i.desc, value), values());
        if (result == null) {
            throw new IllegalArgumentException("Invalid FlowFormTypEnum desc: " + value);
        }
        return result;
    }

}