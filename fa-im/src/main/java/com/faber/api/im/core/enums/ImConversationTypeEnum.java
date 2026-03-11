package com.faber.api.im.core.enums;

import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.ObjUtil;
import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * 类型：1-单聊/2-群聊
 * 
 * @author xu.pengfei
 * @date 2025-08-25 17:25:29
 */
@Getter
public enum ImConversationTypeEnum implements IEnum<Integer> {
    /** 单聊 */
    SINGLE(1, "单聊"),
    /** 群聊 */
    GROUP(2, "群聊");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    ImConversationTypeEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public static ImConversationTypeEnum fromValue(Integer value) {
        ImConversationTypeEnum result = ArrayUtil.firstMatch(i -> ObjUtil.equals(i.value, value), values());
        if (result == null) {
            throw new IllegalArgumentException("Invalid ImMessageTypeEnum value: " + value);
        }
        return result;
    }

    public static ImConversationTypeEnum fromDesc(String value) {
        ImConversationTypeEnum result = ArrayUtil.firstMatch(i -> ObjUtil.equals(i.desc, value), values());
        if (result == null) {
            throw new IllegalArgumentException("Invalid ImMessageTypeEnum desc: " + value);
        }
        return result;
    }

}