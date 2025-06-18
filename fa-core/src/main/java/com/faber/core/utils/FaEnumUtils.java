package com.faber.core.utils;

import cn.hutool.core.util.ReflectUtil;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.faber.core.vo.utils.DictOption;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * 枚举帮助类
 * @author xu.pengfei
 * @date 2022/11/28 14:29
 */
public class FaEnumUtils {

    public static <T extends Serializable> List<DictOption<T>> toOptions(Class<? extends IEnum<T>> clazz) {
        return Arrays.stream(clazz.getEnumConstants())
                .map(i -> {
                    T value = i.getValue();
                    String text = (String) ReflectUtil.getFieldValue(i, "desc");
                    return new DictOption<T>(value, text);
                })
                .collect(Collectors.toList());
    }

    /**
     * 给定value查找对于enum
     * @param clazz
     * @param value
     * @return
     * @param <T>
     * @param <E>
     */
    public static <T extends Serializable, E extends IEnum<T>> E transValueToEnum(Class<E> clazz, T value) {
        for (E enums : clazz.getEnumConstants()) {
            if (Objects.equals(enums.getValue(), value)) {
                return enums;
            }
        }
        return null;
    }

}
