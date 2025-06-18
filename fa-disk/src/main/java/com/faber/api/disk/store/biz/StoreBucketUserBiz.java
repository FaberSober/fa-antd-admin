package com.faber.api.disk.store.biz;

import com.faber.api.base.admin.biz.UserBiz;
import com.faber.api.disk.store.entity.StoreBucketUser;
import com.faber.api.disk.store.enums.StoreBucketUserTypeEnum;
import com.faber.api.disk.store.mapper.StoreBucketUserMapper;
import com.faber.core.web.biz.BaseBiz;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.List;

/**
 * STORE-库-人员关联
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-12-28 11:14:56
 */
@Service
public class StoreBucketUserBiz extends BaseBiz<StoreBucketUserMapper,StoreBucketUser> {

    @Resource
    UserBiz userBiz;

    @Override
    public void decorateOne(StoreBucketUser i) {
        i.setUser(userBiz.getByIdWithCache(i.getUserId()));
    }

    public void updateBucketUser(List<StoreBucketUser> list) {
        for (StoreBucketUser link : list) {
            long count = lambdaQuery()
                    .eq(StoreBucketUser::getBucketId, link.getBucketId())
                    .eq(StoreBucketUser::getUserId, link.getUserId())
                    .count();
            if (count == 1) continue;

            if (count > 0) {
                lambdaUpdate()
                        .eq(StoreBucketUser::getBucketId, link.getBucketId())
                        .eq(StoreBucketUser::getUserId, link.getUserId())
                        .remove();
            }

            link.setId(null);
            link.setType(StoreBucketUserTypeEnum.USER);
            super.save(link);
        }
    }

}