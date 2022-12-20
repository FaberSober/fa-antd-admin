package com.faber.api.base.demo.rest;

import com.faber.api.base.demo.biz.RedisTestBiz;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.utils.BaseResHandler;
import com.faber.core.vo.msg.Ret;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@FaLogBiz("Redis测试")
@RestController
@RequestMapping("/api/base/demo/redisTest")
public class RedisTestController extends BaseResHandler {

    @Resource
    private RedisTestBiz redisTestBiz;

    @FaLogOpr("添加缓存")
    @RequestMapping(value = "/addCache", method = RequestMethod.GET)
    @ResponseBody
    public Ret<Boolean> addCache(@RequestParam("key") String key, @RequestParam("value") String value) {
        redisTestBiz.addCache(key, value);
        return ok();
    }

    @FaLogOpr("获取缓存")
    @RequestMapping(value = "/getCache", method = RequestMethod.GET)
    @ResponseBody
    public Ret<String> getCache(@RequestParam("key") String key) {
        String data = redisTestBiz.getCache(key);
        return ok(data);
    }

}
