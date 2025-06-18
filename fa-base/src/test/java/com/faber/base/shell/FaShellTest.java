package com.faber.base.shell;

import com.faber.core.utils.FaShell;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.SftpException;
import org.junit.jupiter.api.Test;

import java.io.IOException;

/**
 * @author Farando
 * @date 2023/2/5 15:06
 * @description
 */
public class FaShellTest {

    String host = "127.0.0.1";
    int port = 22;
    String username = "root";
    String password = "123456";

    @Test
    public void testExec() {
        String cmd = "pwd";
        FaShell shell = new FaShell(host, username, password);
        String execLog = shell.execCommand(cmd);
        System.out.println(execLog);
    }

    @Test
    public void testUpload() throws JSchException, SftpException {
        FaShell shell = new FaShell(host, username, password);
        shell.uploadFile("C:\\Users\\Farando\\Downloads\\test.png", "/root/tmp");
    }

}
