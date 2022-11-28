package com.faber.core.vo.msg;

import lombok.Data;

/**
 * 基本对象Response返回父类
 * @author xu.pengfei
 * @date 2022/11/28 14:43
 */
@Data
public class Ret<T> extends BaseRet {

    T data;
    boolean rel;

    public Ret<T> rel(boolean rel) {
        this.setRel(rel);
        return this;
    }


    public Ret<T> data(T data) {
        this.setRel(true);
        this.setData(data);
        return this;
    }

}
