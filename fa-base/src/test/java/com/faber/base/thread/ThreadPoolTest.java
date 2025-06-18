package com.faber.base.thread;

import com.faber.FaTestApp;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executor;
import java.util.concurrent.TimeUnit;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = {FaTestApp.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ThreadPoolTest {

    protected final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private Executor executor;

    @Test
    public void completeWork() {
        int threads = 100;
        List<Boolean> list = new ArrayList<>(threads);
        CountDownLatch countDownLatch = new CountDownLatch(threads);
        for (int i = 0; i < threads; i++) {
            executor.execute(() -> {
                boolean b = buildHouse();
                list.add(b);
                countDownLatch.countDown();
            });
        }

        try {
            Thread.sleep(10 * 1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        try {
            countDownLatch.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        for (int i = 0; i < list.size(); i++) {
            log.debug("执行结果{}:{}", i, list.get(i));
        }
    }

    public boolean buildHouse() {
        log.debug("开始盖房子，当前线程：{}", Thread.currentThread().getName());
        try {
            int i = 2000;
            Thread.sleep(i);
            log.debug("结束盖房子，当前线程：{},耗时：{}ms", Thread.currentThread().getName(), i);
            return true;
        } catch (InterruptedException e) {
            log.debug("结束盖房子，当前线程：{}", Thread.currentThread().getName());
            return false;
        }
    }

}
