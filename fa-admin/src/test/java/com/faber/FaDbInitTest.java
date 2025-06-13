package com.faber;

import com.faber.api.base.admin.biz.SystemUpdateLogBiz;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.boot.test.context.SpringBootTest;

import jakarta.annotation.Resource;

/**
 * @author Farando
 * @date 2023/2/18 20:19
 * @description
 */
@Slf4j
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = {AdminBootstrap.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {"socketio.port=18081"})
public class FaDbInitTest {

    @Resource
    SystemUpdateLogBiz systemUpdateLogBiz;

    @Test
    public void testDbInit() {
        systemUpdateLogBiz.initDb();
    }

}
