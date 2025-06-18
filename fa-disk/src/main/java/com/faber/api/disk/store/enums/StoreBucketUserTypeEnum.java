package com.faber.api.disk.store.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum StoreBucketUserTypeEnum implements IEnum<Integer> {
    CREATOR(1, "创建者"),
    USER(2, "操作者");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    StoreBucketUserTypeEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }
}
