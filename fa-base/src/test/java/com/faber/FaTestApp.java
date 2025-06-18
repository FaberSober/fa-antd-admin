package com.faber;

//import com.alicp.jetcache.anno.config.EnableMethodCache;
import com.dtflys.forest.springboot.annotation.ForestScan;
//import com.yomahub.tlog.core.enhance.bytes.AspectLogEnhance;
import org.dromara.x.file.storage.spring.EnableFileStorage;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.server.ConfigurableWebServerFactory;
import org.springframework.boot.web.server.ErrorPage;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
@EnableScheduling
@EnableTransactionManagement
@ServletComponentScan
//@EnableMethodCache(basePackages = "com.faber")
@ForestScan("com.faber")
@EnableFileStorage // https://spring-file-storage.xuyanwu.cn
public class FaTestApp {

//    static { AspectLogEnhance.enhance(); }//进行日志增强，自动判断日志框架

    public static void main(String[] args) {
        new SpringApplicationBuilder(FaTestApp.class).run(args);
    }

    @Bean
    public WebServerFactoryCustomizer<ConfigurableWebServerFactory> webServerFactoryCustomizer(){
        return new WebServerFactoryCustomizer<ConfigurableWebServerFactory>() {
            @Override
            public void customize(ConfigurableWebServerFactory factory) {
//                factory.setPort(8081);
                // 适配前端页面的路由，未找到的链接fallback到index.html
                ErrorPage error404Page = new ErrorPage(HttpStatus.NOT_FOUND, "/index.html");
                Set<ErrorPage> errorPages = new HashSet<>();
                errorPages.add(error404Page);
                factory.setErrorPages(errorPages);
            }
        };
    }
}
