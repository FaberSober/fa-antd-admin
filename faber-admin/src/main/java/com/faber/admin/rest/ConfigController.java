package com.faber.admin.rest;

import com.faber.admin.biz.ConfigBiz;
import com.faber.admin.entity.Config;
import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.rest.BaseController;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/config")
public class ConfigController extends BaseController<ConfigBiz, Config> {

    /**
     * 查找所有场景配置
     *
     * @param params
     * @return
     */
    @RequestMapping(value = "/findAllScene", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<List<Config>> findAllScene(@RequestParam Map<String, Object> params) {
        List<Config> list = baseBiz.findAllScene(params);
        return new ObjectRestResponse<List<Config>>().data(list);
    }

    /**
     * 查找场景配置
     *
     * @param params
     * @return
     */
    @RequestMapping(value = "/findByScene", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<Config> findByScene(@RequestParam Map<String, Object> params) {
        Config config = baseBiz.findByScene(params);
        return new ObjectRestResponse<Config>().data(config);
    }

    /**
     * 批量更新场景配置-更新排序
     *
     * @param configList
     * @return
     */
    @RequestMapping(value = "/batchUpdate", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse batchUpdate(@RequestBody List<Config> configList) {
        baseBiz.batchUpdate(configList);
        return ok();
    }

}