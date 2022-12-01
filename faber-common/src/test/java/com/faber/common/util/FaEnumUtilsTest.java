package com.faber.common.util;

import com.faber.core.enums.BoolEnum;
import com.faber.core.utils.FaEnumUtils;
import com.faber.core.vo.DictOption;
import org.junit.Test;

import java.util.List;

public class FaEnumUtilsTest {

    @Test
    public void testEnumToOptions() {
        List<DictOption> options = FaEnumUtils.toOptions(BoolEnum.class);
        System.out.println(options.toString());
    }

}
