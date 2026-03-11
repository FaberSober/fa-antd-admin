package com.faber.api.flow.demo.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;

import java.util.Date;
import java.math.BigDecimal;

/**
 * DEMO-请假流程
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-08-24 13:30:43
 */
@FaModalName(name = "DEMO-请假流程")
@TableName("demo_flow_leave")
@Data
public class DemoFlowLeave extends BaseDelEntity {

    @ColumnWidth(8)
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @ExcelProperty("流程ID")
    private Long flowId;

    @ExcelProperty("请假员工ID")
    private String applyUserId;

    @ExcelProperty("申请日期")
    private Date applyDate;

    @ExcelProperty("请假原因")
    private String applyReason;

    @ExcelProperty("请假天数")
    private Integer leaveDayCount;

    @ExcelProperty("开始时间")
    private Date leaveStartTime;

    @ExcelProperty("结束时间")
    private Date leaveEndTime;

    @ExcelProperty("租户ID")
    private Integer tenantId;

}
