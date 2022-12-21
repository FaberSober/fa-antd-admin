package com.faber.utils;

import cn.hutool.core.lang.UUID;
import org.junit.Test;

public class UtilsTest {

    @Test
    public void testUuid() {
        System.out.println(UUID.randomUUID().toString(true));
        System.out.println(UUID.randomUUID().toString(true));
        System.out.println(UUID.randomUUID().toString(true));
    }

}
