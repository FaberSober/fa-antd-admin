package com.faber.api.admin.vo.ret;

import lombok.Data;

/**
 * 系统参数
 */
@Data
public class SystemConfigPo {

    /**
     * 网站标题
     * system:title
     */
    private String title;

    /**
     * 网站副标题
     * system:subTitle
     */
    private String subTitle;

    /**
     * 网站logo
     * system:logo
     */
    private String logo;

    /**
     * 网站带文字logo
     * system:portal:logoWithText
     */
    private String logoWithText;

    /**
     * [官网]地址
     * system:portal:link
     */
    private String portalLink;

    /**
     * [Web]redis web管理页面地址
     * system:phpRedisAdmin
     */
    private String phpRedisAdmin;

}
