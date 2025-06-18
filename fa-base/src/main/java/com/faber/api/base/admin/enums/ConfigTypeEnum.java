package com.faber.api.base.admin.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum ConfigTypeEnum implements IEnum<Integer> {
    TABLE_COLUMNS(1, "表格展示字段"),
    QUERY_CONDITION(2, "高级查询条件");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    ConfigTypeEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

}
