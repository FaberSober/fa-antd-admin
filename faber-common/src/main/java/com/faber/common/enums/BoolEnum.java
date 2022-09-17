package com.faber.common.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import lombok.Getter;

@Getter
public enum BoolEnum implements IEnum<Integer> {
    NO(0, "否"),
    YES(1, "是");

    @EnumValue
    private final Integer code;
    private final String val;

    BoolEnum(Integer code, String val) {
        this.code = code;
        this.val = val;
    }

    @Override
    public Integer getValue() {
        return code;
    }
}
