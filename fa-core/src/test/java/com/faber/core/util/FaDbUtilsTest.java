package com.faber.core.util;

import com.faber.core.utils.FaDbUtils;
import org.junit.jupiter.api.Test;

/**
 * @author Farando
 * @date 2023/2/19 20:48
 * @description
 */
public class FaDbUtilsTest {

    @Test
    public void testGetNameFromUrl() {
        System.out.println(FaDbUtils.getNameFromUrl("jdbc:mysql://127.0.0.1:3306/test?useUnicode=true&characterEncoding=UTF8&serverTimezone=GMT%2B8&useSSL=false"));
        System.out.println(FaDbUtils.getNameFromUrl("jdbc:mysql://127.0.0.1:3306/test"));
    }

}
