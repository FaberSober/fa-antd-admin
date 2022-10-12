package com.faber.common.util.file;

import com.faber.common.exception.BuzzException;
import com.qiniu.common.QiniuException;
import com.qiniu.http.Response;
import com.qiniu.storage.BucketManager;
import com.qiniu.storage.Configuration;
import com.qiniu.storage.Region;
import com.qiniu.storage.UploadManager;
import com.qiniu.util.Auth;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.UUID;

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

    @Value("${qiniu.accessKey}")
    private String accessKey;

    @Value("${qiniu.secretKey}")
    private String secretKey;

    @Value("${qiniu.bucket}")
    private String bucket;

    @Value("${qiniu.host}")
    private String host;

    /**
     * 图片类型文件后缀
     */
    private String[] suffixes = new String[]{"jpg", "jpeg", "png", "bmp", "gif"};

    /**
     * 存储区域：https://developer.qiniu.com/kodo/1671/region-endpoint-fq
     */
    private Region region = Region.autoRegion();

    /**
     * 上传凭证
     */
    public String getToken() {
        // 最简单的上传凭证只需要AccessKey，SecretKey和Bucket就可以
        Auth auth = Auth.create(accessKey, secretKey);
        return auth.uploadToken(bucket);
    }

    public String upload(InputStream is, String keyPrefix) {
        String key = keyPrefix;
        if (key.startsWith("/")) {
            key = key.replaceFirst("/", "");
        }

        //构造一个带指定Zone对象的配置类
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
        }
        return host + "/" + key;
    }

    public String uploadPrefix(InputStream is, String prefix) {
        return upload(is, prefix + UUID.randomUUID().toString());
    }

    public String upload(InputStream is) {
        return upload(is, UUID.randomUUID().toString());
    }

    public String upload(String filePath) throws FileNotFoundException {
        File file = new File(filePath);
        return upload(new FileInputStream(file));
    }

    public String upload(String filePath, String prefix) throws FileNotFoundException {
        File file = new File(filePath);
        return upload(new FileInputStream(file), prefix);
    }

    public String getUploadToken() {
        //构造一个带指定Zone对象的配置类
        Configuration cfg = new Configuration(region);
        //...其他参数参考类注释
        UploadManager uploadManager = new UploadManager(cfg);
        //...生成上传凭证，然后准备上传
        //默认不指定key的情况下，以文件内容的hash值作为文件名
        Auth auth = Auth.create(accessKey, secretKey);
        return auth.uploadToken(bucket);
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
