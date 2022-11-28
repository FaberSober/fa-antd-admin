package com.faber.buzz.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;

import java.io.Serializable;
import java.util.Date;


/**
 * BASE-系统定时任务-执行日志
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-07 16:03:51
 */
@FaModalName(name = "BASE-系统定时任务-执行日志")
@TableName("base_job_log")
@Data
public class JobLog implements Serializable {
	private static final long serialVersionUID = 1L;
	
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @SqlEquals
    @ExcelProperty("任务ID")
    // @Column(name = "job_id")
    private Integer jobId;

    @ExcelProperty("创建时间")
    // @Column(name = "begin_time")
    private Date beginTime;

    @ExcelProperty("结束时间")
    // @Column(name = "end_time")
    private Date endTime;

    @ExcelProperty("执行结果：1-执行中/2-成功/9-失败")
    // @Column(name = "status")
    private String status;

    @ExcelProperty("执行花费时间")
    // @Column(name = "duration")
    private Long duration;

    @ExcelProperty("错误日志")
    // @Column(name = "err_msg")
    private String errMsg;

    @ToString
    @AllArgsConstructor
    public enum Status {
        DOING("1", "执行中"),
        DONE("2", "成功"),
        ERROR("9", "失败");

        public final String value;
        public final String text;
    }

}
