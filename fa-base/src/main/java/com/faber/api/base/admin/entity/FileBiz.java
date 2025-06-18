package com.faber.api.base.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;


/**
 * BASE-通用业务附件表
 *
 * 建议不使用这张表，可以直接使用{@link FileSave}表中的{@link FileSave#getObjectId()}、{@link FileSave#getObjectType()}来存储关联业务类型、业务ID
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2023-03-05 14:46:46
 */
@FaModalName(name = "BASE-通用业务附件表")
@TableName("base_file_biz")
@Data
public class FileBiz extends BaseDelEntity {

    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @SqlEquals
    @ExcelProperty("主业务ID")
    private String mainBizId;

    @SqlEquals
    @ExcelProperty("业务ID")
    private String bizId;

    @SqlEquals
    @ExcelProperty("业务类型")
    private String type;

    @SqlEquals
    @ExcelProperty("附件ID")
    private String fileId;

    @ExcelProperty("附件名称")
    private String fileName;

    @ExcelProperty("文件扩展名")
    private String ext;

    @ExcelProperty("排序")
    private Integer sort;

}
