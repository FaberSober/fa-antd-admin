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
import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 流程实例表
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-08-24 14:23:52
 */
@FaModalName(name = "流程实例表")
@TableName("flw_instance")
@Data
public class FaFlwInstance implements Serializable {

    @ColumnWidth(8)
    @ExcelProperty("主键ID")
    @TableId(type = IdType.AUTO)
    private Long id;

    @ExcelProperty("租户ID")
    private String tenantId;

    @ExcelProperty("创建人ID")
    private String createId;

    @ExcelProperty("创建人名称")
    private String createBy;

    @ExcelProperty("创建时间")
    private Date createTime;

    @ExcelProperty("流程定义ID")
    private Long processId;

    @ExcelProperty("父流程实例ID")
    private Long parentInstanceId;

    @ExcelProperty("优先级")
    private Boolean priority;

    @ExcelProperty("流程实例编号")
    private String instanceNo;

    @ExcelProperty("业务KEY")
    private String businessKey;

    @ExcelProperty("变量json")
    private String variable;

    @ExcelProperty("当前所在节点名称")
    private String currentNodeName;

    @ExcelProperty("当前所在节点key")
    private String currentNodeKey;

    @ExcelProperty("期望完成时间")
    private Date expireTime;

    @ExcelProperty("上次更新人")
    private String lastUpdateBy;

    @ExcelProperty("上次更新时间")
    private Date lastUpdateTime;

}
