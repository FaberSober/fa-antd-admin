package com.faber.base.utils;

import cn.hutool.core.annotation.AnnotationUtil;
import cn.hutool.core.lang.Filter;
import cn.hutool.core.util.ReflectUtil;
import com.faber.api.base.admin.entity.User;
import com.faber.core.annotation.FaPropIgnore;
import com.faber.core.bean.BaseDelEntity;
import com.faber.core.utils.FaReflectUtil;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;

public class ReflectUtilTest {

    @Test
    public void testHasField() throws NoSuchFieldException {
        System.out.println("name: " + ReflectUtil.hasField(User.class, "name"));
        System.out.println("delState: " + ReflectUtil.hasField(User.class, "delState"));
        System.out.println("updTime: " + ReflectUtil.hasField(User.class, "updTime"));
        System.out.println("crtTime: " + ReflectUtil.hasField(User.class, "crtTime"));

        System.out.println(ReflectUtil.getField(User.class, "name"));
        System.out.println(ReflectUtil.getField(User.class, "delState"));

        System.out.println(User.class.getDeclaredField("name"));
        System.out.println(User.class.getDeclaredField("delState"));
    }

    @Test
    public void testGetFaPropIgnoreCols() {
        Field[] fields = ReflectUtil.getFields(Foo.class, field -> {
            FaPropIgnore anno = field.getAnnotation(FaPropIgnore.class);
            return anno != null;
        });
        System.out.println(fields);

        String[] ss = FaReflectUtil.getPropIgnoreFields(Foo.class);
        System.out.println(ss);
    }

    public static class Foo extends BaseDelEntity {

        private Long id;

        @FaPropIgnore
        private String name;

    }

}
