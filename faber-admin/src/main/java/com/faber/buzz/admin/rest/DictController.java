package com.faber.buzz.admin.rest;

import com.faber.buzz.admin.biz.DictBiz;
import com.faber.common.config.annotation.IgnoreUserToken;
import com.faber.buzz.admin.entity.Dict;
import com.faber.buzz.admin.vo.SystemConfigPo;
import com.faber.common.exception.BuzzException;
import com.faber.common.vo.DictOption;
import com.faber.common.vo.msg.Ret;
import com.faber.common.web.rest.BaseController;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/api/admin/dict")
public class DictController extends BaseController<DictBiz, Dict, Integer> {

    @RequestMapping(value = "listByCode", method = RequestMethod.GET)
    @ResponseBody
    public Ret<List<Dict>> listByCode(String dictTypeCode) {
        if (StringUtils.isBlank(dictTypeCode)) {
            return ok(new ArrayList<Dict>());
        }
        List<Dict> list = baseBiz.getByTypeCode(dictTypeCode);
        return ok(list);
    }

    @RequestMapping(value = "getByCodeAndText", method = RequestMethod.GET)
    @ResponseBody
    public Ret<List<Dict>> getByCodeAndText(String dictTypeCode, String dictText) {
        if (StringUtils.isBlank(dictTypeCode) ||  StringUtils.isBlank(dictText)) {
            throw new BuzzException("未找到字典数据，请检查！");
        }
        List<Dict> list = baseBiz.getByCodeAndText(dictTypeCode, dictText);
        return ok(list);
    }

    @RequestMapping(value = "getByCodeAndValue", method = RequestMethod.GET)
    @ResponseBody
    public Ret<List<Dict>> getByCodeAndValue(String dictTypeCode, String dictValue) {
        if (StringUtils.isBlank(dictTypeCode) ||  StringUtils.isBlank(dictValue)) {
            throw new BuzzException("未找到字典数据，请检查！");
        }
        List<Dict> list = baseBiz.getByCodeAndValue(dictTypeCode, dictValue);
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

    /**
     * 获取com.faber.common.enums包下的枚举值options
     * @param enumName prj.ProjectStatusEnum
     * @return
     */
    @RequestMapping(value = "listEnum", method = RequestMethod.GET)
    @ResponseBody
    public Ret<List<DictOption>> listEnum(String enumName) {
        List<DictOption> list = baseBiz.listEnum(enumName);
        return ok(list);
    }
}