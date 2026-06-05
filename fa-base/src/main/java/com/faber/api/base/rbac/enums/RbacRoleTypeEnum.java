package com.faber.api.base.rbac.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * 角色类型
 */
@Getter
public enum RbacRoleTypeEnum implements IEnum<Integer> {

    GLOBAL_SUPER(1, "全局超管"),
    GLOBAL(2, "全局"),
    TENANT(3, "租户");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    RbacRoleTypeEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

}
