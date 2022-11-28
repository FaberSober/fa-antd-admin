package com.faber.core.bean;

import lombok.Data;
import lombok.ToString;

/**
 * 通用上传导入结果
 */
@Data
@ToString
public class BaseUploadResult {

    /**
     * 导入成功的数据条数
     */
    private Integer success = 0;

    /**
     * 导入失败的数据条数
     */
    private Integer fail = 0;

    /**
     * 导入失败的文件下载地址
     */
    private String failDownloadUrl;

}
