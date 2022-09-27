package com.faber.common.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum BoolEnum implements IEnum<Integer> {
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

//    @Override
//    public String getValDesc() {
//        return val;
//    }
//
//    public static BoolEnum parseFromString(String val) {
//        return Arrays.stream(BoolEnum.values())
//                .filter(a -> ObjectUtil.equal(a.val, val))
//                .findFirst().orElse(null);
//    }

}
