package com.faber.common.bean;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import com.faber.common.annotation.SqlEquals;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import java.io.Serializable;
import java.util.Date;

/**
 * @Author: xu.pengfei
 * @Email: faberxu@gmail.com
 * @Date: 2018-08-01 15:13
 */
@Data
@ToString
@EqualsAndHashCode(callSuper = false)
@MappedSuperclass
public abstract class BaseCrtEntity implements Serializable {

    @ExcelProperty("创建时间")
    @ColumnWidth(20)
    @Column(name = "crt_time")
    private Date crtTime;

    @ExcelIgnore
    @SqlEquals
    @Column(name = "crt_user")
    private String crtUser;

    @ExcelProperty("创建人")
    @ColumnWidth(20)
    @Column(name = "crt_name")
    private String crtName;

    @ExcelProperty("创建IP")
    @Column(name = "crt_host")
    private String crtHost;

    public static class Bool {
        public static final String FALSE = "0";
        public static final String TRUE = "1";
    }

}
