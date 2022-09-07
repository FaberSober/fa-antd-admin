package com.faber.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.faber.common.annotation.FaberModalName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.*;
import java.math.BigDecimal;


/**
 * BASE-系统定时任务-执行日志
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-07 16:03:51
 */
@FaberModalName(name = "BASE-系统定时任务-执行日志")
@Table(name = "base_job_log")
@Data
public class JobLog implements Serializable {
	private static final long serialVersionUID = 1L;
	
    @ExcelProperty("ID")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ExcelProperty("任务ID")
    @Column(name = "job_id")
    private Integer jobId;

    @ExcelProperty("创建时间")
    @Column(name = "begin_time")
    private Date beginTime;

    @ExcelProperty("结束时间")
    @Column(name = "end_time")
    private Date endTime;

    @ExcelProperty("执行结果：1-执行中/2-成功/9-失败")
    @Column(name = "status")
    private String status;

    @ExcelProperty("执行花费时间")
    @Column(name = "duration")
    private Long duration;

    @ExcelProperty("错误日志")
    @Column(name = "err_msg")
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
