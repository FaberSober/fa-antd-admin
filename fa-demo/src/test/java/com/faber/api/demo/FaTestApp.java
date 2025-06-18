package com.faber.api.demo;

import com.dtflys.forest.springboot.annotation.ForestScan;
import org.dromara.easyes.starter.register.EsMapperScan;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableScheduling
@EnableTransactionManagement
@ServletComponentScan
@EsMapperScan("com.faber.api.**.esmapper") // 不使用ES屏蔽此行代码
@ForestScan("com.faber")
public class FaTestApp {

    public static void main(String[] args) {
        new SpringApplicationBuilder(FaTestApp.class).run(args);
    }

}
