package com.faber.admin.entity;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.common.annotation.SqlSearch;
import com.faber.common.bean.BaseCrtEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * URL请求日志
 */
@TableName("base_gate_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GateLog extends BaseCrtEntity {

    @TableId(type = IdType.AUTO)
    private Integer id;

    @SqlSearch
    @ExcelProperty("请求URL")
    // @Column(name = "url")
    private String url;

    @ExcelProperty("请求类型")
    // @Column(name = "method")
    private String method;

    @ExcelProperty("访问客户端")
    // @Column(name = "agent")
    private String agent;

    @ExcelProperty("请求花费时间")
    // @Column(name = "duration")
    private Long duration;

    @ExcelProperty("省")
    // @Column(name = "pro")
    private String pro;

    @ExcelProperty("市")
    // @Column(name = "city")
    private String city;

    @ExcelProperty("地址")
    // @Column(name = "addr")
    private String addr;

    @ExcelProperty("返回码")
    // @Column(name = "ret_status")
    private Integer retStatus;

    @ExcelIgnore
    @Transient
    private Long startTime;

}
