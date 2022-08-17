package com.faber.admin.rest;

import com.faber.admin.biz.DictBiz;
import com.faber.admin.config.annotation.IgnoreUserToken;
import com.faber.admin.entity.Dict;
import com.faber.admin.vo.SystemConfigPo;
import com.faber.common.exception.BuzzException;
import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.rest.BaseController;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/api/admin/dict")
public class DictController extends BaseController<DictBiz, Dict> {

    @RequestMapping(value = "listByCode", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<List<Dict>> listByCode(String dictTypeCode) {
        if (StringUtils.isBlank(dictTypeCode)) {
            return ok(new ArrayList<Dict>());
        }
        List<Dict> list = baseBiz.getByTypeCode(dictTypeCode);
        return ok(list);
    }

    @RequestMapping(value = "getByCodeAndText", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<List<Dict>> getByCodeAndText(String dictTypeCode, String dictText) {
        if (StringUtils.isBlank(dictTypeCode) ||  StringUtils.isBlank(dictText)) {
            throw new BuzzException("未找到字典数据，请检查！");
        }
        List<Dict> list = baseBiz.getByCodeAndText(dictTypeCode, dictText);
        return ok(list);
    }

    @RequestMapping(value = "getByCodeAndValue", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<List<Dict>> getByCodeAndValue(String dictTypeCode, String dictValue) {
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
    public ObjectRestResponse<SystemConfigPo> getSystemConfig() {
        SystemConfigPo data = baseBiz.getSystemConfig();
        return ok(data);
    }

}