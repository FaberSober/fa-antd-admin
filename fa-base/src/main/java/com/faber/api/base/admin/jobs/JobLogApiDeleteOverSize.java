package com.faber.api.base.admin.jobs;

import com.faber.api.base.admin.biz.LogApiBiz;
import com.faber.config.quartz.BaseJob;
import com.faber.core.annotation.FaJob;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;

/**
 * 删除超出保存数量的日志
 * @author xu.pengfei
 * @date 2025/05/30 15:35
 */
@Slf4j
@FaJob("删除超出保存数量的日志")
public class JobLogApiDeleteOverSize extends BaseJob {

    @Resource LogApiBiz logApiBiz;

    @Override
    protected void run() {
        logApiBiz.deleteOverSize();
    }

}
