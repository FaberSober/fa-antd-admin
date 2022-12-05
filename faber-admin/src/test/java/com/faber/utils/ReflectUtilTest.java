package com.faber.utils;

import cn.hutool.core.util.ReflectUtil;
import com.faber.api.admin.entity.User;
import org.junit.Test;

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

}
