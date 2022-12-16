package com.faber.utils;

import cn.hutool.core.util.ClassUtil;
import cn.hutool.core.util.ReflectUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.faber.core.utils.FaEnumUtils;
import com.faber.core.vo.utils.DictOption;
import com.faber.api.base.msg.entity.Msg;
import org.junit.Test;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.*;

public class FaEnumTest {

    @Test
    public void testScanEntityEnumFields() {
        Map<String, List<DictOption<Serializable>>> map = new HashMap<>();

        Field[] fields = ReflectUtil.getFields(Msg.class, field -> IEnum.class.isAssignableFrom(field.getType()));
        for (Field field : fields) {
            map.put(field.getName(), FaEnumUtils.toOptions((Class<? extends IEnum<Serializable>>) field.getType()));
        }
        System.out.println(map);
    }

//    @Test
//    public void testGetEnumsByClassPath() {
//        String classPath = "com.faber.common.enums.prj.ProjectStatusEnum";
//        Class<?> clazz = ClassLoaderUtil.loadClass(classPath);
//        List<DictOption> options = FaEnumUtils.toOptions((Class<? extends IEnum>) clazz);
//        System.out.println(options.toString());
//    }

    @Test
    public void testGetEnumsByClassName() {
        String className = "AreaLevelEnum";
        Set<Class<?>> set = ClassUtil.scanPackage("com.faber", i -> {
            return IEnum.class.isAssignableFrom(i) && StrUtil.equals(i.getSimpleName(), className);
        });
        if (set.iterator().hasNext()) {
            List<DictOption<Integer>> options = FaEnumUtils.toOptions((Class<? extends IEnum<Integer>>) set.iterator().next());
            System.out.println(options.toString());
        }
    }

}
