package com.faber.common.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * Bool
 * @author xu.pengfei
 * @date 2022/11/28 14:15
 */
@Getter
public enum BoolEnum implements IEnum<Integer> {
    NO(0, "否"),
    YES(1, "是");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    BoolEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

}
