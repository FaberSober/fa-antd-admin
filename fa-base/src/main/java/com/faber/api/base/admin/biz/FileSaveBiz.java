package com.faber.api.base.admin.biz;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.io.file.FileNameUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.URLUtil;
import cn.hutool.crypto.digest.DigestUtil;
import cn.hutool.http.HttpUtil;
import com.faber.api.base.admin.entity.FileSave;
import com.faber.api.base.admin.mapper.FileSaveMapper;
import com.faber.core.bean.BaseCrtEntity;
import com.faber.core.constant.FaSetting;
import com.faber.core.enums.ConfigSysStorageActiveEnum;
import com.faber.core.exception.BuzzException;
import com.faber.core.service.ConfigSysService;
import com.faber.core.service.StorageService;
import com.faber.core.utils.FaFileUtils;
import com.faber.core.vo.config.FaConfig;
import com.faber.core.web.biz.BaseBiz;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.dromara.x.file.storage.core.*;
import org.dromara.x.file.storage.core.platform.FileStorage;
import org.dromara.x.file.storage.core.platform.LocalPlusFileStorage;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.concurrent.CopyOnWriteArrayList;


/**
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-19 10:09:36
 */
@Slf4j
@Service
public class FileSaveBiz extends BaseBiz<FileSaveMapper, FileSave> implements StorageService {

    @Resource FileStorageService fileStorageService;
    @Resource ConfigSysService configSysService;
    @Resource FaSetting faSetting;
    @Resource FileBizBiz fileBizBiz;

    /**
     * 下载URL文件到本地，并入库
     *
     * @param url
     * @param filename
     * @return
     */
    public FileSave download(String url, String filename) throws IOException {
        String name = filename.substring(0, filename.lastIndexOf("."));
        String ext = filename.substring(filename.lastIndexOf("."));
        File tmpFile = FileUtil.createTempFile(name, ext, true);
        HttpUtil.downloadFile(url, tmpFile);
        FileSave fileSave = upload(tmpFile);
        if (fileSave != null) {
            lambdaUpdate()
                    .set(FileSave::getOutUrl, url)
                    .eq(FileSave::getId, fileSave.getId())
                    .update();
        }
        return fileSave;
    }

    /**
     * 下载URL文件到本地，并入库
     *
     * @param url
     * @param filename
     * @param force    force to redownload
     * @return
     */
    public FileSave download(String url, String filename, boolean force) throws IOException {
        if (!force) {
            FileSave cacheFileSave = getTop(
                    lambdaQuery().eq(FileSave::getOutUrl, url).orderByDesc(BaseCrtEntity::getCrtTime)
            );
            if (cacheFileSave != null) {
                return cacheFileSave;
            }
        }
        return download(url, filename);
    }

    /**
     * 上传文件
     *
     * @param file
     * @return
     * @throws IOException
     */
    public FileSave upload(MultipartFile file) {
        UploadPretreatment uploadPretreatment = fileStorageService.of(file).setPlatform(faSetting.getFile().getSavePlatform());

        String extName = FileUtil.extName(file.getOriginalFilename());
        if (FaFileUtils.isImg(extName)) {
            try {
                uploadPretreatment = uploadPretreatment.thumbnail(th -> th.size(200, 200));  //生成一张 200*200 的缩略图（这里操作缩略图）;
            } catch (Exception e) {
                log.error(e.getMessage() + ", fileName=" + file.getOriginalFilename(), e);
            }
        }

        // 检查文件上传类型
        if (!faSetting.getFile().isFileAllowed(file.getOriginalFilename())) {
            log.error("脚本攻击, 非法文件，附件上传出错:" + file.getOriginalFilename());
            throw new BuzzException("非法文件，附件上传出错");
        }

//        String md5 = DigestUtil.md5Hex(file.getBytes());

        FileInfo fileInfo = uploadPretreatment
                .setPath(DateUtil.today() + "/")
                .setSaveFilename(FaFileUtils.addTimestampToFileName(file.getOriginalFilename()))
                .upload();

        FileSave fileSave = new FileSave();
        BeanUtil.copyProperties(fileInfo, fileSave);

//        fileSave.setMd5(md5);

        super.save(fileSave);
        return fileSave;
    }

    /**
     * URL上传文件
     *
     * @param url
     * @return
     */
    public FileSave uploadFromUrl(String url) {
        String fullName = url.substring(url.lastIndexOf("/") + 1);
        int dot = fullName.lastIndexOf(".");
        String name = fullName.substring(0, dot);
        String suffix = fullName.substring(dot);

        File tmpFile = FileUtil.createTempFile(name, suffix, false);
        HttpUtil.downloadFile(url, tmpFile);
        return upload(tmpFile);
    }

