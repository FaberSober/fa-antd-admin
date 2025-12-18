package com.faber.api.flow.form.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.api.flow.form.vo.config.FlowFormDataConfig;
import com.faber.core.annotation.FaModalName;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;
import com.faber.core.config.mybatis.handler.UniversalJsonTypeHandler;
import com.baomidou.mybatisplus.annotation.TableField;
import java.util.Map;
import java.math.BigDecimal;

/**
 * FLOW-流程表单
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-12-16 15:43:41
 */
@FaModalName(name = "FLOW-流程表单")
@TableName(value = "flow_form", autoResultMap = true)
@Data
@EqualsAndHashCode(callSuper = true)
public class FlowForm extends BaseDelEntity {

    @ColumnWidth(8)
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @ExcelProperty("流程分类ID")
    private Integer catagoryId;

    @ExcelProperty("名称")
    private String name;

    @ExcelProperty("编码")
    private String no;

    @ExcelProperty("表单类型:1设计表单/2系统表单")
    private Integer type;

    @ExcelProperty("状态：1启用/2禁止")
    private Integer status;

    @ExcelProperty("排序ID")
    private Integer sort;

    @ExcelProperty("图标")
    private String icon;

    @ExcelProperty("表名")
    private String tableName;

    @ExcelProperty("备注")
    private String remark;

    @ExcelProperty("数据库配置")
    @TableField(typeHandler = UniversalJsonTypeHandler.class)
    private FlowFormDataConfig dataConfig;

    @ExcelProperty("表单配置")
    @TableField(typeHandler = UniversalJsonTypeHandler.class)
    private Map<String, Object> config;

}
