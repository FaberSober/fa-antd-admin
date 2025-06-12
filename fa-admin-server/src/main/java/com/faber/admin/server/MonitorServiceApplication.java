package com.faber.admin.server;

import de.codecentric.boot.admin.server.config.AdminServerProperties;
import de.codecentric.boot.admin.server.config.EnableAdminServer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

@SpringBootApplication
@EnableAdminServer
public class MonitorServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MonitorServiceApplication.class, args);
    }

//    @Configuration
//    public static class SecuritySecureConfig extends WebSecurityConfigurerAdapter {
//        private final String adminContextPath;
//
//        public SecuritySecureConfig(AdminServerProperties adminServerProperties) {
//            this.adminContextPath = adminServerProperties.getContextPath();
//        }
//
//        @Override
//        protected void configure(HttpSecurity http) throws Exception {
//            // @formatter:off
//            SavedRequestAwareAuthenticationSuccessHandler successHandler = new SavedRequestAwareAuthenticationSuccessHandler();
//            successHandler.setTargetUrlParameter("redirectTo");
//            successHandler.setDefaultTargetUrl(adminContextPath + "/");
//
//            http.authorizeRequests()
//                    .antMatchers(adminContextPath + "/assets/**").permitAll()//Grants public access to all static assets and the login page.
//                    .antMatchers(adminContextPath + "/login").permitAll()
//                    .anyRequest().authenticated()//	Every other request must be authenticated.
//                    .and()
//                    .formLogin().loginPage(adminContextPath + "/login").successHandler(successHandler).and()//Configures login and logout.
//                    .logout().logoutUrl(adminContextPath + "/logout").and()
//                    .httpBasic().and()//Enables HTTP-Basic support. This is needed for the Spring Boot Admin Client to register.
//                    .csrf()
//                    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())//	Enables CSRF-Protection using Cookies
//                    .ignoringAntMatchers(
//                            adminContextPath + "/instances",//	Disables CRSF-Protection the endpoint the Spring Boot Admin Client uses to register.
//                            adminContextPath + "/actuator/**"//Disables CRSF-Protection for the actuator endpoints.
//                    );
//        }
//    }
}


