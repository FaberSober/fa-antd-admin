package com.faber.buzz.admin.rest;

import com.faber.buzz.admin.biz.ConfigBiz;
import com.faber.buzz.admin.entity.Config;
import com.faber.common.vo.msg.Ret;
import com.faber.common.web.rest.BaseController;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/config")
public class ConfigController extends BaseController<ConfigBiz, Config, Integer> {

    /**
     * 查找所有场景配置
     *
     * @param params
     * @return
     */
    @RequestMapping(value = "/findAllScene", method = RequestMethod.GET)
    @ResponseBody
    public Ret<List<Config>> findAllScene(@RequestParam Map<String, Object> params) {
        List<Config> list = baseBiz.findAllScene(params);
        return new Ret<List<Config>>().data(list);
    }

    /**
     * 查找场景配置
     *
     * @param params
     * @return
     */
    @RequestMapping(value = "/findByScene", method = RequestMethod.GET)
    @ResponseBody
    public Ret<Config> findByScene(@RequestParam Map<String, Object> params) {
        Config config = baseBiz.findByScene(params);
        return new Ret<Config>().data(config);
    }

    /**
     * 批量更新场景配置-更新排序
     *
     * @param configList
     * @return
     */
    @RequestMapping(value = "/batchUpdate", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> batchUpdate(@RequestBody List<Config> configList) {
        baseBiz.batchUpdate(configList);
        return ok();
    }

}