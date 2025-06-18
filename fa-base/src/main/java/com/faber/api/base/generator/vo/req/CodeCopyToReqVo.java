package com.faber.api.base.generator.vo.req;

import lombok.Data;

@Data
public class CodeCopyToReqVo extends CodeGenReqVo {

    /**
     * 目标文件夹
     */
    private String path;

}
