package com.faber.disk.vo;

import com.faber.disk.entity.DiskDir;
import lombok.Data;

@Data
public class DiskDirVO extends DiskDir {

    private boolean hasChildren; // 是否有子目录

}
