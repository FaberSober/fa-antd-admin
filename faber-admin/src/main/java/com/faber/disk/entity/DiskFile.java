package com.faber.disk.entity;

import com.faber.common.annotation.FaberModalName;
import com.faber.common.bean.BaseDelEntity;
import lombok.Data;

import javax.persistence.*;


/**
 * 云盘/文件
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-07-13 10:36:38
 */
@FaberModalName(name = "云盘/文件")
@Table(name = "disk_file")
@Data
public class DiskFile extends BaseDelEntity {
    private static final long serialVersionUID = 1L;

    // ID
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // 文件夹ID
    @Column(name = "dir_id")
    private Integer dirId;

    // 文件名称
    @Column(name = "name")
    private String name;

    // 文件类型
    @Column(name = "type")
    private String type;

    // 文件URL
    @Column(name = "url")
    private String url;

    // 文件大小(B)
    @Column(name = "size")
    private Integer size;

}
