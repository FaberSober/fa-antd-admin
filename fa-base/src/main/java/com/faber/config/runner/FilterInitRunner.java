package com.faber.config.runner;

import cn.hutool.core.annotation.AnnotationUtil;
import cn.hutool.core.lang.reflect.MethodHandleUtil;
import cn.hutool.core.util.ClassUtil;
import com.faber.config.filter.RequestAgainFilter;
import com.faber.core.config.annotation.NoFilter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Arrays;

/**
 * 启动执行器：应用启动后，
 *
 * @author xu.pengfei
 * @create 2024/08/27
 */
@Order(value = 1)
@Slf4j
@Configuration
public class FilterInitRunner implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        log.info("------------ 过滤器配置 BEGIN ------------>>>");
        ClassUtil.scanPackageByAnnotation("com.faber", NoFilter.class).forEach(i -> {
            Arrays.stream(i.getDeclaredMethods()).forEach(method -> {
                if (AnnotationUtil.hasAnnotation(method, NoFilter.class)) {
                    log.info("跳过重复过滤器：{}", method.toString());
                    RequestMapping restMapping = i.getAnnotation(RequestMapping.class);
                    if (restMapping == null) {
                        log.error("Controller need @RequestMapping");
                        return;
                    }
                    String apiPrefix = restMapping.value()[0];

                    RequestMapping rm = method.getAnnotation(RequestMapping.class);
                    GetMapping gm = method.getAnnotation(GetMapping.class);
                    PostMapping pm = method.getAnnotation(PostMapping.class);

                    String apiPath = rm != null ? rm.value()[0] : gm != null ? gm.value()[0] : pm != null ? pm.value()[0] : "";
                    String apiUrl = apiPrefix + apiPath;
                    RequestAgainFilter.addSkipUrl(apiUrl);
                }
            });
        });
        log.info("------------ 过滤器配置 END ------------>>>");
    }

}
