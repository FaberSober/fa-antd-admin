package com.faber.admin.biz;

import cn.hutool.core.map.MapUtil;
import com.faber.admin.entity.Dict;
import com.faber.admin.entity.DictType;
import com.faber.admin.mapper.DictMapper;
import com.faber.admin.vo.SystemConfigPo;
import com.faber.common.biz.BaseBiz;
import com.faber.common.exception.BuzzException;
import com.faber.common.msg.TableResultResponse;
import com.faber.common.util.Query;
import com.faber.common.vo.DictOption;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 字典值
 */
@Service
public class DictBiz extends BaseBiz<DictMapper, Dict> {

    @Resource
    @Lazy
    private DictTypeBiz dictTypeBiz;

    @Override
    protected void preProcessQuery(Query query) {
        // 字典分组级联查询
        if (query.containsKey("type")) {
            Integer type  = Integer.parseInt(query.get("type").toString());

            List<DictType> dctTypeList = dictTypeBiz.findAllChildren(type);
            List<Integer> dctTypeIdList = dctTypeList.stream().map(DictType::getId).collect(Collectors.toList());
            query.put("type#$in", dctTypeIdList);

            query.remove("type");
        }
    }

    @Override
    public TableResultResponse<Dict> selectPageByQuery(Query query) {
        TableResultResponse<Dict> tableResultResponse = super.selectPageByQuery(query);
        tableResultResponse.getData().getRows().forEach(element -> {
            element.setDictType(dictTypeBiz.getById(element.getType()));
        });
        return tableResultResponse;
    }

    public List<Dict> getByTypeCode(String dictTypeCode) {
        return baseMapper.selectByTypeCode(dictTypeCode);
    }

    public List<DictOption> getByCode(String code) {
        List<Dict> dictList = baseMapper.selectByTypeCode(code);
        List<DictOption> options = new ArrayList<>();
        dictList.forEach(d -> {
            options.add(new DictOption(d.getValue(), d.getText(), d.getColor(), d.getSort()));
        });
        return options;
    }

    public List<Dict> getByCodeAndText(String dictTypeCode, String dictText) {
        return baseMapper.getByCodeAndText(dictTypeCode, dictText);
    }

    public List<Dict> getByCodeAndValue(String dictTypeCode, String dictValue) {
        return baseMapper.getByCodeAndValue(dictTypeCode, dictValue);
    }


    /**
     * @param dictTypeCode {@link DictType#getCode()}
     * @param text         {@link Dict#getText()}
     * @return
     */
    public Dict getByTypeAndText(String dictTypeCode, String text) {
        List<Dict> list = baseMapper.getByCodeAndText(dictTypeCode, text);
        if (list == null || list.isEmpty()) {
            throw new BuzzException("No Dict Data Found");
        }
        if (list.size() > 1) {
            _logger.error("Dict has 2 same value {}", text);
        }
        return list.get(0);
    }

    public List<Dict> getByDictTypeId(Integer dictTypeId) {
        return lambdaQuery().eq(Dict::getType, dictTypeId).list();
    }

    /**
     * 获取系统参数配置
     * @return
     */
    public SystemConfigPo getSystemConfig() {
        DictType dictType = dictTypeBiz.lambdaQuery().eq(DictType::getCode, "system").one();

        List<Dict> dictList = lambdaQuery().eq(Dict::getType, dictType.getId()).list();

        Map<String, Object> map = new HashMap<>();
        for (Dict dict : dictList) {
            map.put(dict.getText(), dict.getValue());
        }

        SystemConfigPo po = new SystemConfigPo();
        // 系统服务配置
        po.setTitle(MapUtil.getStr(map, "system:title"));
        po.setLogo(MapUtil.getStr(map, "system:logo"));
        po.setLogoWithText(MapUtil.getStr(map, "system:portal:logoWithText"));
        po.setPortalLink(MapUtil.getStr(map, "system:portal:link"));
        return po;
    }

}
