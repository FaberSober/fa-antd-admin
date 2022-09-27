package com.faber.rbac.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.common.annotation.FaberModalName;
import com.faber.common.bean.BaseDelEntity;
import com.faber.common.config.BaseEnumConverter;
import com.faber.common.enums.BoolEnum;
import lombok.Data;
import lombok.experimental.Accessors;


/**
 * BASE-角色表
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@FaberModalName(name = "BASE-角色表")
@TableName("base_rbac_role")
@Data
@Accessors(chain = true)
public class RbacRole extends BaseDelEntity {

    @ColumnWidth(8)
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Long id;

    @ExcelProperty("角色名称")
    private String name;

    @ExcelProperty("角色描述")
    private String remarks;

    @ExcelProperty(value = "是否启用", converter = BaseEnumConverter.class)
    private BoolEnum status;

}
