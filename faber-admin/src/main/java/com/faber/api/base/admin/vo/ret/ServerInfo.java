package com.faber.api.base.admin.vo.ret;

import cn.hutool.system.oshi.CpuInfo;
import lombok.Data;
import lombok.ToString;
import oshi.hardware.ComputerSystem;
import oshi.hardware.GlobalMemory;

import java.io.Serializable;

@Data
@ToString
public class ServerInfo implements Serializable {

    private CpuInfo cpuInfo;
    private ComputerSystem system;
    private GlobalMemory memory;

}
