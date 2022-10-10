package com.faber.utils;

import cn.hutool.core.util.ClassLoaderUtil;
import cn.hutool.core.util.ClassUtil;
import cn.hutool.core.util.ReflectUtil;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.faber.common.util.FaEnumUtils;
import com.faber.common.vo.DictOption;
import com.faber.msg.entity.Msg;
import org.junit.Test;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FaEnumTest {

    @Test
    public void testScanEntityEnumFields() {
        Map<String, List<DictOption>> map = new HashMap<>();

        Field[] fields = ReflectUtil.getFields(Msg.class, field -> IEnum.class.isAssignableFrom(field.getType()));
        for (Field field : fields) {
            map.put(field.getName(), FaEnumUtils.toOptions((Class<? extends IEnum>) field.getType()));
        }
        System.out.println(map);
    }

    @Test
    public void testGetEnumsByClassPath() {
        String classPath = "com.faber.common.enums.prj.ProjectStatusEnum";
        Class<?> clazz = ClassLoaderUtil.loadClass(classPath);
        List<DictOption> options = FaEnumUtils.toOptions((Class<? extends IEnum>) clazz);
        System.out.println(options.toString());
    }

}
