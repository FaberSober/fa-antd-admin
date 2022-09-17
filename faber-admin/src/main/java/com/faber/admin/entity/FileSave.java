package com.faber.admin.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.common.bean.BaseUpdEntity;
import lombok.Data;


/**
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-19 10:09:36
 */
@TableName("base_file_save")
@Data
public class FileSave extends BaseUpdEntity {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    // 文件名
    // @Column(name = "name")
    private String name;

    // url、文件保存路径
    // @Column(name = "url")
    private String url;

    // 附件大小
    // @Column(name = "size")
    private Long size;


}
