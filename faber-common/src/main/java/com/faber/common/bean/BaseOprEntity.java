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
public abstract class BaseOprEntity extends BaseCrtEntity {

    @ExcelProperty("更新时间")
    @ColumnWidth(20)
    @Column(name = "upd_time")
    private Date updTime;

    @ExcelIgnore
    @SqlEquals
    @Column(name = "upd_user")
    private String updUser;

    @ExcelProperty("更新人")
    @ColumnWidth(20)
    @Column(name = "upd_name")
    private String updName;

    @ExcelIgnore
    @Column(name = "upd_host")
    private String updHost;

    public static class Bool {
        public static final String FALSE = "0";
        public static final String TRUE = "1";
    }

//    public void initBeforeSave(UserInfo creator) {
//        this.setCreateBy(creator.getUid());
//        this.setCreateDate(new Date());
//        this.setDeleteState(BaseEntity.DeleteState.AVAILABLE);
//        this.setUpdateBy(creator.getUid());
//        this.setUpdateDate(new Date());
//    }
//
//    public void updateNow(UserInfo updateUser) {
//        this.setUpdateBy(updateUser.getUid());
//        this.setUpdateDate(new Date());
//    }
//
//    public void logicDelete(UserInfo creator) {
//        this.setDeleteBy(creator.getUid());
//        this.setDeleteDate(new Date());
//        this.setDeleteState(DeleteState.DELETE);
//    }

}
