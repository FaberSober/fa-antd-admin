package com.faber.core.util;

import com.faber.core.enums.SexEnum;
import com.faber.core.utils.FaEnumUtils;
import com.faber.core.vo.utils.DictOption;
import org.junit.jupiter.api.Test;

import java.util.List;

public class FaEnumUtilsTest {

    @Test
    public void testEnumToOptions() {
        List<DictOption<Integer>> options = FaEnumUtils.toOptions(SexEnum.class);
        System.out.println(options.toString());
    }

    @Test
    public void testEnumToOptions2() {
        FaEnumUtils.toOptions(SexEnum.class);
    }

    @Test
    public void testTransValueToEnum() {
        System.out.println(FaEnumUtils.transValueToEnum(SexEnum.class, 0));
        System.out.println(FaEnumUtils.transValueToEnum(SexEnum.class, 1));
        System.out.println(FaEnumUtils.transValueToEnum(SexEnum.class, 2));
        System.out.println(FaEnumUtils.transValueToEnum(SexEnum.class, 3));
    }

}
