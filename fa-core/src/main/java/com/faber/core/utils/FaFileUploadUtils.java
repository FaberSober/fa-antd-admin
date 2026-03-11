package com.faber.core.utils;

import com.faber.core.exception.BuzzException;
import com.qiniu.util.Auth;

import cn.hutool.cache.CacheUtil;
import cn.hutool.cache.impl.TimedCache;
import cn.hutool.core.util.StrUtil;

public class FaFileUploadUtils {
    
    /**
     * 缓存的 upToken（有效期默认 1 小时，我们缓存 50 分钟，避免临界过期）
     */
    private static final TimedCache<String, String> UP_TOKEN_CACHE;
    private static final String upTokenCacheKey = "qiniu:uptoken:qiniu-kodo-1";

    static {
        // 创建一个定时缓存：超时时间 50 分钟，毎分钟清理一次过期项
        UP_TOKEN_CACHE = CacheUtil.newTimedCache(50 * 60 * 1000); // 50分钟
        // 开启自动清理线程（可选，默认已开启）
        UP_TOKEN_CACHE.schedulePrune(60 * 1000); // 每分钟检查一次过期
    }

    public static String getQiniuUploadToken(String ak, String sk, String bucketName) {
        if (StrUtil.hasEmpty(ak, sk, bucketName)) {
            throw new BuzzException("参数 ak、sk、bucketName 均不能为空，请管理员在后台进行配置");
        }
        String token = UP_TOKEN_CACHE.get(upTokenCacheKey);
        if (token != null) {
            return token;
        }
        // 创建认证对象
        Auth auth = Auth.create(ak, sk);
        // 生成上传凭证（简单版：不指定 key，有效期 1 小时）
        // 参数：bucket, key（null 表示由七牛自动生成）, expires（秒）, policy（null 表示无额外策略）, strict（true 表示严格模式）
        String upToken = auth.uploadToken(bucketName);
        UP_TOKEN_CACHE.put(upTokenCacheKey, upToken);
        return upToken;
    }

    /**
     * 可选：手动清除缓存（比如密钥变更时调用）
     */
    public static void clearQiniuUploadTokenCache() {
        UP_TOKEN_CACHE.clear();
    }

}
