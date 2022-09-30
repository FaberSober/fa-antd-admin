package com.faber.base.validation;

import com.alibaba.fastjson.JSONObject;
import com.faber.base.BaseLoginTest;
import lombok.extern.slf4j.Slf4j;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@Slf4j
public class SpringValidationTest extends BaseLoginTest {

    @Test
    public void testUserAddFail() throws Exception {
        JSONObject params = new JSONObject();
        params.put("id", "2");

        //param传入参数
        MvcResult result = mvc.perform(
                MockMvcRequestBuilders
                        .post("/api/admin/user/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header(HEADER_TOKEN, this.token)
                        .content(params.toJSONString())
        ).andReturn();
        MockHttpServletResponse response = result.getResponse();
        JSONObject json = this.getRetJson(response);
        String msg = json.getString("message");
        log.debug("content: {}", json);

        Assert.assertEquals(400, response.getStatus());
        Assert.assertEquals("id:must be null", msg);
    }

}
