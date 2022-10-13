package com.faber.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.common.bean.BaseUpdEntity;
import com.faber.common.enums.FileSaveDriveEnum;
import lombok.Data;


/**
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-19 10:09:36
 */
@TableName("base_file_save")
@Data
public class FileSave extends BaseUpdEntity {

    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    @ExcelProperty("文件名")
    private String name;

    @ExcelProperty("url")
    private String url;

    @ExcelProperty("附件大小")
    private Long size;

    @ExcelProperty("存储类型")
    private FileSaveDriveEnum drive;


}
