package com.faber.core;

import cn.hutool.core.util.ClassUtil;
import com.faber.core.annotation.FaJob;
import org.junit.Test;

import java.util.Set;

public class JobTest {

    @Test
    public void testScanJobs() {
        Set<Class<?>> clazzList = ClassUtil.scanPackageByAnnotation("com.faber", FaJob.class);
        for (Class<?> clazz : clazzList) {
            System.out.println(clazz.getName());;

            FaJob anno = clazz.getAnnotation(FaJob.class);
            System.out.println(anno.value());
        }
    }

}
