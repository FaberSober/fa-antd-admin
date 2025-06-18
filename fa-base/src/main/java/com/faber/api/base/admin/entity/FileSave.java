package com.faber.api.base.admin.entity;

import cn.hutool.core.util.StrUtil;
import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.bean.BaseDelEntity;
import com.faber.core.enums.FileSaveDriveEnum;
import lombok.Data;


/**
 * 文件存储
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-19 10:09:36
 */
@FaModalName(name = "BASE-附件表")
@TableName("base_file_save")
@Data
public class FileSave extends BaseDelEntity {

    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    @ExcelProperty("文件访问地址")
    private String url;

    @ExcelProperty("文件大小，单位字节")
    private Long size;

    @ExcelProperty("文件名")
    private String filename;

    @ExcelProperty("原始文件名")
    private String originalFilename;

    @ExcelProperty("基础存储路径")
    private String basePath;

    @ExcelProperty("存储路径")
    private String path;

    @ExcelProperty("文件扩展名")
    private String ext;

    @ExcelProperty("MIME类型")
    private String contentType;

    @ExcelProperty("存储平台")
    private String platform;

    @ExcelProperty("缩略图访问路径")
    private String thUrl;

    @ExcelProperty("缩略图名称")
    private String thFilename;

    @ExcelProperty("缩略图大小，单位字节")
    private Long thSize;

    @ExcelProperty("缩略图MIME类型")
    private String thContentType;

    @ExcelProperty("文件所属对象id")
    private String objectId;

    @ExcelProperty("文件所属对象类型，例如用户头像，评价图片")
    private String objectType;

    @ExcelProperty("附加属性")
    private String attr;

    @ExcelProperty("文件MD5")
    private String md5;

    @ExcelProperty("外部链接")
    private String outUrl;

    public String getFileNameWithoutExtension() {
        if (StrUtil.isEmpty(filename)) {
            return filename;
        }
        return filename.substring(0, filename.lastIndexOf("."));
    }

}
