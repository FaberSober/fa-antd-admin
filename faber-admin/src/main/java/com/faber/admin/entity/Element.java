package com.faber.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.faber.common.annotation.SqlEquals;
import com.faber.common.annotation.SqlSearch;
import com.faber.common.bean.BaseDelEntity;
import lombok.Data;

import javax.persistence.*;

/**
 * 基本资源
 */
@Data
@Table(name = "base_element")
public class Element extends BaseDelEntity {

    @SqlEquals
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @SqlEquals
    @ExcelProperty("所属模块ID")
    @Column(name = "block_id")
    private Integer blockId;

    @SqlSearch
    @ExcelProperty("编码")
    @Column(name = "code")
    private String code;

    @SqlSearch
    @ExcelProperty("类型")
    @Column(name = "type")
    private String type;

    @SqlSearch
    @ExcelProperty("名称")
    @Column(name = "name")
    private String name;

    @SqlSearch
    @ExcelProperty("请求URI")
    @Column(name = "uri")
    private String uri;

    @SqlEquals
    @ExcelProperty("所属菜单ID")
    @Column(name = "menu_id")
    private String menuId;

    // 这个字段目前没用到，Element功能权限点，是挂在在Menu下，通过menuId关联
    @Deprecated
    @SqlEquals
    @ExcelProperty("上级节点ID")
    @Column(name = "parent_id")
    private String parentId;

    @ExcelProperty("路径")
    @Column(name = "path")
    private String path;

    @SqlSearch
    @ExcelProperty("请求方法")
    @Column(name = "method")
    private String method;

    @ExcelProperty("描述")
    @Column(name = "description")
    private String description;

    @Transient
    private Menu menu;

}
