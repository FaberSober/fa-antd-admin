package com.faber.buzz.disk.vo;

import com.faber.buzz.disk.entity.DiskDir;
import lombok.Data;

@Data
public class DiskDirVO extends DiskDir {

    private boolean hasChildren; // 是否有子目录

}
