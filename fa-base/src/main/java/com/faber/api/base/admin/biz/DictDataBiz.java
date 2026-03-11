package com.faber.api.base.admin.biz;

import cn.hutool.core.util.ObjUtil;
import com.faber.api.base.admin.entity.Dict;
import com.faber.api.base.admin.entity.DictData;
import com.faber.api.base.admin.mapper.DictDataMapper;
import com.faber.core.vo.utils.DictOption;
import com.faber.core.web.biz.BaseTreeBiz;
import jakarta.annotation.Resource;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

/**
 * BASE-字典值
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-07-08 17:22:52
 */
@Service
public class DictDataBiz extends BaseTreeBiz<DictDataMapper, DictData> {

    @Lazy @Resource DictBiz dictBiz;

    @Override
    public void decorateOne(DictData i) {
        Dict dict = dictBiz.getByIdWithCache(i.getDictId());
        i.setDictName(dict != null ? dict.getName() : "");
    }

    @Override
    protected void saveBefore(DictData entity) {
        if (entity.getIsDefault() == null) {
            entity.setIsDefault(false);
        }
    }

    @Override
    protected void afterSave(DictData entity) {
        updateDefault(entity);
    }

    @Override
    protected void afterUpdate(DictData entity) {
        updateDefault(entity);
    }

    private void updateDefault(DictData entity) {
        if (entity.getIsDefault()) {
            lambdaUpdate()
                    .eq(DictData::getDictId, entity.getDictId())
                    .ne(DictData::getId, entity.getId())
                    .set(DictData::getIsDefault, false)
                    .update();
        }
    }

    public void toggleDefaultById(Integer id) {
        DictData dictData = getById(id);

        // update same dictId isDefault to false
        lambdaUpdate()
                .eq(DictData::getDictId, dictData.getDictId())
                .set(DictData::getIsDefault, false)
                .update();

        boolean isDefault = ObjUtil.equal(true, dictData.getIsDefault()) ? false : true;
        lambdaUpdate()
                .set(DictData::getIsDefault, isDefault)
                .eq(DictData::getId, id)
                .update();
    }

    public List<DictOption<Serializable>> getOptionsByDictId(Integer dictId) {
        List<DictData> dictDataList = lambdaQuery()
                .eq(DictData::getDictId, dictId)
                .orderByAsc(DictData::getSortId)
                .list();
        List<DictOption<Serializable>> dictOptions = new ArrayList<>();
        for (int i = 0; i < dictDataList.size(); i++) {
            DictData data = dictDataList.get(i);
            DictOption<Serializable> o = new DictOption<>();
            o.setLabel(data.getLabel());
            o.setValue(data.getValue());
            o.setSort(i + 1);
            dictOptions.add(o);
        }
        return dictOptions;
    }

}
