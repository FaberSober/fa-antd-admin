package com.faber.api.base.admin.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.faber.api.base.admin.entity.User;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;


/**
 * 用户-工作状态
 * {@link User#getWorkStatus()}
 */
@Getter
public enum UserWorkStatusEnum implements IEnum<Integer> {

    ON_JOB(0,"在职"),
    ASK_LEAVE(1,"请假"),
    DEPART(2,"离职");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    UserWorkStatusEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }
}
