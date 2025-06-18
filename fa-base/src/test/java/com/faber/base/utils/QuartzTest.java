package com.faber.base.utils;

import cn.hutool.core.date.DateUtil;
import org.junit.jupiter.api.Test;
import org.quartz.CronExpression;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * quartz测试
 */
public class QuartzTest {

    /**
     * 获取quartz下次执行时间
     * @throws ParseException
     */
    @Test
    public void testGetNextFireTime() throws ParseException {
        CronExpression cronExpression = new CronExpression("0/10 * * * * ?");
        Date nextDate = cronExpression.getNextValidTimeAfter(new Date());
        System.out.println(DateUtil.formatDateTime(nextDate));
    }

    @Test
    public void testGetNextFireTimes() throws ParseException {
        CronExpression cronExpression = new CronExpression("0/10 * * * * ?");
        List<String> nextFireTimes = new ArrayList<>();
        Date date = new Date();
        for (int i = 0; i < 10; i++) {
            date = cronExpression.getNextValidTimeAfter(date);
            nextFireTimes.add(DateUtil.formatDateTime(date));
        }
        nextFireTimes.forEach(System.out::println);
    }

}
