package com.faber.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.faber.common.annotation.SqlSearch;
import com.faber.common.bean.BaseCrtEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

/**
 * 网关操作日志
 */
@Table(name = "gate_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GateLog extends BaseCrtEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ExcelProperty("菜单")
    @Column(name = "menu")
    private String menu;

    @SqlSearch
    @ExcelProperty("操作")
    @Column(name = "opt")
    private String opt;

    @SqlSearch
    @ExcelProperty("资源路径")
    @Column(name = "uri")
    private String uri;

    @ExcelProperty("访问完整url")
    @Column(name = "original_url")
    private String originalUrl;

    @ExcelProperty("请求内容")
    @Column(name = "body")
    private String body;

    @ExcelProperty("返回内容")
    @Column(name = "response")
    private String response;

    public GateLog(String menu, String opt, String uri, String originalUrl, String body, String response, Date crtTime, String crtUser, String crtName, String crtHost) {
        this.menu = menu;
        this.opt = opt;
        this.uri = uri;
        this.originalUrl = originalUrl;
        this.body = body;
        this.response = response;

        this.setCrtTime(crtTime);
        this.setCrtUser(crtUser);
        this.setCrtName(crtName);
        this.setCrtHost(crtHost);
    }

}
