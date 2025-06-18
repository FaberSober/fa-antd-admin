package com.faber.api.admin;

import com.faber.FaTestApp;
import com.faber.api.base.admin.biz.SystemUpdateLogBiz;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.boot.test.context.SpringBootTest;


import jakarta.annotation.Resource;
import java.io.IOException;
import java.sql.SQLException;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = {FaTestApp.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class SystemUpdateLogTest {

    @Resource
    private SystemUpdateLogBiz systemUpdateLogBiz;

    @Test
    public void testInitAndUpdateDb() throws SQLException, IOException {
//        systemUpdateLogBiz.initAndUpdateDb();
    }

}
