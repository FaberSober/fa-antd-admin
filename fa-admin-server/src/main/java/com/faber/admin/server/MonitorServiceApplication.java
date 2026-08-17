package com.faber.admin.server;

import de.codecentric.boot.admin.server.config.AdminServerProperties;
import de.codecentric.boot.admin.server.config.EnableAdminServer;
import jakarta.servlet.DispatcherType;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;

@SpringBootApplication
@EnableAdminServer
public class MonitorServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MonitorServiceApplication.class, args);
    }

    @Configuration(proxyBeanMethods = false)
    public static class SecuritySecureConfig {

        private final AdminServerProperties adminServer;

        public SecuritySecureConfig(AdminServerProperties adminServer) {
            this.adminServer = adminServer;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

            SavedRequestAwareAuthenticationSuccessHandler successHandler =
                    new SavedRequestAwareAuthenticationSuccessHandler();

            successHandler.setTargetUrlParameter("redirectTo");
            successHandler.setDefaultTargetUrl(adminServer.path("/"));

            PathPatternRequestMatcher.Builder matcher =
                    PathPatternRequestMatcher.withDefaults();

            http.authorizeHttpRequests(auth -> auth

                    // Spring Boot Admin 静态资源
                    .requestMatchers(
                            matcher.matcher(adminServer.path("/assets/**"))
                    ).permitAll()

                    // 登录页面
                    .requestMatchers(
                            matcher.matcher(adminServer.path("/login"))
                    ).permitAll()

                    // Admin Server 自己的 Actuator
                    .requestMatchers(
                            matcher.matcher(adminServer.path("/actuator/info")),
                            matcher.matcher(adminServer.path("/actuator/health"))
                    ).permitAll()

                    // Spring Security 异步请求
                    .dispatcherTypeMatchers(DispatcherType.ASYNC)
                    .permitAll()

                    // 其它请求必须认证
                    .anyRequest()
                    .authenticated()
            );

            // 浏览器登录
            http.formLogin(form -> form
                    .loginPage(adminServer.path("/login"))
                    .successHandler(successHandler)
                    .permitAll()
            );

            // 退出登录
            http.logout(logout -> logout
                    .logoutUrl(adminServer.path("/logout"))
            );

            // Spring Boot Admin Client 注册必须开启 HTTP Basic
            http.httpBasic(Customizer.withDefaults());

            // 让 SBA 前端能够取得 CSRF Token
            http.addFilterAfter(
                    new CustomCsrfFilter(),
                    BasicAuthenticationFilter.class
            );

            http.csrf(csrf -> csrf

                    .csrfTokenRepository(
                            CookieCsrfTokenRepository.withHttpOnlyFalse()
                    )

                    .csrfTokenRequestHandler(
                            new CsrfTokenRequestAttributeHandler()
                    )

                    .ignoringRequestMatchers(

                            // SBA Client 注册
                            matcher.matcher(
                                    HttpMethod.POST,
                                    adminServer.path("/instances")
                            ),

                            // SBA Client 注销
                            matcher.matcher(
                                    HttpMethod.DELETE,
                                    adminServer.path("/instances/*")
                            ),

                            // Admin Server 自己的 actuator
                            matcher.matcher(
                                    adminServer.path("/actuator/**")
                            )
                    )
            );

            return http.build();
        }
    }
}