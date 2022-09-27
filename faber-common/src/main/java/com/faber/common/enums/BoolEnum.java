package com.faber.common.enums;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

import java.util.Arrays;

@Getter
public enum BoolEnum implements IEnum<Integer>, BaseEnum {
    NO(0, "否"),
    YES(1, "是");

    @JsonValue
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

    @Override
    public String getValDesc() {
        return val;
    }

    @Override
    public BaseEnum parseFromString(String val) {
        return Arrays.stream(BoolEnum.values())
                .filter(a -> ObjectUtil.equal(a.val, val))
                .findFirst().orElse(null);
    }

}
