package com.faber.common.vo;

import lombok.Data;
import lombok.ToString;

import java.io.Serializable;

@Data
@ToString
public class BasePageQuery implements Serializable {

    /** 当前页码 */
    private int currentPage = 1;

    /** 每页条数 */
    private int pageSize = 10;

    /** 排序 */
    private String sorter;

    /** 查询用户 */
    private String queryUserId;

    public long getSkip() {
        return (long) (this.getCurrentPage() - 1) * this.getPageSize();
    }

}
