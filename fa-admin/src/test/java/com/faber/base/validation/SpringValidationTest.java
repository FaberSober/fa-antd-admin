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

    private MockHttpServletResponse addUser(JSONObject params) throws Exception {
        //param传入参数
        MvcResult result = mvc.perform(
                MockMvcRequestBuilders
                        .post("/api/admin/user/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header(HEADER_TOKEN, this.token)
                        .content(params.toJSONString())
        ).andReturn();
        return result.getResponse();
    }

    @Test
    public void testUserAddFail() throws Exception {
        JSONObject params = new JSONObject();
        params.put("id", "2");

        MockHttpServletResponse response = addUser(params);
        JSONObject json = this.getRetJson(response);
        String msg = json.getString("message");
        log.debug("content: {}", json);

        Assert.assertEquals(400, response.getStatus());
        Assert.assertEquals("departmentId:must not be null; status:must not be null; tel:must not be null; name:must not be null; username:must not be null; id:must be null", msg);
    }

    @Test
    public void testUserAddSexEnumFail() throws Exception {
        JSONObject params = new JSONObject();
        params.put("departmentId", "1");
        params.put("name", "测试账户01");
        params.put("username", "test01");
        params.put("tel", "13042563001");
        params.put("status", "1");
        params.put("sex", "3");

        MockHttpServletResponse response = addUser(params);
        JSONObject json = this.getRetJson(response);
        String msg = json.getString("message");
        log.debug("content: {}", json);
    }

}
