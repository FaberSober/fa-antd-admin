package com.faber.api.disk.store.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;

    
/**
 * STORE-库
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-12-22 09:31:17
 */
@FaModalName(name = "STORE-库")
@TableName("disk_store_bucket")
@Data
public class StoreBucket extends BaseDelEntity {

    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @ExcelProperty("库名称")
    private String name;

    @ExcelProperty("总文件大小")
    private Long size;

    @ExcelProperty("目录数量")
    private Long dirCount;

    @ExcelProperty("文件数量")
    private Long fileCount;

}
