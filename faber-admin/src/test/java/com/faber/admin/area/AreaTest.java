package com.faber.admin.area;

import com.faber.AdminBootstrap;
import com.faber.buzz.admin.biz.AreaBiz;
import com.faber.buzz.admin.entity.Area;
import com.faber.buzz.admin.enums.AreaLevelEnum;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {AdminBootstrap.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AreaTest {

    @Autowired
    private AreaBiz areaBiz;

    @Test
    public void testParseLocation() {
        String loc = "淮安市淮安区车桥镇车东村";
        List<Area> list = areaBiz.findDeepestArea(loc, AreaLevelEnum.CITY);
        for (Area area : list) {
            System.out.println(area);
        }
    }

}
