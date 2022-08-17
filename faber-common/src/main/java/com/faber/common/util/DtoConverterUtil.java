package com.faber.common.util;


import java.beans.BeanInfo;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

public class DtoConverterUtil {

    /**
     * getMapOfDtoProperty Dto转换成Map
     *
     * @param o 对象
     * @return Map<String, Object>    返回类型
     */
    public static Map<String, Object> getMapOfDtoProperty(Object o) {
        Map<String, Object> packMap = new HashMap<>(16);
        // 1.获取类属性列表
        Field[] fields = ClassExtraUtil.getFields(o);
        for (int i = 0; i < fields.length; i++) {
            // 2.获取属性名
            String field = fields[i].getName();
            // 3.根据属性名获取属性值
            Object value = ClassExtraUtil.getFieldValueByName(field, o);
            if (value != null) {
                packMap.put(field, value);
            }
        }
        return packMap;
    }


    public static Object mapToObject(Map<String, Object> map, Class<?> beanClass) throws Exception {
        if (map == null) {
            return null;
        }
        Object obj = beanClass.newInstance();

        BeanInfo beanInfo = Introspector.getBeanInfo(obj.getClass());
        PropertyDescriptor[] propertyDescriptors = beanInfo.getPropertyDescriptors();
        for (PropertyDescriptor property : propertyDescriptors) {
            Method setter = property.getWriteMethod();
            if (setter != null) {
                setter.invoke(obj, map.get(property.getName()));
            }
        }
        return obj;
    }
}