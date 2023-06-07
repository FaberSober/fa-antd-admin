package com.faber;

import com.faber.core.utils.FaShell;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.SftpException;
import org.junit.Test;

public class FaShellTest {

    String host = "127.0.0.1"; // 部署服务器-IP
    int port = 22; // 部署服务器-端口
    int timeout = 60 * 60 * 1000;
    String username = "root"; // 部署服务器-账户
    String password = "123456"; // 部署服务器-密码

    @Test
    public void testExecuteCmd() {
        FaShell shell = new FaShell(host, username, password, port, timeout);
        String cmd = "pwd ";
        shell.execCommand(cmd);
    }

    @Test
    public void testUploadFile() throws JSchException, SftpException {
        FaShell shell = new FaShell(host, username, password, port, timeout);
        shell.uploadFile("/Users/xxx/tmp/file/test.pdf", "/root/xxx");
    }

    @Test
    public void testDownloadFile() throws JSchException, SftpException {
        FaShell shell = new FaShell(host, username, password, port, timeout);
        shell.downloadFile("/root/xxx/test.pdf", "/Users/xxx/tmp/file/test1.pdf");
    }

}
