package com.faber.admin.config.quartz.customer;

import cn.hutool.core.util.RandomUtil;
import com.faber.admin.config.quartz.BaseJob;
import lombok.extern.slf4j.Slf4j;

/**
 * 定时任务DEMO
 */
@Slf4j
public class JobDemo1 extends BaseJob {

    protected void run() {
        try {
            Thread.sleep(RandomUtil.randomInt(10));
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        if (RandomUtil.randomInt(100) > 50) {
            throw new RuntimeException("定时任务DEMO测试抛出异常信息");
        }
        log.info("{}：执行完毕=======================", this.getClass().getSimpleName());
    }

}
