package com.faber.api.base.admin.biz;

import cn.hutool.system.oshi.OshiUtil;
import com.faber.api.base.admin.vo.ret.ServerInfo;
import org.springframework.stereotype.Service;
import oshi.hardware.HWDiskStore;
import oshi.software.os.OSFileStore;

import java.util.List;

@Service
public class SystemBiz {

    public ServerInfo server() {
        ServerInfo serverInfo = new ServerInfo();

        serverInfo.setCpuInfo(OshiUtil.getCpuInfo());
        serverInfo.setSystem(OshiUtil.getSystem());
        serverInfo.setMemory(OshiUtil.getMemory());

        List<HWDiskStore> diskStoreList = OshiUtil.getDiskStores();
        diskStoreList.forEach(i -> {
            ServerInfo.Disk disk = new ServerInfo.Disk();
            disk.setSerial(i.getSerial());
            disk.setName(i.getName());
            disk.setSize(i.getSize());

            serverInfo.addDisk(disk);
        });

        List<OSFileStore> fileStoreList = OshiUtil.getOs().getFileSystem().getFileStores();
        fileStoreList.forEach(i -> {
            ServerInfo.FileStore fileStore = new ServerInfo.FileStore();
            fileStore.setUuid(i.getUUID());
            fileStore.setName(i.getName());
            fileStore.setVolume(i.getVolume());
            fileStore.setTotalSpace(i.getTotalSpace());
            fileStore.setFreeSpace(i.getFreeSpace());
            fileStore.setUsableSpace(i.getUsableSpace());

            serverInfo.addFileStore(fileStore);
        });

        return serverInfo;
    }

}
