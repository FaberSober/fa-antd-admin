package com.faber.api.flow.manage.enums;

import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.ObjUtil;
import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum FlowProcessFormTypeEnum implements IEnum<Integer> {
    SYSTEM(1, "系统表单"),
    CUSTOM(2, "自定义表单");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    FlowProcessFormTypeEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public static FlowProcessFormTypeEnum fromValue(Integer value) {
        FlowProcessFormTypeEnum result = ArrayUtil.firstMatch(i -> ObjUtil.equals(i.value, value), values());
        if (result == null) {
            throw new IllegalArgumentException("Invalid FlowProcessFormTypeEnum value: " + value);
        }
        return result;
    }

    public static FlowProcessFormTypeEnum fromDesc(String value) {
        FlowProcessFormTypeEnum result = ArrayUtil.firstMatch(i -> ObjUtil.equals(i.desc, value), values());
        if (result == null) {
            throw new IllegalArgumentException("Invalid FlowProcessFormTypeEnum desc: " + value);
        }
        return result;
    }

}
