package com.faber.core.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.faber.core.bean.BaseDelEntity;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * Bean删除状态{@link BaseDelEntity#getDelState()}
 * @author xu.pengfei
 * @date 2022/11/28 14:15
 */
@Getter
public enum DelStateEnum implements IEnum<Integer> {
    VALID(0, "有效"),
    DELETED(1, "删除");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    DelStateEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

}
