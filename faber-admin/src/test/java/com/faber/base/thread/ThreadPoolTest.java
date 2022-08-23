package com.faber.base.thread;

import com.faber.AdminBootstrap;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executor;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {AdminBootstrap.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ThreadPoolTest {

    protected final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private Executor executor;

    @Test
    public void completeWork() {
        int threads = 10;
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
        list.forEach(x -> {
            log.debug("执行结果:{}", x);
        });

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
