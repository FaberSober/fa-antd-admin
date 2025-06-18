package com.faber.base.shell;

import cn.hutool.extra.ssh.JschUtil;
import com.jcraft.jsch.*;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.util.Properties;

/**
 * @author Farando
 * @date 2023/2/2 21:24
 * @description
 */
@Slf4j
public class ExecShellUtil {

    String host = "127.0.0.1";
    int port = 22;
    String username = "root";
    String password = "123456";

    String jarPath = "/opt/file-web";


//    @Test
//    public void testSftp() throws JSchException, SftpException {
//        ChannelSftp channel = (ChannelSftp) this.session.openChannel("sftp");
//        String pwd = channel.lpwd();
//        System.out.println("pwd: " + pwd);
//
//        Vector<ChannelSftp.LsEntry> vector = channel.ls("/root/tmp");
//        vector.forEach(i -> {
//            System.out.println(i.toString());
//        });
//
//    }

    @Test
    public void testExec() throws JSchException, SftpException, IOException {
        Session session = JschUtil.getSession(host, port, username, password);
//        session.setOutputStream();
        ChannelExec channel = (ChannelExec) session.openChannel("exec");
        channel.setCommand("pwd");
        channel.connect();  // 执行命令

//        //从远程端到达的所有数据都能从这个流中读取到
//        InputStream in = channel.getInputStream();
//        //写入该流的所有数据都将发送到远程端。
//        OutputStream outputStream = channel.getOutputStream();
//        byte[] tmp=new byte[1024];
//        while(true){
//            while(in.available()>0){
//                int i=in.read(tmp, 0, 1024);
//                if(i<0)break;
//                System.out.print(new String(tmp, 0, i));
//            }
//            if(channel.isClosed()){
//                if(in.available()>0) continue;
//                System.out.println("exit-status: "+channel.getExitStatus());
//                break;
//            }
//        }
    }

    @Test
    public void testUploadFile() throws JSchException, SftpException {
//        Session session = JschUtil.getSession(host, port, username, password);
//        Properties sshConfig = new Properties();
//        sshConfig.put("StrictHostKeyChecking", "no");
//        session.setConfig(sshConfig);

//        ChannelSftp channel = (ChannelSftp) session.openChannel("sftp");
//        channel.put("C:\\Users\\Farando\\Downloads\\test.png", "/root/tmp");

        ChannelSftp channel = createChannelSftp();
        channel.put("C:\\Users\\Farando\\Downloads\\test.png", "/root/tmp");
    }


    public ChannelSftp createChannelSftp() throws JSchException {
        JSch jsch = new JSch();
        Session sshSession = jsch.getSession(username, host, port);
        sshSession.setPassword(password);
        Properties sshConfig = new Properties();
        sshConfig.put("StrictHostKeyChecking", "no");
        sshSession.setConfig(sshConfig);
        sshSession.connect();
        ChannelSftp channel = (ChannelSftp) sshSession.openChannel("sftp");
        channel.connect();
        return channel;
    }

}
