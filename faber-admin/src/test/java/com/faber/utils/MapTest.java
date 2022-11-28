package com.faber.utils;

import com.faber.common.utils.AMapUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Map;

@RunWith(SpringRunner.class)
@SpringBootTest
public class MapTest {

    @Autowired
    private AMapUtils aMapUtils;

    @Test
    public void testParseLocation() {
        String ip = "157.0.28.182";
        Map<String, Object> map = aMapUtils.getLocByIp(ip);
        System.out.println(map);
    }

}
