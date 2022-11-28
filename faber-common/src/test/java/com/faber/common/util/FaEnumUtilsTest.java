package com.faber.common.util;

import com.faber.common.enums.DelStateEnum;
import com.faber.common.utils.FaEnumUtils;
import com.faber.common.vo.DictOption;
import org.junit.Test;

import java.util.List;

public class FaEnumUtilsTest {

    @Test
    public void testEnumToOptions() {
        List<DictOption> options = FaEnumUtils.toOptions(DelStateEnum.class);
        System.out.println(options.toString());
    }

}
