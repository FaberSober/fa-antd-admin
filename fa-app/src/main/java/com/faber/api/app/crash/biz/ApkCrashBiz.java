package com.faber.api.app.crash.biz;

import com.faber.api.app.app.biz.ApkBiz;
import com.faber.api.app.crash.entity.ApkCrash;
import com.faber.api.app.crash.mapper.ApkCrashMapper;
import com.faber.core.context.BaseContextHandler;
import com.faber.core.web.biz.BaseBiz;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;

/**
 * APP-APK崩溃日志表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2023-01-20 13:59:18
 */
@Service
public class ApkCrashBiz extends BaseBiz<ApkCrashMapper, ApkCrash> {

    @Resource
    ApkBiz apkBiz;

    public void upload(ApkCrash entity) {
        if (!BaseContextHandler.getLogin()) {
            entity.setCrtUser("1");
            entity.setCrtName("admin");
        }
        super.save(entity);
    }
}