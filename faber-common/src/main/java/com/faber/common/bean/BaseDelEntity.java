package com.faber.common.bean;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.faber.common.annotation.SqlEquals;
import com.faber.common.vo.DictOption;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 逻辑删除共有属性类
 *
 * @Author: xu.pengfei
 * @Email: faberxu@gmail.com
 * @Date: 2018-08-01 15:13
 */
@Data
@ToString
@EqualsAndHashCode(callSuper = false)
@MappedSuperclass
public abstract class BaseDelEntity extends BaseOprEntity {

    @ExcelIgnore
    @SqlEquals
    @Column(name = "del_state")
    private String delState;

    @ExcelIgnore
    @Column(name = "del_time")
    private Date delTime;

    @SqlEquals
    @ExcelIgnore
    @Column(name = "del_user")
    private String delUser;

    @ExcelIgnore
    @Column(name = "del_name")
    private String delName;

    @ExcelIgnore
    @Column(name = "del_host")
    private String delHost;

    public static class DEL_STATE {
        public static final String AVAILABLE = "0";
        public static final String DELETED = "1";
    }

    public void logicDelete(Integer userId, String username) {
       this.setDelState(DEL_STATE.DELETED);
       this.setDelTime(new Date());
    }

    public static List<DictOption> getDelStateDicts() {
        List<DictOption> options = new ArrayList<>();
        options.add(new DictOption(DEL_STATE.AVAILABLE, "有效", null, 0));
        options.add(new DictOption(DEL_STATE.DELETED, "删除", null,1));
        return options;
    }

}
