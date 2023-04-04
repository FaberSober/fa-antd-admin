package com.faber;

import com.faber.api.base.admin.biz.SystemUpdateLogBiz;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;

/**
 * @author Farando
 * @date 2023/2/18 20:19
 * @description
 */
@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest(classes = {AdminBootstrap.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {"socketio.port=18081"})
public class FaDbInitTest {

    @Resource
    SystemUpdateLogBiz systemUpdateLogBiz;

    @Test
    public void testDbInit() {
        systemUpdateLogBiz.initDb();
    }

}
