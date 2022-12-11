package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.ConfigSceneBiz;
import com.faber.api.base.admin.entity.ConfigScene;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/base/admin/configScene")
public class ConfigSceneController extends BaseController<ConfigSceneBiz, ConfigScene, Integer> {

    /**
     * 查找所有场景配置
     */
    @RequestMapping(value = "/findAllScene", method = RequestMethod.GET)
    @ResponseBody
    public Ret<List<ConfigScene>> findAllScene(@RequestParam("biz") String biz) {
        List<ConfigScene> list = baseBiz.findAllScene(biz);
        return new Ret<List<ConfigScene>>().data(list);
    }

    /**
     * 查找场景配置
     */
    @RequestMapping(value = "/findByScene", method = RequestMethod.GET)
    @ResponseBody
    public Ret<ConfigScene> findByScene(@RequestParam("biz") String biz) {
        ConfigScene configScene = baseBiz.findByScene(biz);
        return new Ret<ConfigScene>().data(configScene);
    }

    /**
     * 批量更新场景配置-更新排序
     *
     * @param configSceneList
     * @return
     */
    @RequestMapping(value = "/batchUpdate", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> batchUpdate(@RequestBody List<ConfigScene> configSceneList) {
        baseBiz.batchUpdate(configSceneList);
        return ok();
    }

}