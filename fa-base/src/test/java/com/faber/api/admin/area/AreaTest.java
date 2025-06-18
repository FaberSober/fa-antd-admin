package com.faber.api.admin.area;

import com.faber.FaTestApp;
import com.faber.api.base.admin.biz.AreaBiz;
import com.faber.api.base.admin.entity.Area;
import com.faber.api.base.admin.enums.AreaLevelEnum;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


import java.math.BigDecimal;
import java.util.List;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = {FaTestApp.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
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

    @Test
    public void testFindAreaByLoc() {
        Area area = areaBiz.findAreaByLoc(new BigDecimal("0"), new BigDecimal("0"));
        System.out.println(area);
    }

}
