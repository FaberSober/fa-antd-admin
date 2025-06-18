package com.faber.api.disk.store.biz;

import cn.hutool.core.collection.ListUtil;
import com.faber.api.disk.store.entity.StoreBucket;
import com.faber.api.disk.store.entity.StoreBucketUser;
import com.faber.api.disk.store.entity.StoreFile;
import com.faber.api.disk.store.enums.StoreBucketUserTypeEnum;
import com.faber.api.disk.store.mapper.StoreBucketMapper;
import com.faber.core.web.biz.BaseBiz;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * STORE-库
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-12-22 09:31:17
 */
@Service
@Transactional
public class StoreBucketBiz extends BaseBiz<StoreBucketMapper, StoreBucket> {

    @Resource
    StoreBucketUserBiz storeBucketUserBiz;

    @Lazy
    @Resource
    StoreFileBiz storeFileBiz;

    @Override
    public boolean save(StoreBucket entity) {
        super.save(entity);

        // 添加创建者绑定关系
        StoreBucketUser link = new StoreBucketUser();
        link.setBucketId(entity.getId());
        link.setUserId(getCurrentUserId());
        link.setType(StoreBucketUserTypeEnum.CREATOR);
        storeBucketUserBiz.save(link);

        return true;
    }

    public List<Integer> getMyIds() {
        List<Integer> linkBucketIds = storeBucketUserBiz.lambdaQuery()
                .eq(StoreBucketUser::getUserId, getCurrentUserId())
                .select(StoreBucketUser::getBucketId)
                .list()
                .stream().map(i -> i.getBucketId()).collect(Collectors.toList());
        if (linkBucketIds == null || linkBucketIds.isEmpty()) return ListUtil.toList(0);
        return linkBucketIds;
    }

    public List<StoreBucket> getMyList() {
        List<Integer> linkBucketIds = this.getMyIds();

        return lambdaQuery().in(StoreBucket::getId, linkBucketIds).list();
    }

    public void syncBucketSize() {
        List<StoreBucket> bucketList = lambdaQuery().list();

        for (StoreBucket bucket : bucketList) {
            Long size = storeFileBiz.getBaseMapper().sumFileSizeByBucketId(bucket.getId());
            bucket.setSize(size);

            Long dirCount = storeFileBiz.lambdaQuery()
                    .eq(StoreFile::getBucketId, bucket.getId())
                    .eq(StoreFile::getDir, true)
                    .count();
            bucket.setDirCount(dirCount);

            Long fileCount = storeFileBiz.lambdaQuery()
                    .eq(StoreFile::getBucketId, bucket.getId())
                    .eq(StoreFile::getDir, false)
                    .count();
            bucket.setFileCount(fileCount);

            this.updateById(bucket);
        }
    }

}