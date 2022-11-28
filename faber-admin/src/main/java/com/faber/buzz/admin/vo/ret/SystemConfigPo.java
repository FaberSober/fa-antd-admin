package com.faber.buzz.admin.vo.ret;

import lombok.Data;

/**
 * 系统参数
 */
@Data
public class SystemConfigPo {

    /**
     * 地图服务URL
     * system:title
     */
    private String title;

    /**
     * 地图服务URL
     * system:logo
     */
    private String logo;

    /**
     * 地图服务URL
     * system:portal:logoWithText
     */
    private String logoWithText;

    /**
     * [官网]地址
     * system:portal:link
     */
    private String portalLink;

}
