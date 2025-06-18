package com.faber.api.disk.store.jobs;

import com.faber.api.disk.store.biz.StoreBucketBiz;
import com.faber.config.quartz.BaseJob;
import com.faber.core.annotation.FaJob;
import lombok.extern.slf4j.Slf4j;

import jakarta.annotation.Resource;

/**
 * 同步文件库信息
 * @author xu.pengfei
 * @date 2022/12/30 13:41
 */
@Slf4j
@FaJob("[网盘][文件库]同步文件库信息")
public class JobSyncBucketInfo extends BaseJob {

    @Resource
    StoreBucketBiz storeBucketBiz;

    @Override
    protected void run() {
        storeBucketBiz.syncBucketSize();
    }

}
