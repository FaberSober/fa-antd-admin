package com.faber.core.enums;

import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.EnumUtil;
import cn.hutool.core.util.ObjUtil;
import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;


/**
 * local storage active
 */
@Getter
public enum ConfigSysStorageActiveEnum implements IEnum<String> {
    LOCAL_PLUS("local-plus", "local-plus-1"),
    MINIO("minio", "minio-1"),
    QINIU("qiniu", "qiniu-1");

    @JsonValue
    @EnumValue
    private final String value;
    private final String desc;

    ConfigSysStorageActiveEnum(String value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public static ConfigSysStorageActiveEnum fromValue(Integer value) {
        ConfigSysStorageActiveEnum result = ArrayUtil.firstMatch(i -> ObjUtil.equals(i.value, value), values());
        if (result == null) {
            throw new IllegalArgumentException("Invalid BoolEnum value: " + value);
        }
        return result;
    }

    public static ConfigSysStorageActiveEnum fromDesc(String value) {
        ConfigSysStorageActiveEnum result = ArrayUtil.firstMatch(i -> ObjUtil.equals(i.desc, value), values());
        if (result == null) {
            throw new IllegalArgumentException("Invalid BoolEnum desc: " + value);
        }
        return result;
    }

}

