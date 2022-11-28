package com.faber.buzz.disk.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;


/**
 * 云盘/文件
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-07-13 10:36:38
 */
@FaModalName(name = "云盘/文件")
@TableName("disk_file")
@Data
public class DiskFile extends BaseDelEntity {
    private static final long serialVersionUID = 1L;

    // ID
    @TableId(type = IdType.AUTO)
    private Integer id;

    // 文件夹ID
    // @Column(name = "dir_id")
    private Integer dirId;

    // 文件名称
    // @Column(name = "name")
    private String name;

    // 文件类型
    // @Column(name = "type")
    private String type;

    // 文件URL
    // @Column(name = "url")
    private String url;

    // 文件大小(B)
    // @Column(name = "size")
    private Integer size;

}
