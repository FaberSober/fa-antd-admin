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

    public Ret<T> rel() {
        return this;
    }

    public static Ret ok() {
        Ret ret = new Ret();
        return ret;
    }

    public static Ret data(Object data) {
        Ret ret = new Ret();
        ret.setData(data);
        return ret;
    }

}
