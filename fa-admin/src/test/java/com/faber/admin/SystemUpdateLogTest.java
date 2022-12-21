package com.faber.admin;

import com.faber.AdminBootstrap;
import com.faber.api.base.admin.biz.SystemUpdateLogBiz;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;
import java.io.IOException;
import java.sql.SQLException;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {AdminBootstrap.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class SystemUpdateLogTest {

    @Resource
    private SystemUpdateLogBiz systemUpdateLogBiz;

    @Test
    public void testInitAndUpdateDb() throws SQLException, IOException {
        systemUpdateLogBiz.initAndUpdateDb();
    }

}
