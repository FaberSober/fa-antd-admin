package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.DictTypeBiz;
import com.faber.api.base.admin.entity.DictType;
import com.faber.api.base.admin.vo.ret.SystemConfigPo;
import com.faber.core.config.annotation.IgnoreUserToken;
import com.faber.core.vo.DictOption;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseTreeController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/api/base/admin/dictType")
public class DictTypeController extends BaseTreeController<DictTypeBiz, DictType, Integer> {

    /**
     * 指定code查找字典
     * @param code
     * @return
     */
    @RequestMapping(value = "getByCode", method = RequestMethod.GET)
    @ResponseBody
    public Ret<DictType> getByCode(@RequestParam("code") String code) {
        DictType data = baseBiz.getByCode(code);
        return ok(data);
    }

    /**
     * 根据枚举Class名称获取枚举值options
     * @param enumName ProjectStatusEnum
     * @return
     */
    @RequestMapping(value = "listEnum", method = RequestMethod.GET)
    @ResponseBody
    public Ret<List<DictOption>> listEnum(String enumName) {
        List<DictOption> list = baseBiz.listEnum(enumName);
        return ok(list);
    }


    /**
     * 获取系统配置参数
     */
    @RequestMapping(value = "getSystemConfig", method = RequestMethod.GET)
    @ResponseBody
    @IgnoreUserToken
    public Ret<SystemConfigPo> getSystemConfig() {
        SystemConfigPo data = baseBiz.getSystemConfig();
        return ok(data);
    }

}
