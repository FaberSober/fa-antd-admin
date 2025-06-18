package com.faber.api.base.admin.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum DictCodeEnum implements IEnum<String> {
    COMMON_SEX("common_sex", "账户/性别"),
    COMMON_USER_STATUS("common_user_status", "账户/状态"),
    COMMON_AREA_LEVEL("common_area_level", "地区/层级"),
    BASE_DICT_BOOL("base_dict_bool", "是否");

    @JsonValue
    @EnumValue
    private final String value;
    private final String desc;

    DictCodeEnum(String value, String desc) {
        this.value = value;
        this.desc = desc;
    }

}
