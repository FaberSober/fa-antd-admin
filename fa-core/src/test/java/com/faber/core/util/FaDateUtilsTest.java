package com.faber.core.util;

import com.faber.core.utils.FaDateUtils;
import org.junit.jupiter.api.Test;

public class FaDateUtilsTest {

    @Test
    public void testNormalize() {
        System.out.println(FaDateUtils.normalize("2023/1/1 0:00"));
    }

}
