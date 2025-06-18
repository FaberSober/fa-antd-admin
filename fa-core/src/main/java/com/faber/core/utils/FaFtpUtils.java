package com.faber.core.utils;

import cn.hutool.core.collection.ListUtil;
import org.apache.commons.net.ftp.FTPFile;

import java.util.Arrays;
import java.util.Comparator;

public class FaFtpUtils {

    /**
     * 获取最新的文件
     * @param files
     * @return
     */
    public static FTPFile getLatest(FTPFile[] files) {
        if (files.length == 0) return null;
        return ListUtil.sort(Arrays.asList(files), (o1, o2) -> -o1.getTimestamp().compareTo(o2.getTimestamp())).get(0);
    }

}
