package com.faber.api.base.doc.vo.ret;

import com.faber.api.base.doc.models.filemodel.FileModel;
import lombok.Data;

import java.io.Serializable;

/**
 * @author Farando
 * @date 2023/3/14 11:04
 * @description
 */
@Data
public class OpenFileRetVo implements Serializable {

    FileModel fileModel;
    String documentApi;

}
