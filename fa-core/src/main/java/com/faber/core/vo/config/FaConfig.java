package com.faber.core.vo.config;

import com.faber.core.enums.ConfigSysSafePasswordTypeEnum;
import com.faber.core.enums.ConfigSysStorageActiveEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FaConfig implements Serializable {

    /**
     * 网站标题
     */
    private String title;
    /**
     * 网站标题-颜色
     */
    private String titleColor;
    /**
     * 网站副标题
     */
    private String subTitle;
    /**
     * 网站副标题-颜色
     */
    private String subTitleColor;
    /**
     * 版权信息-颜色
     */
    private String cop;
    /**
     * 版权信息
     */
    private String copColor;
    /**
     * 登录背景图
     */
    private String loginBg;
    /**
     * 登录页面样式
     */
    private String loginPageType;
    /**
     * 顶部菜单条样式
     */
    private String topMenuBarStyle;
    /**
     * 网站logo
     */
    private String logo;
    /**
     * 网站带文字logo
     */
    private String logoWithText;
    /**
     * 微信小程序
     */
    private String wxminiapp;
    /**
     * [官网]地址
     */
    private String portalLink;
    /**
     * [安全]是否开启验证码
     */
    private Boolean safeCaptchaOn = true;
    /**
     * [安全]是否开启注册
     */
    private Boolean safeRegistrationOn = true;
    /**
     * [安全]密码类型
     */
    private ConfigSysSafePasswordTypeEnum safePasswordType = ConfigSysSafePasswordTypeEnum.NUM;
    /**
     * [安全]密码最小长度
     */
    private Integer safePasswordLenMin = 1;
    /**
     * [安全]密码最大长度
     */
    private Integer safePasswordLenMax = 30;
    /**
     * [安全]token有效时长(小时)
     */
    private Integer safeTokenExpireHour = 24;
    /**
     * [存储]当前激活存储
     */
    private ConfigSysStorageActiveEnum storeActive;
    /**
     * [存储][本地]目录
     */
    private String storeLocalPath;
    // ------------------------- [存储][Minio] -------------------------
    private String minioAk;
    private String minioSk;
    private String minioEndPoint;
    private String minioBucketName;
    private String minioDomain;
    private String minioBasePath;
    // ------------------------- [存储][Qiniu] -------------------------
    private String qiniuAk;
    private String qiniuSk;
    private String qiniuBucketName;
    private String qiniuDomain;
    private String qiniuBasePath;

    // ------------------------- [日志配置] -------------------------
    /**
     * 日志保存级别：
     * 1. all：全部
     * 2. simple：记录请求(不记录请求内容与返回内容，节省日志空间)
     * 3. no：不记录
     */
    private String logSaveLevel = "all";
    /**
     * 日志保存最大数量
     */
    private Integer logSaveMaxNum = -1;

}
