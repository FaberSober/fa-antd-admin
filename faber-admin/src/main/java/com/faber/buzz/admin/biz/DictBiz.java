package com.faber.buzz.admin.biz;

import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.ClassLoaderUtil;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.faber.buzz.admin.entity.Dict;
import com.faber.buzz.admin.entity.DictType;
import com.faber.buzz.admin.mapper.DictMapper;
import com.faber.buzz.admin.vo.SystemConfigPo;
import com.faber.core.web.biz.BaseBiz;
import com.faber.buzz.admin.enums.DictTypeCodeEnum;
import com.faber.core.exception.BuzzException;
import com.faber.core.utils.FaEnumUtils;
import com.faber.core.vo.msg.TableRet;
import com.faber.core.vo.DictOption;
import com.faber.core.vo.query.QueryParams;
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
    protected void preProcessQuery(QueryParams query) {
        // 字典分组级联查询
        Map<String, Object> queryMap = query.getQueryMap();
        if (queryMap.containsKey("type")) {
            Integer type  = Integer.parseInt(queryMap.get("type").toString());

            List<DictType> dctTypeList = dictTypeBiz.findAllChildren(type);
            List<Integer> dctTypeIdList = dctTypeList.stream().map(DictType::getId).collect(Collectors.toList());
            queryMap.put("type#$in", dctTypeIdList);

            queryMap.remove("type");
        }
    }

    @Override
    public TableRet<Dict> selectPageByQuery(QueryParams query) {
        TableRet<Dict> tableRet = super.selectPageByQuery(query);
        tableRet.getData().getRows().forEach(element -> {
            element.setDictType(dictTypeBiz.getById(element.getType()));
        });
        return tableRet;
    }

    public List<Dict> getByTypeCode(String dictTypeCode) {
        return baseMapper.selectByTypeCode(dictTypeCode);
    }

    public List<DictOption> getByCode(DictTypeCodeEnum codeEnum) {
        List<Dict> dictList = baseMapper.selectByTypeCode(codeEnum.getValue());
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

    public List<DictOption> listEnum(String enumName) {
        // FIXME: 直接指定enum的名字，不指定前缀包名
        String classPath = "com.faber.common.enums." + enumName;
        Class<?> clazz = ClassLoaderUtil.loadClass(classPath);
        return FaEnumUtils.toOptions((Class<? extends IEnum>) clazz);
    }

}
