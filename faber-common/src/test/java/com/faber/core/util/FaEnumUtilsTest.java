package com.faber.core.util;

import com.faber.core.enums.FileSaveDriveEnum;
import com.faber.core.utils.FaEnumUtils;
import com.faber.core.vo.DictOption;
import org.junit.Test;

import java.util.List;

public class FaEnumUtilsTest {

    @Test
    public void testEnumToOptions() {
        List<DictOption<Integer>> options = FaEnumUtils.toOptions(FileSaveDriveEnum.class);
        System.out.println(options.toString());
    }

}
