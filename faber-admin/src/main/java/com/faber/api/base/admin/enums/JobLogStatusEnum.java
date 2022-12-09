package com.faber.api.base.admin.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum JobLogStatusEnum implements IEnum<Integer> {
    DOING(1, "执行中"),
    DONE(2, "成功"),
    ERROR(9, "失败");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    JobLogStatusEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

}
