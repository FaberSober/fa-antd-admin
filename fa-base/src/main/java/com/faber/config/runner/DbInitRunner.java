package com.faber.config.runner;

import com.faber.api.base.admin.biz.SystemUpdateLogBiz;
import com.faber.core.constant.FaSetting;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import jakarta.annotation.Resource;

/**
 * 启动执行器：应用启动后，执行数据库建表SQL
 * @author xu.pengfei
 * @create 2023/02/20
 */
@Order(value=1)
@Slf4j
@Configuration
public class DbInitRunner implements CommandLineRunner {

    @Resource
    SystemUpdateLogBiz systemUpdateLogBiz;

    @Resource
    FaSetting faSetting;

    @Override
    public void run(String... args) throws Exception {
        if (!faSetting.getConfig().getStartDbInitOnBoot()) {
            log.warn("------------ 系统设置开机启动不执行：执行数据库建表SQL ------------");
            return;
        }

        log.info("------------ 系统设置开机启动执行：执行数据库建表SQL BEGIN ------------>>>");
        systemUpdateLogBiz.initDb();
        log.info("------------ 系统设置开机启动执行：执行数据库建表SQL END ------------>>>");
    }

}
