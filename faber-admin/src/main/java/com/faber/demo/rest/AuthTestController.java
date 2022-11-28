package com.faber.demo.rest;

import com.faber.common.config.annotation.Permission;
import com.faber.common.vo.msg.ObjectRestResponse;
import com.faber.common.utils.BaseResHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/demo/authTest")
public class AuthTestController extends BaseResHandler {

    /**
     * 测试权限1
     */
    @RequestMapping(value = "/test1", method = RequestMethod.GET)
    @ResponseBody
    @Permission(permission = "/admin/home/home/authTest@button1")
    public ObjectRestResponse<String> test1() {
        return ok("success");
    }

    /**
     * 测试权限2
     */
    @RequestMapping(value = "/test2", method = RequestMethod.GET)
    @ResponseBody
    @Permission(permission = "/admin/home/home/authTest@button2")
    public ObjectRestResponse<String> test2() {
        return ok("success");
    }

}