package com.faber.api.base.admin.vo.ret;

import cn.hutool.system.oshi.CpuInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import oshi.hardware.ComputerSystem;
import oshi.hardware.GlobalMemory;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
@ToString
public class ServerInfo implements Serializable {

    private CpuInfo cpuInfo;
    private ComputerSystem system;
    private GlobalMemory memory;
    private List<Disk> diskList;
    private List<FileStore> fileStoreList;

    public void addDisk(Disk disk) {
        if (diskList == null) {
            diskList = new ArrayList<>();
        }
        diskList.add(disk);
    }

    public void addFileStore(FileStore fileStore) {
        if (fileStoreList == null) {
            fileStoreList = new ArrayList<>();
        }
        fileStoreList.add(fileStore);
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Disk {
        String serial;
        String name;
        /**
         * the disk size, in bytes
         */
        long size;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FileStore {
        String uuid;
        String volume;
        String name;
        /**
         * the disk size, in bytes
         */
        long totalSpace;
        long freeSpace;
        long usableSpace;
    }

}
