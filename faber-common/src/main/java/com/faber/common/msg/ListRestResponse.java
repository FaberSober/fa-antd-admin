package com.faber.common.msg;

import lombok.Data;

/**
 * 基础的List Rest Response返回父类
 * FIXME: no use case
 */
@Data
public class ListRestResponse<T> {

    String msg;
    T result;
    int count;

    public ListRestResponse count(int count) {
        this.setCount(count);
        return this;
    }

    public ListRestResponse count(Long count) {
        this.setCount(count.intValue());
        return this;
    }

    public ListRestResponse msg(String msg) {
        this.setMsg(msg);
        return this;
    }

    public ListRestResponse result(T result) {
        this.setResult(result);
        return this;
    }

}
