package com.faber.base;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.faber.AdminBootstrap;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

/**
 * 需要登录的测试用例，先登录获取token
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = {AdminBootstrap.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc //need this in Spring Boot test
public class BaseLoginTest {

    protected static final String HEADER_TOKEN = "Authorization";

    @Autowired
    protected MockMvc mvc;
    protected String token;

    @Before
    public void setUp() throws Exception {
        JSONObject params = new JSONObject();
        params.put("username", "admin");
        params.put("password", "888888");

        //param传入参数
        MvcResult result = mvc.perform(
                MockMvcRequestBuilders
                        .post("/api/auth/jwt/token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(params.toJSONString())
        ).andReturn();
        MockHttpServletResponse response = result.getResponse();
        String content = response.getContentAsString();
        JSONObject json = JSON.parseObject(content);
        this.token = json.getString("data");
    }

    protected JSONObject getRetJson(MockHttpServletResponse response) throws Exception {
        String content = response.getContentAsString();
        return JSON.parseObject(content);
    }

}
