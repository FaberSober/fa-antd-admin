package com.faber.api.base.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.bean.BaseCrtEntity;
import com.faber.api.base.admin.enums.EntityLogActionEnum;
import lombok.Data;


/**
 * BASE- 实体变更日志
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-10-13 14:54:09
 */
@FaModalName(name = "BASE- 实体变更日志")
@TableName("base_entity_log")
@Data
public class EntityLog extends BaseCrtEntity {

    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @SqlEquals
    @ExcelProperty("业务类型")
    private String bizType;

    @SqlEquals
    @ExcelProperty("业务ID")
    private String bizId;

    @SqlEquals
    @ExcelProperty("动作")
    private EntityLogActionEnum action;

    @ExcelProperty("动作内容")
    private String content;

}
