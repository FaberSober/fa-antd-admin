package com.faber.api.core;

import com.faber.FaTestApp;
import com.faber.core.service.IpService;
import com.faber.core.vo.utils.IpAddr;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.boot.test.context.SpringBootTest;


import jakarta.annotation.Resource;

/**
 * @author xupengfei
 * @email faberxu@gmail.com
 * @date 2022/12/16 10:31
 */
@Slf4j
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = {FaTestApp.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
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
