package com.faber.api.base.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.bean.BaseDelEntity;
import com.faber.core.enums.FileSaveDriveEnum;
import lombok.Data;


/**
 * 文件存储
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-19 10:09:36
 */
@TableName("base_file_save")
@Data
public class FileSave extends BaseDelEntity {

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

    /**
     * 本地服务器访问路径。全部走本服务器的网络访问
     */
    @TableField(exist = false)
    private String localUrl;

}
