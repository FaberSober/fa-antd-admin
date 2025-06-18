package com.faber.api.app.app.biz;

import com.faber.api.app.app.entity.Apk;
import com.faber.core.exception.BuzzException;
import com.faber.core.vo.msg.Ret;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import com.faber.api.app.app.entity.ApkVersion;
import com.faber.api.app.app.mapper.ApkVersionMapper;
import com.faber.core.web.biz.BaseBiz;

import jakarta.annotation.Resource;
import java.util.List;

/**
 * APP-APK版本表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2023-01-18 20:31:39
 */
@Service
public class ApkVersionBiz extends BaseBiz<ApkVersionMapper,ApkVersion> {

    @Lazy
    @Resource
    ApkBiz apkBiz;

    /**
     * 列出指定APP全部的版本信息
     * @param appId
     * @return
     */
    public List<ApkVersion> listByAppId(Integer appId) {
        return lambdaQuery()
                .eq(ApkVersion::getAppId, appId)
                .orderByDesc(ApkVersion::getId)
                .list();
    }

    /**
     * 指定版本号下载数+1
     * @param id
     */
    public void addDownloadNum(Integer id) {
        ApkVersion apkVersion = getById(id);
        if (apkVersion == null) throw new BuzzException("ID异常，请检查");

        Apk apk = apkBiz.getById(apkVersion.getAppId());
        if (apk == null) throw new BuzzException("APP ID异常，请检查");

        baseMapper.addDownloadNum(id);
        apkBiz.sumDownloadNum(apk.getId());
    }

    /**
     * 获取指定app的最新版本信息
     * @param appId {@link Apk#getId()}
     * @return
     */
    public ApkVersion getLatestVersion(Integer appId) {
        return getTop(
                lambdaQuery()
                        .eq(ApkVersion::getAppId, appId)
                        .orderByDesc(ApkVersion::getId)
        );
    }

}