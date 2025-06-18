package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.ConfigSceneBiz;
import com.faber.api.base.admin.entity.ConfigScene;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FaLogBiz("场景配置")
@RestController
@RequestMapping("/api/base/admin/configScene")
public class ConfigSceneController extends BaseController<ConfigSceneBiz, ConfigScene, Integer> {

    @FaLogOpr("获取所有")
    @RequestMapping(value = "/findAllScene", method = RequestMethod.GET)
    @ResponseBody
    public Ret<List<ConfigScene>> findAllScene(@RequestParam("biz") String biz) {
        List<ConfigScene> list = baseBiz.findAllScene(biz);
        return ok(list);
    }

    @FaLogOpr("查询")
    @RequestMapping(value = "/findByScene", method = RequestMethod.GET)
    @ResponseBody
    public Ret<ConfigScene> findByScene(@RequestParam("biz") String biz) {
        ConfigScene configScene = baseBiz.findByScene(biz);
        return ok(configScene);
    }

    @FaLogOpr(value = "批量更新", crud = LogCrudEnum.U)
    @RequestMapping(value = "/batchUpdate", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> batchUpdate(@RequestBody List<ConfigScene> configSceneList) {
        baseBiz.batchUpdate(configSceneList);
        return ok();
    }

}