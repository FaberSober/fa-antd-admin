package com.faber.admin.entity;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import com.faber.common.annotation.FaberModalName;
import com.faber.common.annotation.SqlEquals;
import com.faber.common.annotation.SqlSearch;
import com.faber.common.annotation.SqlSorter;
import com.faber.common.bean.BaseDelEntity;
import lombok.Data;

import javax.persistence.*;


/**
 * 字典值
 */
@FaberModalName(name = "字典值")
@Table(name = "base_dict")
@Data
public class Dict extends BaseDelEntity {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @SqlEquals
    @ExcelProperty("字典分组")
    @Column(name = "type")
    private Integer type;

    @SqlEquals
    @ExcelProperty("字典类型：0-文本/1-文件")
    @Column(name = "category")
    private Integer category;

    @SqlSearch
    @ExcelProperty("字典文本")
    @Column(name = "text")
    private String text;

    @SqlSearch
    @ExcelProperty("字典值")
    @Column(name = "value")
    private String value;

    @ExcelProperty("颜色")
    @Column(name = "color")
    private String color;

    @SqlSorter
    @ExcelProperty("排序")
    @Column(name = "sort")
    private Integer sort;

    @ExcelProperty("描述")
    @Column(name = "description")
    private String description;

    @ExcelIgnore
    @Transient
    private DictType dictType;

}
