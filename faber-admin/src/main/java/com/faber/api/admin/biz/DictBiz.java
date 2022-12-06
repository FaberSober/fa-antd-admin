package com.faber.api.admin.biz;

import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.ClassUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.faber.api.admin.entity.Dict;
import com.faber.api.admin.entity.DictType;
import com.faber.api.admin.mapper.DictMapper;
import com.faber.api.admin.vo.ret.SystemConfigPo;
import com.faber.core.exception.NoDataException;
import com.faber.core.web.biz.BaseBiz;
import com.faber.api.admin.enums.DictTypeCodeEnum;
import com.faber.core.exception.BuzzException;
import com.faber.core.utils.FaEnumUtils;
import com.faber.core.vo.msg.TableRet;
import com.faber.core.vo.DictOption;
import com.faber.core.vo.query.QueryParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 字典值
 */
@Service
public class DictBiz extends BaseBiz<DictMapper, Dict> {

    @Value("${socketio.hostName}")
    private String socketioHostName;

    @Value("${socketio.port}")
    private Integer socketioPort;

    @Resource
    @Lazy
    private DictTypeBiz dictTypeBiz;

    private static final Map<String, Object> enumClassCache = new HashMap<>();

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
        po.setSubTitle(MapUtil.getStr(map, "system:subTitle"));
        po.setLogo(MapUtil.getStr(map, "system:logo"));
        po.setLogoWithText(MapUtil.getStr(map, "system:portal:logoWithText"));
        po.setPortalLink(MapUtil.getStr(map, "system:portal:link"));
        po.setPhpRedisAdmin(MapUtil.getStr(map, "system:phpRedisAdmin"));

        // socketio
        po.setSocketUrl(socketioHostName + ":" + socketioPort);

        return po;
    }

    public List<DictOption> listEnum(String enumName) {
        Class<? extends IEnum> clazz = null;

        if (enumClassCache.containsKey(enumName)) {
            clazz = (Class<? extends IEnum>) enumClassCache.get(enumName);
            return FaEnumUtils.toOptions(clazz);
        }

        Set<Class<?>> set = ClassUtil.scanPackage("com.faber", i -> {
            return IEnum.class.isAssignableFrom(i) && StrUtil.equals(i.getSimpleName(), enumName);
        });
        if (set.size() == 0) throw new NoDataException();
        if (set.size() >  1) throw new BuzzException("找到多个同名的枚举【" + enumName + "】，请联系管理员");

        if (set.iterator().hasNext()) {
            clazz = (Class<? extends IEnum>) set.iterator().next();
            enumClassCache.put(enumName, clazz);
            return FaEnumUtils.toOptions(clazz);
        }
        throw new BuzzException("未找到或找到多个同名的枚举【" + enumName + "】，请联系管理员");
    }

}
