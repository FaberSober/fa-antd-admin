package com.faber.api.base.demo.rest;

import com.faber.core.config.annotation.Permission;
import com.faber.core.vo.msg.Ret;
import com.faber.core.utils.BaseResHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/base/demo/authTest")
public class AuthTestController extends BaseResHandler {

    /**
     * 测试权限1
     */
    @RequestMapping(value = "/test1", method = RequestMethod.GET)
    @ResponseBody
    @Permission(permission = "/admin/home/home/authTest@button1")
    public Ret<String> test1() {
        return ok("success");
    }

    /**
     * 测试权限2
     */
    @RequestMapping(value = "/test2", method = RequestMethod.GET)
    @ResponseBody
    @Permission(permission = "/admin/home/home/authTest@button2")
    public Ret<String> test2() {
        return ok("success");
    }

}