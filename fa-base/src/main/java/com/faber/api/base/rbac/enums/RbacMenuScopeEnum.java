package com.faber.api.base.rbac.enums;

import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.ObjUtil;
import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum RbacMenuScopeEnum implements IEnum<Integer> {
    WEB(1, "web"),
    APP(2, "app");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    RbacMenuScopeEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public static RbacMenuScopeEnum fromValue(Integer value) {
        RbacMenuScopeEnum result = ArrayUtil.firstMatch(i -> ObjUtil.equals(i.value, value), values());
        if (result == null) {
            throw new IllegalArgumentException("Invalid RbacMenuScopeEnum value: " + value);
        }
        return result;
    }

    public static RbacMenuScopeEnum fromDesc(String value) {
        RbacMenuScopeEnum result = ArrayUtil.firstMatch(i -> ObjUtil.equals(i.desc, value), values());
        if (result == null) {
            throw new IllegalArgumentException("Invalid RbacMenuScopeEnum desc: " + value);
        }
        return result;
    }

}
