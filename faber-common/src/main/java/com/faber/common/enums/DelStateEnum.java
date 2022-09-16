package com.faber.common.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import lombok.Getter;

@Getter
public enum DelStateEnum implements IEnum<Integer> {
    VALID(0, "有效"),
    DELETED(1, "删除");

    @EnumValue
    private final Integer code;
    private final String val;

    DelStateEnum(Integer code, String val) {
        this.code = code;
        this.val = val;
    }

    @Override
    public Integer getValue() {
        return code;
    }
}
