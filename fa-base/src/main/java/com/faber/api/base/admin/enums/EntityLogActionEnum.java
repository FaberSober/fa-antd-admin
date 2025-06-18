package com.faber.api.base.admin.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * 实体增删改日志类型枚举
 * @author xu.pengfei
 * @date 2022/11/28 14:17
 */
@Getter
public enum EntityLogActionEnum implements IEnum<Integer> {
    ADD(1, "新增"),
    UPDATE(2, "更新"),
    DEL(3, "删除"),
    MSG(4, "操作");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    EntityLogActionEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

}
