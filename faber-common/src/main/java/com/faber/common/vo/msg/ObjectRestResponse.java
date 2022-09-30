package com.faber.common.vo.msg;

import lombok.Data;

/**
 * 基本对象Response返回父类
 * Created by Ace on 2017/6/11.
 */
@Data
public class ObjectRestResponse<T> extends BaseResponse {

    T data;
    boolean rel;

    public ObjectRestResponse<T> rel(boolean rel) {
        this.setRel(rel);
        return this;
    }


    public ObjectRestResponse<T> data(T data) {
        this.setRel(true);
        this.setData(data);
        return this;
    }

}
