package com.faber.api.disk.store.biz;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.faber.api.disk.store.entity.StoreFile;
import org.springframework.stereotype.Service;

import com.faber.api.disk.store.entity.StoreFileHis;
import com.faber.api.disk.store.mapper.StoreFileHisMapper;
import com.faber.core.web.biz.BaseBiz;

/**
 * STORE-文件-历史记录
 *
 * @author xu.pengfei
 * @email faberxu@gmail.com
 * @date 2023-03-15 16:31:06
 */
@Service
public class StoreFileHisBiz extends BaseBiz<StoreFileHisMapper,StoreFileHis> {

    public Integer getStoreFileMaxVer(Integer storeFileId) {
        QueryWrapper<StoreFileHis> wrapper = new QueryWrapper<>();
        wrapper.eq("store_file_id", storeFileId);
        return getMaxSort(wrapper, "ver");
    }

    public void saveSnapshot(StoreFile storeFile) {
        StoreFileHis storeFileHis = new StoreFileHis();
        storeFileHis.setStoreFileId(storeFile.getId());
        storeFileHis.setFileSaveId(storeFile.getFileId());
        storeFileHis.setFileName(storeFile.getName());
        storeFileHis.setVer(1);
        super.save(storeFileHis);
    }

}