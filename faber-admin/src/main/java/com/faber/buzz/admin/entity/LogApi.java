package com.faber.buzz.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.annotation.SqlSearch;
import com.faber.core.bean.BaseCrtEntity;
import lombok.Data;
import lombok.ToString;

/**
 * URL请求日志
 */
@FaModalName(name = "URL请求日志")
@TableName("base_log_api")
@Data
@ToString
public class LogApi extends BaseCrtEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    @SqlSearch
    @ExcelProperty("请求URL")
    private String url;

    @ExcelProperty("请求类型")
    private String method;

    @ExcelProperty("访问客户端")
    private String agent;

    @ExcelProperty("操作系统")
    private String os;

    @ExcelProperty("浏览器")
    private String browser;

    @ExcelProperty("浏览器版本")
    private String version;

    @SqlEquals
    @ExcelProperty("是否为移动终端")
    private Boolean mobile;

    @ExcelProperty("请求花费时间")
    private Long duration;

    @ExcelProperty("省")
    private String pro;

    @ExcelProperty("市")
    private String city;

    @ExcelProperty("地址")
    private String addr;

    @ExcelProperty("请求内容")
    private String request;

    @ExcelProperty("请求体大小")
    private Integer reqSize;

    @ExcelProperty("返回内容")
    private String response;

    @ExcelProperty("返回内容大小")
    private Integer retSize;

    @ExcelProperty("返回码")
    private Integer retStatus;

}
