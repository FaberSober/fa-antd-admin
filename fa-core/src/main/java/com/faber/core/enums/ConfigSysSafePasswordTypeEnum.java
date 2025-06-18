package com.faber.core.enums;

import cn.hutool.core.util.EnumUtil;
import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * 地区等级
 */
@Getter
public enum ConfigSysSafePasswordTypeEnum implements IEnum<Integer> {
    NUM(1, "必须包含数字"),
    CHAR(2, "必须包含字母"),
    NUM_CHAR(3, "必须包含数字+字母"),
    NUM_CHAR_SPEC(4, "必须包含数字+字母+特殊字符");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    ConfigSysSafePasswordTypeEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public static ConfigSysSafePasswordTypeEnum getByValue(Integer val) {
        return EnumUtil.getBy(ConfigSysSafePasswordTypeEnum.class, (a) -> ObjectUtil.equal(a.value, val));
    }

}
