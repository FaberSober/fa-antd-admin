package com.faber.core.vo.query;

import lombok.Data;
import lombok.ToString;

import java.io.Serializable;

@Data
@ToString
public class BasePageQuery<T> implements Serializable {

    /** 当前页码 */
    private int current = 1;

    /** 每页条数 */
    private int pageSize = 10;

    /** 排序 */
    private String sorter;

    /** 查询用户 */
    private String queryUserId;

    /** 查询参数 */
    private T query;

    public long getSkip() {
        return (long) (this.getCurrent() - 1) * this.getPageSize();
    }

}
