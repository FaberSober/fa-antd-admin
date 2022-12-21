package com.faber.api.base.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.annotation.SqlSearch;
import com.faber.core.bean.BaseDelEntity;
import com.faber.config.quartz.vo.JobInfo;
import lombok.Data;
import lombok.EqualsAndHashCode;


/**
 * 系统定时任务
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-21 14:48:06
 */
@EqualsAndHashCode(callSuper = true)
@FaModalName(name = "定时任务")
@TableName("base_job")
@Data
public class Job extends BaseDelEntity implements JobInfo {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Integer id;

    @SqlSearch
    @ExcelProperty("任务名称")
    private String jobName;

    @SqlSearch
    @ExcelProperty("cron表达式")
    private String cron;

    @SqlEquals
    @ExcelProperty("是否启动")
    private Boolean status = false;

    @SqlSearch
    @ExcelProperty("任务执行方法")
    private String clazzPath;

    @ExcelProperty("任务描述")
    private String jobDesc;

}
