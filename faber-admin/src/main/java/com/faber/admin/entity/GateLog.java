package com.faber.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.common.annotation.FaberModalName;
import com.faber.common.annotation.SqlSearch;
import com.faber.common.bean.BaseCrtEntity;
import lombok.Data;
import lombok.ToString;

/**
 * URL请求日志
 */
@FaberModalName(name = "URL请求日志")
@TableName("base_gate_log")
@Data
@ToString
public class GateLog extends BaseCrtEntity {

    @TableId(type = IdType.AUTO)
    private Integer id;

    @SqlSearch
    @ExcelProperty("请求URL")
    private String url;

    @ExcelProperty("请求类型")
    private String method;

    @ExcelProperty("访问客户端")
    private String agent;

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
