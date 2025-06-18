package com.faber.api.base.doc.vo.ret;

import lombok.Data;

import java.io.Serializable;

/**
 * @author Farando
 * @date 2023/3/14 14:14
 * @description
 */
@Data
public class OnlyofficeRet implements Serializable {

    int error = 0;
    String message;

}
