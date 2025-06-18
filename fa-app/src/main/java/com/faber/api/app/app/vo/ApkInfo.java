package com.faber.api.app.app.vo;

import lombok.Data;

import java.io.Serializable;

@Data
public class ApkInfo implements Serializable {

    // 应用名称
    private String name;

    // 应用包名
    private String applicationId;

    // 版本号
    private Long versionCode;

    // 版本名称
    private String versionName;

    // 图标文件ID
    private String iconId;

}
