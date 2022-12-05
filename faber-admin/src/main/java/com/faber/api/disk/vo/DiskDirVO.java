package com.faber.api.disk.vo;

import com.faber.api.disk.entity.DiskDir;
import lombok.Data;

@Data
public class DiskDirVO extends DiskDir {

    private boolean hasChildren; // 是否有子目录

}
