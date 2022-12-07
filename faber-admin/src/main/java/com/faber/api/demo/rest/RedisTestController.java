package com.faber.api.demo.rest;

import com.faber.api.demo.biz.RedisTestBiz;
import com.faber.core.config.annotation.Permission;
import com.faber.core.utils.BaseResHandler;
import com.faber.core.vo.msg.Ret;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

/**
 * Redis测试api
 */
@RestController
@RequestMapping("/api/demo/authTest")
public class RedisTestController extends BaseResHandler {

    @Resource
    private RedisTestBiz redisTestBiz;

    /**
     * 添加缓存
     */
    @RequestMapping(value = "/addCache", method = RequestMethod.GET)
    @ResponseBody
    public Ret<String> addCache(@RequestParam("key") String key, @RequestParam("value") String value) {
        redisTestBiz.addCache(key, value);
        return ok();
    }

    /**
     * 获取缓存
     */
    @RequestMapping(value = "/getCache", method = RequestMethod.GET)
    @ResponseBody
    public Ret<String> getCache(@RequestParam("key") String key) {
        redisTestBiz.getCache(key);
        return ok();
    }

}
