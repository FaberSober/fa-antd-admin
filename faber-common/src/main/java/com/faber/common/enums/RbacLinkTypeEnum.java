package com.faber.common.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import lombok.Getter;

@Getter
public enum RbacLinkTypeEnum implements IEnum<Integer> {
    INNER(1, "内部链接"),
    OUT(2, "外部链接");

    @EnumValue
    private final Integer code;
    private final String val;

    RbacLinkTypeEnum(Integer code, String val) {
        this.code = code;
        this.val = val;
    }

    @Override
    public Integer getValue() {
        return code;
    }
}
