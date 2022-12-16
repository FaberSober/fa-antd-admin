package com.faber.core;

import com.faber.AdminBootstrap;
import com.faber.core.service.IpService;
import com.faber.core.vo.IpAddr;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;
import java.util.Map;

/**
 * @author xupengfei
 * @email faberxu@gmail.com
 * @date 2022/12/16 10:31
 */
@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest(classes = {AdminBootstrap.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class IpServiceTest {

    @Resource
    IpService ipService;

    @Test
    public void testIpAddr() {
        IpAddr map = ipService.ipJson("127.0.0.1");
//        IpAddr map = ipService.ipJson("localhost");
        log.info("map: {}", map);
    }

}
