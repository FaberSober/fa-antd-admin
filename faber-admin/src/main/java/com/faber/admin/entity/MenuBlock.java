package com.faber.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.common.annotation.FaberModalName;
import com.faber.common.bean.BaseDelEntity;
import lombok.Data;


/**
 * BASE-菜单模块
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2021-11-20 15:53:22
 */
@FaberModalName(name = "BASE-菜单模块")
@TableName("base_menu_block")
@Data
public class MenuBlock extends BaseDelEntity {

    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @ExcelProperty("模块名称")
    // @Column(name = "name")
    private String name;

    @ExcelProperty("模块编码")
    // @Column(name = "no")
    private String no;

    @ExcelProperty("排序")
    // @Column(name = "sort")
    private Integer sort;

}
