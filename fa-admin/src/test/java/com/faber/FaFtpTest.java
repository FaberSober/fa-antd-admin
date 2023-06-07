package com.faber;

import cn.hutool.core.io.FileUtil;
import cn.hutool.extra.ftp.Ftp;
import cn.hutool.extra.ftp.FtpMode;
import com.faber.core.utils.FaFtpUtils;
import org.apache.commons.net.ftp.FTPFile;
import org.junit.Test;

import java.io.IOException;
import java.util.List;

public class FaFtpTest {

    String host = "127.0.0.1"; // FTP-IP
    String username = "ftp"; // FTP-账户
    String password = "123456"; // FTP-密码

    @Test
    public void testDownloadFile() throws IOException {
        Ftp ftp = new Ftp(host, 21, username, password);
        //切换为主动模式
        ftp.setMode(FtpMode.Passive);
//        ftp.cd("/");
//        System.out.println(ftp.pwd());
//        System.out.println(ftp.ls("/"));
        ftp.download("/path/test.csv", FileUtil.file("/Users/xxx/tmp/file/test.csv"));

        List<String> list = ftp.ls("/path/");
        System.out.println(list);

        FTPFile[] files = ftp.lsFiles("/path/");
        FTPFile latestFile = FaFtpUtils.getLatest(files);
        System.out.println(latestFile.toString());

        //关闭连接
        ftp.close();
    }

}
