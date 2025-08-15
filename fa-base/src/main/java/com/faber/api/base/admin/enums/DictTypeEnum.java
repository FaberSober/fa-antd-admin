package com.faber.api.base.admin.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.faber.api.base.admin.entity.Dict;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * {@link Dict#getType()} 数值类型：1-选择列表，2-字符串，3-关联列表，4-关联树
 */
@Getter
public enum DictTypeEnum implements IEnum<Integer> {
    LINK_OPTIONS(1, "关联列表"),
    LINK_TREE(2, "关联树"),
    TEXT(3, "字符串"),
    OPTIONS(4, "选择列表");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    DictTypeEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

}
