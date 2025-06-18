package com.faber.base.thread;

import cn.hutool.core.thread.ThreadUtil;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

@Slf4j
public class ThreadTest {


    @Test
    public void test1() {
        CountDownLatch latch = new CountDownLatch(1);
        ThreadUtil.execAsync(() -> {
            try {
                log.debug("worker start");
                Thread.sleep(3000);
                latch.countDown();
                log.debug("worker end");
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        });

        try {
            log.debug("begin");
            boolean ret = latch.await(1000, TimeUnit.MILLISECONDS);
            log.debug("finish ret = " + ret);
        } catch (InterruptedException e) {
            e.printStackTrace();
            log.debug("error: " + e.getMessage());
        }
        log.debug("end");
    }

}
