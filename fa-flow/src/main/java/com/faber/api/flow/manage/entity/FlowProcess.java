package com.faber.api.flow.manage.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;

import java.util.Date;
import java.math.BigDecimal;

/**
 * FLOW-流程定义
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-08-23 14:10:49
 */
@FaModalName(name = "FLOW-流程定义")
@TableName("flow_process")
@Data
public class FlowProcess extends BaseDelEntity {

    @ColumnWidth(8)
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @SqlEquals
    @ExcelProperty("流程分类ID")
    private Integer catagoryId;

    @ExcelProperty("流程定义 key 唯一标识")
    private String processKey;

    @ExcelProperty("名称")
    private String processName;

    @ExcelProperty("图标")
    private String processIcon;

    @ExcelProperty("类型")
    private String processType;

    @ExcelProperty("流程版本，默认 1")
    private Integer processVersion;

    @ExcelProperty("实例地址")
    private String instanceUrl;

    @ExcelProperty("备注说明")
    private String remark;

    @ExcelProperty("使用范围 0，全员 1，指定人员（业务关联） 2，均不可提交")
    private Integer useScope;

    @ExcelProperty("流程状态 0，不可用 1，可用 2，历史版本")
    private Integer processState;

    @ExcelProperty("流程模型定义JSON内容")
    private String modelContent;

    @ExcelProperty("排序ID")
    private Integer sort;

}
