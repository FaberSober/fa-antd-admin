package com.faber.common.util;

import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class ClassExtraUtil {

    /**
     * 根据属性名获取属性值
     *
     * @param fieldName fieldName
     * @param o         Object
     * @return Object
     */
    public static Object getFieldValueByName(String fieldName, Object o) {
        try {
            String getFun = "get" + StringExtraUtil.upperCase(fieldName);
            Method method = o.getClass().getMethod(getFun);
            return method.invoke(o);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 获取类属性列表
     *
     * @param o Object
     * @return Field[]
     */
    public static Field[] getFields(Object o) {
        //getDeclaredFields(): 获取属性列表(除了父类属性)
        Field[] fields = o.getClass().getDeclaredFields();
        // 判断是否有父类属性
        if (o.getClass().getSuperclass() != null) {
            Field[] supperFields = o.getClass().getSuperclass().getDeclaredFields();
            Field[] allFields = new Field[fields.length + supperFields.length];
            // 合并子父类属性
            System.arraycopy(fields, 0, allFields, 0, fields.length);
            System.arraycopy(supperFields, 0, allFields, fields.length, supperFields.length);
            return allFields;
        }
        return fields;
    }

    /**
     * 获取类的所有方法列表
     *
     * @param o Object
     * @return Method[]
     */
    public static Method[] getMethods(Object o) {
        return o.getClass().getDeclaredMethods();
    }

    public static void setFieldValue(Object o) {
    }
}
