package com.faber.config.quartz.customer;

import cn.hutool.core.util.RandomUtil;
import com.faber.config.quartz.BaseJob;
import com.faber.core.annotation.FaJob;
import lombok.extern.slf4j.Slf4j;

/**
 * 定时任务DEMO
 * @author xu.pengfei
 * @date 2022/11/28 13:41
 */
@Slf4j
@FaJob("定时任务DEMO")
public class JobDemo1 extends BaseJob {

    @Override
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
