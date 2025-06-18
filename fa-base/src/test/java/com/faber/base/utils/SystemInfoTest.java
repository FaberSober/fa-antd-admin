package com.faber.base.utils;

import cn.hutool.system.oshi.CpuInfo;
import cn.hutool.system.oshi.OshiUtil;
import org.junit.jupiter.api.Test;
import oshi.SystemInfo;
import oshi.hardware.*;
import oshi.software.os.OSFileStore;
import oshi.software.os.OSProcess;
import oshi.software.os.OperatingSystem;

import java.util.List;

public class SystemInfoTest {

    @Test
    public void testOshi() {
        SystemInfo si = new SystemInfo();
        List<HWDiskStore> diskStoreList = si.getHardware().getDiskStores();
        printInfo("diskStoreList", diskStoreList);
    }

    @Test
    public void testOshiUtil() {
        ComputerSystem computerSystem = OshiUtil.getSystem();
        CpuInfo cpuInfo = OshiUtil.getCpuInfo();
        GlobalMemory memory = OshiUtil.getMemory();
        CentralProcessor processor = OshiUtil.getProcessor();
        OSProcess osProcess = OshiUtil.getCurrentProcess();
        HardwareAbstractionLayer hardware = OshiUtil.getHardware();
        List<HWDiskStore> diskStoreList = OshiUtil.getDiskStores();
        List<OSFileStore> fileStoreList = OshiUtil.getOs().getFileSystem().getFileStores();
        List<NetworkIF> networkIFList = OshiUtil.getNetworkIFs();
        OperatingSystem os = OshiUtil.getOs();
        Sensors sensors = OshiUtil.getSensors();

        printInfo("computerSystem", computerSystem);
        printInfo("cpuInfo", cpuInfo);
        printInfo("memory", memory);
        printInfo("processor", processor);
        printInfo("osProcess", osProcess);
        printInfo("hardware", hardware);
        printInfo("diskStoreList", diskStoreList);
        printInfo("fileStoreList", fileStoreList);
        printInfo("networkIFList", networkIFList);
        printInfo("os", os);
        printInfo("sensors", sensors);
    }
    
    private void printInfo(String label, Object info) {
        System.out.println("---------- " + label + " ---------->>>");
        System.out.println(info);
        System.out.println("");
    }

}
