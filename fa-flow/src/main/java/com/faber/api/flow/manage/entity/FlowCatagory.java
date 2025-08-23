package com.faber.api.flow.manage.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.*;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;

import java.util.Date;
import java.math.BigDecimal;

/**
 * FLOW-流程分类
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-08-23 09:32:31
 */
@FaModalName(name = "FLOW-流程分类")
@TableName("flow_catagory")
@Data
public class FlowCatagory extends BaseDelEntity {

    @SqlTreeId
    @ColumnWidth(8)
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @SqlTreeParentId
    @ExcelProperty("上级节点")
    private Integer parentId;

    @SqlTreeName
    @ExcelProperty("名称")
    private String name;

    @SqlSorter
    @ExcelProperty("排序ID")
    private Integer sort;

    @ExcelProperty("图标")
    private String icon;

}
