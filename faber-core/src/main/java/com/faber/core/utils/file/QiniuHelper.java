package com.faber.core.utils.file;

import cn.hutool.core.bean.BeanUtil;
import com.faber.core.constant.FaSetting;
import com.faber.core.exception.BuzzException;
import com.qiniu.common.QiniuException;
import com.qiniu.http.Response;
import com.qiniu.storage.BucketManager;
import com.qiniu.storage.Configuration;
import com.qiniu.storage.Region;
import com.qiniu.storage.UploadManager;
import com.qiniu.util.Auth;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.io.InputStream;

/**
 * TODO 待整理
 * @Author: xu.pengfei
 * @Email: faberxu@gmail.com
 * @Date: 2018-09-12 17:40
 */
@Component
@Data
@Slf4j
public class QiniuHelper {

    private String accessKey;
    private String secretKey;
    private String bucket;
    private String host;

    @Resource
    private FaSetting faSetting;

    @PostConstruct
    public void init() {
        BeanUtil.copyProperties(faSetting.getQiniu(), this);
    }

    /**
     * 存储区域：https://developer.qiniu.com/kodo/1671/region-endpoint-fq
     */
    private Region region = Region.autoRegion();

    /**
     * 上传凭证
     */
    public String getUploadToken() {
        //默认不指定key的情况下，以文件内容的hash值作为文件名
        Auth auth = Auth.create(accessKey, secretKey);
        return auth.uploadToken(bucket);
    }

    public String upload(InputStream is, String keyPrefix) {
        String key = keyPrefix;
        if (key.startsWith("/")) {
            key = key.replaceFirst("/", "");
        }

        //构造一个带指定region对象的配置类
        Configuration cfg = new Configuration(region);
        //...其他参数参考类注释
        UploadManager uploadManager = new UploadManager(cfg);
        //...生成上传凭证，然后准备上传
        //默认不指定key的情况下，以文件内容的hash值作为文件名
        Auth auth = Auth.create(accessKey, secretKey);
        String upToken = auth.uploadToken(bucket);
        try {
            Response response = uploadManager.put(is, key, upToken, null, null);
            //解析上传成功的结果
            log.debug("response: " + response.bodyString());
        } catch (QiniuException ex) {
            log.error(ex.getMessage(), ex);
            throw new BuzzException(ex.getMessage());
        }
        return host + "/" + key;
    }

    public void delete(String path) {
        if (path.contains(host)) {
            path = path.replace(host + "/", "");
        }
        //构造一个带指定Zone对象的配置类
        Configuration cfg = new Configuration(region);
        Auth auth = Auth.create(accessKey, secretKey);
        BucketManager bucketManager = new BucketManager(auth, cfg);
        try {
            bucketManager.delete(bucket, path);
        } catch (QiniuException ex) {
            //如果遇到异常，说明删除失败
            log.error(ex.getMessage(), ex);
            throw new BuzzException(ex.getMessage());
        }
    }

}
