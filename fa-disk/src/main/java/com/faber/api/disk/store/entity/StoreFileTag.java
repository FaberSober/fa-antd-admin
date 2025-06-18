package com.faber.api.disk.store.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;

    
/**
 * STORE-文件-标签
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-12-27 11:25:19
 */
@FaModalName(name = "STORE-文件-标签")
@TableName("disk_store_file_tag")
@Data
public class StoreFileTag extends BaseDelEntity {
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @ExcelProperty("文件ID")
    private Integer fileId;

    @ExcelProperty("标签ID")
    private Integer tagId;

}
