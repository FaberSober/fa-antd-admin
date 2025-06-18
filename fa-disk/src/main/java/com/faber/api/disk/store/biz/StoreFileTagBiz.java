package com.faber.api.disk.store.biz;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import com.faber.api.disk.store.entity.StoreFileTag;
import com.faber.api.disk.store.mapper.StoreFileTagMapper;
import com.faber.core.web.biz.BaseBiz;

import jakarta.annotation.Resource;
import java.io.Serializable;

/**
 * STORE-文件-标签
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-12-27 11:25:19
 */
@Service
public class StoreFileTagBiz extends BaseBiz<StoreFileTagMapper, StoreFileTag> {

    @Lazy
    @Resource
    StoreFileBiz storeFileBiz;

    @Override
    public boolean removeById(Serializable id) {
        StoreFileTag storeFileTag = super.getById(id);
        super.removeById(id);

        storeFileBiz.syncFileTags(storeFileTag.getFileId());
        return true;
    }

}