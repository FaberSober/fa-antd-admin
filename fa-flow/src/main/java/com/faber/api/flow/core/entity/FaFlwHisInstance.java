package com.faber.api.flow.core.entity;

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
 * 历史流程实例表
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-08-25 17:25:29
 */
@FaModalName(name = "历史流程实例表")
@TableName("flw_his_instance")
@Data
public class FaFlwHisInstance extends FaFlwInstance {

    @ExcelProperty("状态 -2，已暂停状态 -1，暂存待审 0，审批中 1，审批通过 2，审批拒绝 3，撤销审批 4，超时结束 5，强制终止 6，自动通过 7，自动拒绝")
    private Boolean instanceState;

    @ExcelProperty("结束时间")
    private Date endTime;

    @ExcelProperty("处理耗时")
    private Long duration;

}
