package com.faber.api.base.disk.vo;

import com.faber.api.base.disk.entity.DiskDir;
import lombok.Data;

@Data
public class DiskDirVO extends DiskDir {

    private boolean hasChildren; // 是否有子目录

}
