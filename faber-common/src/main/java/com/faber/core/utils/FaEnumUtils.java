package com.faber.core.utils;

import cn.hutool.core.util.ReflectUtil;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.faber.core.vo.DictOption;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 枚举帮助类
 * @author xu.pengfei
 * @date 2022/11/28 14:29
 */
public class FaEnumUtils {

    public static List<DictOption> toOptions(Class<? extends IEnum> clazz) {
        return Arrays.stream(clazz.getEnumConstants())
                .map(i -> {
                    String value = i.getValue() + "";
                    String text = (String) ReflectUtil.getFieldValue(i, "desc");
                    return new DictOption(value, text);
                })
                .collect(Collectors.toList());
    }

}
