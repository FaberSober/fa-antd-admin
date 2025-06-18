package com.faber.api.app.app.biz;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.ObjUtil;
import cn.hutool.core.util.RandomUtil;
import com.faber.api.app.app.entity.Apk;
import com.faber.api.app.app.entity.ApkVersion;
import com.faber.api.app.app.mapper.ApkMapper;
import com.faber.api.base.admin.biz.FileSaveBiz;
import com.faber.api.base.admin.entity.FileSave;
import com.faber.core.exception.BuzzException;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.biz.BaseBiz;
import jodd.io.FileUtil;
import net.dongliu.apk.parser.ApkFile;
import net.dongliu.apk.parser.bean.ApkMeta;
import net.dongliu.apk.parser.bean.IconFace;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.Resource;
import java.io.File;
import java.io.IOException;
import java.util.List;

/**
 * APP-APK表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2023-01-18 20:31:39
 */
@Service
public class ApkBiz extends BaseBiz<ApkMapper,Apk> {

    @Resource
    FileSaveBiz fileSaveBiz;

    @Resource
    ApkVersionBiz apkVersionBiz;

    public Apk getApkInfo(String fileId) throws IOException {
        File file = fileSaveBiz.getFileObj(fileId);
        ApkFile apkFile = new ApkFile(file);
        ApkMeta apkMeta = apkFile.getApkMeta();

        Apk apkInfo = new Apk();
        apkInfo.setFileId(fileId);
        apkInfo.setName(apkMeta.getName());
        apkInfo.setApplicationId(apkMeta.getPackageName());
        apkInfo.setVersionCode(apkMeta.getVersionCode());
        apkInfo.setVersionName(apkMeta.getVersionName());

        List<IconFace> icons = apkFile.getAllIcons();
        if (icons != null && !icons.isEmpty()) {
            IconFace icon = icons.get(0);
            File iconFile = FileUtil.createTempFile("icon", ".png", FileUtil.createTempDirectory());
            FileUtil.writeBytes(iconFile, icon.getData());
            FileSave fileSave = fileSaveBiz.upload(iconFile);
            apkInfo.setIconId(fileSave.getId());
        }

        Apk apk = this.getApkByApplicationId(apkInfo.getApplicationId());
        if (apk != null) {
            apkInfo.setShortCode(apk.getShortCode());
        } else {
            apkInfo.setShortCode(RandomUtil.randomString(4));
        }

        return apkInfo;
    }

    public Apk getApkByApplicationId(String applicationId) {
        long count = lambdaQuery().eq(Apk::getApplicationId, applicationId).count();
        if (count > 2) throw new BuzzException("有多个相同包名的应用，请联系管理员");
        if (count == 1) {
            return lambdaQuery().eq(Apk::getApplicationId, applicationId).one();
        }
        return null;
    }

    public Apk create(Apk entity) {
        FileSave apkFileSave = fileSaveBiz.getById(entity.getFileId());
        entity.setSize(apkFileSave.getSize());

        // step 1: update apk info
        Apk apk = this.getApkByApplicationId(entity.getApplicationId());
        if (apk == null) {
            // check shortCode unique
            long count = lambdaQuery().eq(Apk::getShortCode, entity.getShortCode()).count();
            if (count > 0) throw new BuzzException("有多个相同短链的应用，请更换短链");

            // create apk
            super.save(entity);
            apk = entity;
        } else {
            // update
            // check shortCode unique
            long count = lambdaQuery()
                    .eq(Apk::getShortCode, entity.getShortCode())
                    .ne(Apk::getId, apk.getId())
                    .count();
            if (count > 1) throw new BuzzException("该短链已存在，请更换短链");

            apk.setName(entity.getName());
            apk.setVersionCode(entity.getVersionCode());
            apk.setVersionName(entity.getVersionName());
            apk.setFileId(entity.getFileId());
            apk.setSize(apkFileSave.getSize());
            apk.setIconId(entity.getIconId());
            apk.setRemark(entity.getRemark());
            super.updateById(apk);
        }

        // step 2: add apk version info
        ApkVersion apkVersion = new ApkVersion();
        BeanUtil.copyProperties(entity, apkVersion);
        apkVersion.setAppId(apk.getId());
        apkVersion.setForceUpdate(false); // 默认不强制更新
        apkVersionBiz.save(apkVersion);

        return apk;
    }

