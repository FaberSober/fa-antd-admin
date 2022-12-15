package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.DictBiz;
import com.faber.api.base.admin.entity.Dict;
import com.faber.core.vo.DictOption;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseTreeController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.Serializable;
import java.util.List;

@Controller
@RequestMapping("/api/base/admin/dict")
public class DictController extends BaseTreeController<DictBiz, Dict, Integer> {

    /**
     * 指定code查找字典
     * @param code
     * @return
     */
    @RequestMapping(value = "getByCode", method = RequestMethod.GET)
    @ResponseBody
    public Ret<Dict> getByCode(@RequestParam("code") String code) {
        Dict data = baseBiz.getByCode(code);
        return ok(data);
    }

    /**
     * 根据枚举Class名称获取枚举值options
     * @param enumName ProjectStatusEnum
     * @return
     */
    @RequestMapping(value = "listEnum", method = RequestMethod.GET)
    @ResponseBody
    public Ret<List<DictOption<Serializable>>> listEnum(String enumName) {
        List<DictOption<Serializable>> list = baseBiz.listEnum(enumName);
        return ok(list);
    }

}
