package com.faber.api.base.admin.enums;

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
public enum AreaLevelEnum implements IEnum<Integer> {
    NATION(-1, "国家"),
    PROVINCE(0, "省"),
    CITY(1, "市"),
    COUNTY(2, "区县"),
    COUNTRY(3, "乡"),
    VILLAGE(4, "村");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    AreaLevelEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public static AreaLevelEnum getByValue(Integer val) {
        return EnumUtil.getBy(AreaLevelEnum.class, (a) -> ObjectUtil.equal(a.value, val));
    }

}
