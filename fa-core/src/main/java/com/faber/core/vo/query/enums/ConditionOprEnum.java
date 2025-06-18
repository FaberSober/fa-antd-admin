package com.faber.core.vo.query.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum ConditionOprEnum implements IEnum<String> {
    EQ("eq", "equal"),
    NE("ne", "not_equal"),
    LIKE("like", "like"),
    NOT_LIKE("notLike", "notLike"),
    LIKE_LEFT("likeLeft", "likeLeft"),
    LIKE_RIGHT("likeRight", "likeRight"),
    GT("gt", "gt"),
    GE("ge", "ge"),
    LT("lt", "lt"),
    LE("le", "le"),
    BETWEEN("between", "between"),
    IN("in", "in"),
    NOT_IN("notIn", "notIn"),
    IS_NOT_NULL("isNotNull", "isNotNull"),
    IS_NULL("isNull", "isNull");

    @JsonValue
    @EnumValue
    private final String value;
    private final String desc;

    ConditionOprEnum(String value, String desc) {
        this.value = value;
        this.desc = desc;
    }

}