    @Override
    public boolean updateById(Apk entity) {
        long count = lambdaQuery()
                .eq(Apk::getShortCode, entity.getShortCode())
                .ne(Apk::getId, entity.getId())
                .count();
        if (count > 1) throw new BuzzException("该短链已存在，请更换短链");
        return super.updateById(entity);
    }

    @Transactional(rollbackFor = Exception.class)
    public Apk apiUpload(MultipartFile file, Integer appId, String remark) throws IOException {
        Apk apk = super.getById(appId);
        if (apk == null) throw new BuzzException("AppId Not Found");

        if (ObjUtil.notEqual(apk.getCrtUser(), getCurrentUserId())) {
            throw new BuzzException("Wrong AppId, Please Check.");
        }

        FileSave apkFileSave = fileSaveBiz.upload(file);
        Apk apkFileInfo = this.getApkInfo(apkFileSave.getId());

        // 0. check info
        if (ObjUtil.notEqual(apkFileInfo.getApplicationId(), apk.getApplicationId())) {
            throw new BuzzException("ApplicationId Not Equal, Please Check.");
        }

        // 1. update apk info
        apk.setName(apkFileInfo.getName());
        apk.setVersionCode(apkFileInfo.getVersionCode());
        apk.setVersionName(apkFileInfo.getVersionName());
        apk.setFileId(apkFileInfo.getFileId());
        apk.setSize(apkFileSave.getSize());
        apk.setIconId(apkFileInfo.getIconId());
        apk.setRemark(remark);
        this.updateById(apk);

        // 2. save version info
        ApkVersion apkVersion = new ApkVersion();
        apkVersion.setAppId(apk.getId());
        apkVersion.setApplicationId(apk.getApplicationId());
        apkVersion.setName(apkFileInfo.getName());
        apkVersion.setVersionCode(apkFileInfo.getVersionCode());
        apkVersion.setVersionName(apkFileInfo.getVersionName());
        apkVersion.setFileId(apkFileInfo.getFileId());
        apkVersion.setSize(apkFileSave.getSize());
        apkVersion.setIconId(apkFileInfo.getIconId());
        apkVersion.setRemark(remark);
        apkVersion.setForceUpdate(false);
        apkVersionBiz.save(apkVersion);

        return apk;
    }

    public Apk getByShortCode(String shortCode) {
        long count = lambdaQuery().eq(Apk::getShortCode, shortCode).count();
        if (count != 1) throw new BuzzException("获取APP信息失败，请检查短码是否正确");

        return lambdaQuery().eq(Apk::getShortCode, shortCode).one();
    }

    @Transactional
    public void addLastDownloadNum(Integer id) {
        // 最新版本下载数+1
        ApkVersion apkVersion = apkVersionBiz.getLatestVersion(id);
        if (apkVersion != null) {
            apkVersionBiz.lambdaUpdate()
                    .eq(ApkVersion::getId, apkVersion.getId())
                    .set(ApkVersion::getDownloadNum, apkVersion.getDownloadNum() + 1)
                    .update();
        }

        // 当前apk下载数+1
        baseMapper.sumDownloadNum(id);
    }

    public void sumDownloadNum(Integer id) {
        baseMapper.sumDownloadNum(id);
    }

    /**
     * 获取APK最新版本
     *
     * @param id 编号
     * @return {@link Apk}
     */
    public Apk getApkLastRelease(Integer id) {
        Apk apk = getById(id);

        ApkVersion apkVersion = apkVersionBiz.getLatestVersion(id);
        apk.setForceUpdate(apkVersion.getForceUpdate());

        return apk;
    }

}
