package com.faber.base.utils;

import com.faber.FaTestApp;
import com.faber.core.utils.FaRedisUtils;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.boot.test.context.SpringBootTest;


import jakarta.annotation.Resource;
import java.util.concurrent.TimeUnit;

@Slf4j
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = {FaTestApp.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class FaRedisUtilsTest {

    @Resource
    FaRedisUtils faRedisUtils;

    @Test
    public void testSet() {
        faRedisUtils.set("foo", "bar");
    }

    @Test
    public void testSetWithExpire() {
        faRedisUtils.set("foo", "bar", 1, TimeUnit.MINUTES);
    }

    @Test
    public void testGetStr() {
        String value = faRedisUtils.getStr("foo");
        System.out.println("value: " + value);
    }

    @Test
    public void testDel() {
        faRedisUtils.set("foo", "bar");
        boolean flag = faRedisUtils.del("foo");
        System.out.println("flag: " + flag);
    }

}
