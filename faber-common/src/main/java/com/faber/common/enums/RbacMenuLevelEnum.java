package com.faber.common.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import lombok.Getter;

@Getter
public enum RbacMenuLevelEnum implements IEnum<Integer> {
    APP(0, "模块"),
    LEVEL_1(2, "一级菜单"),
    LEVEL_2(2, "二级菜单"),
    LEVEL_3(3, "三级菜单"),
    BUTTON(9, "按钮");

    @EnumValue
    private final Integer code;
    private final String val;

    RbacMenuLevelEnum(Integer code, String val) {
        this.code = code;
        this.val = val;
    }

    @Override
    public Integer getValue() {
        return code;
    }
}
