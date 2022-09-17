package com.faber.admin.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.alibaba.excel.annotation.ExcelProperty;
import com.faber.common.annotation.FaberModalName;
import com.faber.common.annotation.SqlEquals;
import com.faber.common.annotation.SqlSearch;
import com.faber.common.bean.BaseDelEntity;
import lombok.Data;

import javax.persistence.*;


/**
 * 系统定时任务
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-21 14:48:06
 */
@FaberModalName(name = "定时任务")
@Table(name = "base_job")
@Data
public class Job extends BaseDelEntity {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Integer id;

    @SqlSearch
    @ExcelProperty("任务名称")
    @Column(name = "job_name")
    private String jobName;

    @SqlSearch
    @ExcelProperty("cron表达式")
    @Column(name = "cron")
    private String cron;

    @SqlEquals
    @ExcelProperty("状态:0未启动false/1启动true")
    @Column(name = "status")
    private String status;

    @SqlSearch
    @ExcelProperty("任务执行方法")
    @Column(name = "clazz_path")
    private String clazzPath;

    @ExcelProperty("任务描述")
    @Column(name = "job_desc")
    private String jobDesc;

}
