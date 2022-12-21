package com.faber.api.base.rbac.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;
import lombok.ToString;


/**
 * BASE-角色表
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@FaModalName(name = "BASE-角色表")
@TableName("base_rbac_role")
@Data
@ToString
public class RbacRole extends BaseDelEntity {

    @ColumnWidth(8)
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Long id;

    @ExcelProperty("角色名称")
    private String name;

    @ExcelProperty("角色描述")
    private String remarks;

    @ExcelProperty("是否启用")
    private Boolean status;

}