    /**
     * 上传文件
     *
     * @param file
     * @return
     */
    public FileSave upload(File file) {
        UploadPretreatment uploadPretreatment = fileStorageService.of(file).setPlatform(faSetting.getFile().getSavePlatform());

        String extName = FileNameUtil.extName(file.getName());
        if (FaFileUtils.isImg(extName)) {
            uploadPretreatment = uploadPretreatment.thumbnail(th -> th.size(200, 200));  //生成一张 200*200 的缩略图（这里操作缩略图）;
        }

        String md5 = DigestUtil.md5Hex(file);

        FileInfo fileInfo = uploadPretreatment
                .setPath(DateUtil.today() + "/")
                .setSaveFilename(FaFileUtils.addTimestampToFileName(file.getName()))
                .upload();

        FileSave fileSave = new FileSave();
        BeanUtil.copyProperties(fileInfo, fileSave);

        fileSave.setMd5(md5);

        super.save(fileSave);
        return fileSave;
    }

    public File getFileObj(FileSave fileSave) {
        // 本地存储
        if (fileSave.getPlatform().startsWith("local-")) {
            LocalPlusFileStorage storage = ((LocalPlusFileStorage) fileStorageService.getFileStorage("local-plus-1"));
            String fileFullPath = storage.getAbsolutePath(fileSave.getUrl());

            return new File(fileFullPath);
        } else {
            File tempFile = FileUtil.createTempFile(fileSave.getFileNameWithoutExtension(), "." + fileSave.getExt(), true);
            fileStorageService.download(getFileInfo(fileSave)).file(tempFile);
            return tempFile;
        }
    }

    /**
     * 通过fileId获取文件
     *
     * @param fileId
     * @return
     */
    public File getFileObj(String fileId) {
        FileSave fileSave = getById(fileId);
        return this.getFileObj(fileSave);
    }

    public File getFileObjWithOriginalName(String fileId) throws IOException {
        FileSave fileSave = getById(fileId);
        File file = this.getFileObj(fileSave);
        File dir = jodd.io.FileUtil.createTempDirectory();
        File tmpFile = new File(dir.getAbsolutePath() + File.separator + fileSave.getOriginalFilename());
        jodd.io.FileUtil.copyFile(file, tmpFile);
        return tmpFile;
    }

    /**
     * 通过fileId，下载文件到http返回流。下载使用分片下载。
     *
     * @param fileId
     * @throws IOException
     */
    public void downloadFileById(String fileId) throws IOException {
        FileSave fileSave = getById(fileId);

        // 本地存储
        if (fileSave.getPlatform().startsWith("local-")) {
            LocalPlusFileStorage storage = ((LocalPlusFileStorage) fileStorageService.getFileStorage("local-plus-1"));
            String fileFullPath = storage.getAbsolutePath(fileSave.getUrl());

            FaFileUtils.downloadFileShard(new File(fileFullPath), fileSave.getOriginalFilename());
        } else {
            // TO-DO 其他下载渠道直接返回URL
            HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();
            response.sendRedirect(URLUtil.encode(fileSave.getUrl()));
        }
    }

    /**
     * 通过fileId，返回图片类型文件缩略图到http返回流
     *
     * @param fileId
     * @throws IOException
     */
    public void getFilePreview(String fileId) throws IOException {
        FileSave fileSave = getById(fileId);

        // 本地存储
        if (fileSave.getPlatform().startsWith("local-")) {
            LocalPlusFileStorage storage = ((LocalPlusFileStorage) fileStorageService.getFileStorage("local-plus-1"));
            String fileFullPath = storage.getAbsolutePath(fileSave.getThUrl());

            FaFileUtils.downloadFileShard(new File(fileFullPath), fileSave.getOriginalFilename());
        } else {
            // TO-DO 其他下载渠道直接返回URL
            HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();
            response.sendRedirect(URLUtil.encode(fileSave.getThUrl()));
        }
    }

    /**
     * 通过fileId读取文件的字符串内容
     *
     * @param fileId
     * @return
     */
    public String getFileStr(String fileId) {
        File file = getFileObj(fileId);
        return FileUtil.readString(file, StandardCharsets.UTF_8);
    }

    /**
     * 创建一个临时文件，并入库
     *
     * @param prefix 前缀，至少3个字符
     * @param suffix 后缀，如果null则使用默认.tmp
     * @return
     */
    public FileSave createTmpFile(String prefix, String suffix) {
        File tmpFile = FileUtil.createTempFile(prefix, suffix, false);
        return upload(tmpFile);
    }

