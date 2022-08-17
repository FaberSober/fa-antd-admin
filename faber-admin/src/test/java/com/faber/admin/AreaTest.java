package com.faber.admin;

import com.faber.AdminBootstrap;
import com.faber.admin.biz.AreaBiz;
import com.faber.admin.entity.Area;
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
        List<Area> list = areaBiz.findDeepestArea(loc, 1);
        for (Area area : list) {
            System.out.println(area);
        }
    }

}
