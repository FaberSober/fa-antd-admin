package com.faber.api.im.core.enums;

import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.ObjUtil;
import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * 类型：1-文本/2-图片/3-视频/4-文件
 * 
 * @author xu.pengfei
 * @date 2025-08-25 17:25:29
 */
@Getter
public enum ImMessageTypeEnum implements IEnum<Integer> {
    TEXT(1, "文本"),
    IMAGE(2, "图片"),
    VIDEO(3, "视频"),
    FILE(4, "文件");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    ImMessageTypeEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public static ImMessageTypeEnum fromValue(Integer value) {
        ImMessageTypeEnum result = ArrayUtil.firstMatch(i -> ObjUtil.equals(i.value, value), values());
        if (result == null) {
            throw new IllegalArgumentException("Invalid ImMessageTypeEnum value: " + value);
        }
        return result;
    }

    public static ImMessageTypeEnum fromDesc(String value) {
        ImMessageTypeEnum result = ArrayUtil.firstMatch(i -> ObjUtil.equals(i.desc, value), values());
        if (result == null) {
            throw new IllegalArgumentException("Invalid ImMessageTypeEnum desc: " + value);
        }
        return result;
    }

}