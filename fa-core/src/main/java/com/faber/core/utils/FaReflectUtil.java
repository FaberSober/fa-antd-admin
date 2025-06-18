package com.faber.core.utils;

import cn.hutool.core.util.ReflectUtil;
import com.faber.core.annotation.FaPropIgnore;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class FaReflectUtil {

    public static String[] getPropIgnoreFields(Class<?> beanClass) {
        Field[] fields = ReflectUtil.getFields(beanClass, field -> {
            FaPropIgnore anno = field.getAnnotation(FaPropIgnore.class);
            return anno != null;
        });
        List<String> ss = Arrays.stream(fields).map(Field::getName).collect(Collectors.toList());
        return ss.toArray(new String[fields.length]);
    }

}