    public void removeStorage(String platform) {
        FileStorage storage = fileStorageService.getFileStorage(platform);
        if (storage != null) {
            storage.close();
            fileStorageService.getFileStorageList().remove(storage);
        }
    }

    /**
     * 系统配置更新后，同步系统配置信息
     */
    @Override
    public void syncStorageDatabaseConfig() {
        log.info("------------ Scan Database Storage Config ------------");
        FaConfig faConfig = configSysService.getConfig();
        if (faConfig.getStoreActive() == null) {
            faConfig.setStoreActive(ConfigSysStorageActiveEnum.LOCAL_PLUS);
        }
        faSetting.getFile().updateSaveType(faConfig.getStoreActive());
        //获得存储平台 List
        CopyOnWriteArrayList<FileStorage> list = fileStorageService.getFileStorageList();
        ConfigSysStorageActiveEnum storeActive = faConfig.getStoreActive();
        switch (storeActive) {
            case MINIO: {
                removeStorage(storeActive.getDesc());

                // 增加
                FileStorageProperties.MinioConfig config = new FileStorageProperties.MinioConfig();
                config.setPlatform(storeActive.getDesc());
                config.setAccessKey(faConfig.getMinioAk());
                config.setSecretKey(faConfig.getMinioSk());
                config.setEndPoint(faConfig.getMinioEndPoint());
                config.setBucketName(faConfig.getMinioBucketName());
                config.setDomain(faConfig.getMinioDomain());
                config.setBasePath(faConfig.getMinioBasePath());

                list.addAll(FileStorageServiceBuilder.buildMinioFileStorage(Collections.singletonList(config), null));
            } break;
            case QINIU: {
                removeStorage(storeActive.getDesc());

                FileStorageProperties.QiniuKodoConfig config = new FileStorageProperties.QiniuKodoConfig();
                config.setPlatform(storeActive.getDesc());
                config.setAccessKey(faConfig.getQiniuAk());
                config.setSecretKey(faConfig.getQiniuSk());
                config.setBucketName(faConfig.getQiniuBucketName());
                config.setDomain(faConfig.getQiniuDomain());
                config.setBasePath(faConfig.getQiniuBasePath());

                list.addAll(FileStorageServiceBuilder.buildQiniuKodoFileStorage(Collections.singletonList(config), null));
            } break;
            case LOCAL_PLUS: {
                LocalPlusFileStorage storage = fileStorageService.getFileStorage("local-plus-1");
                String storeLocalPath = configSysService.getStoreLocalPath();
                if (StrUtil.isNotEmpty(storeLocalPath) && !storeLocalPath.endsWith(File.separator)) {
                    storeLocalPath = storeLocalPath + File.separator;
                }
                log.info("storeLocalPath: {}", storeLocalPath);
                storage.setStoragePath(storeLocalPath);
            } break;
        }
    }

    @Override
    public File getByFileId(String fileId) {
        return getFileObj(fileId);
    }

    @Override
    public FileInfo getFileInfoById(String fileId) {
        FileSave fileSave = this.getByIdWithCache(fileId);
        return getFileInfo(fileSave);
    }

    @Override
    public void saveFileBiz(String mainBizId, String bizId, String type, String fileId) {
        fileBizBiz.saveFile(mainBizId, bizId, type, fileId);
    }

    public FileInfo getFileInfo(FileSave fileSave) {
        FileInfo fileInfo = new FileInfo();
        BeanUtil.copyProperties(fileSave, fileInfo, "attr");
        return fileInfo;
    }

    public String getFileFullPath(String fileId) {
        FileSave fileSave = getById(fileId);
        // 本地存储
        if (fileSave.getPlatform().startsWith("local-")) {
            LocalPlusFileStorage storage = fileStorageService.getFileStorage("local-plus-1");
            String fileFullPath = storage.getAbsolutePath(fileSave.getUrl());
            return fileFullPath;
        } else {
            return fileSave.getUrl();
        }
    }

    public String getFileUrl(String fileId) {
        return this.getFileUrl(faSetting.getUrl().getServerHost(), fileId);
    }

    public String getFileUrl(String server, String fileId) {
        FileSave fileSave = getById(fileId);
        // 本地存储
        if (fileSave.getPlatform().startsWith("local-")) {
            return server + "/api/base/admin/fileSave/getFile/" + fileId;
        }
        return fileSave.getUrl();
    }

    public String getFileUrl(String server, FileSave fileSave) {
        // 本地存储
        if (fileSave.getPlatform().startsWith("local-")) {
            return server + "/api/base/admin/fileSave/getFile/" + fileSave.getId();
        }
        return fileSave.getUrl();
    }

}
