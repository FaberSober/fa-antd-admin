package com.faber.core.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * 文件存储类型枚举
 * @author xu.pengfei
 * @date 2022/11/28 14:18
 */
@Getter
public enum FileSaveDriveEnum implements IEnum<Integer> {
    LOCAL(1, "本地"),
    QINIU(2, "七牛云"),
    ALI(3, "阿里云"),
    TX(4, "腾讯云");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    FileSaveDriveEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

}
