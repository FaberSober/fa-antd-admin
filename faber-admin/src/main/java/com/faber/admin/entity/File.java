package com.faber.admin.entity;

import com.faber.common.bean.BaseOprEntity;
import lombok.Data;
import tk.mybatis.mapper.annotation.KeySql;
import tk.mybatis.mapper.code.ORDER;

import javax.persistence.*;


/**
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-19 10:09:36
 */
@Table(name = "base_file")
@Data
public class File extends BaseOprEntity {
    private static final long serialVersionUID = 1L;

    @Id
    @KeySql(sql = "select uuid()", order = ORDER.BEFORE) // 使用UUID作为主键
    private String id;

    // 文件名
    @Column(name = "name")
    private String name;

    // url、文件保存路径
    @Column(name = "url")
    private String url;

    // 附件大小
    @Column(name = "size")
    private Long size;


}
