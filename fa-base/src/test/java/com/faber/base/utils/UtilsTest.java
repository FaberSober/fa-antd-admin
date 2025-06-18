package com.faber.base.utils;

import cn.hutool.core.lang.UUID;
import org.junit.jupiter.api.Test;

public class UtilsTest {

    @Test
    public void testUuid() {
        System.out.println(UUID.randomUUID().toString(true));
        System.out.println(UUID.randomUUID().toString(true));
        System.out.println(UUID.randomUUID().toString(true));
    }

}
