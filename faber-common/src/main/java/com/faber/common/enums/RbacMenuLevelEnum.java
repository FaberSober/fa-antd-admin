package com.faber.common.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
//@JSONType(serializeEnumAsJavaBean = true)
public enum RbacMenuLevelEnum implements IEnum<Integer> {
    APP(0, "模块"),
    LEVEL_1(1, "一级菜单"),
    LEVEL_2(2, "二级菜单"),
    BUTTON(9, "按钮");

    @JsonValue
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

//    @JsonValue
//    public Map<String,Object> toMap() {
//        Map<String,Object> map = new HashMap<>();
//        map.put("code", this.code);
//        map.put("val ", this.val);
//        return map;
//    }
}
