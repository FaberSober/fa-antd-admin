package com.faber.core.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * 日志操作CRUD类型
 * @author xu.pengfei
 * @date 2022/11/28 14:18
 */
@Getter
public enum LogCrudEnum implements IEnum<String> {
    C("C", "新增"),
    R("R", "读取"),
    U("U", "更新"),
    D("D", "删除");

    @JsonValue
    @EnumValue
    private final String value;
    private final String desc;

    LogCrudEnum(String value, String desc) {
        this.value = value;
        this.desc = desc;
    }

}
