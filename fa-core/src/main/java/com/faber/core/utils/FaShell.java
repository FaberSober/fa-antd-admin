package com.faber.core.utils;

import com.jcraft.jsch.*;
import lombok.extern.slf4j.Slf4j;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * 远程服务执行Shell
 * @author Farando
 * @date 2023/2/5 15:05
 * @description
 */
@Slf4j
public class FaShell {
    private String host;
    private String username;
    private String password;
    private int port = 22;
    private int timeout = 60 * 60 * 1000;
    private Session session;

    public FaShell(String host, String username, String password, int port, int timeout) {
        this.host = host;
        this.username = username;
        this.password = password;
        this.port = port;
        this.timeout = timeout;
    }

    public FaShell(String host, String username, String password) {
        this.host = host;
        this.username = username;
        this.password = password;
    }

    public void connect() throws JSchException {
        if (session != null) return;

        JSch jSch = new JSch();

        // 1. 获取 ssh session
        session = jSch.getSession(username, host, port);
        session.setPassword(password);
        session.setTimeout(timeout);
        session.setConfig("StrictHostKeyChecking", "no");
        session.connect();  // 获取到 ssh session
    }

    public String execCommand(String cmd) {
        ChannelExec channelExec = null;
        BufferedReader inputStreamReader = null;
        BufferedReader errInputStreamReader = null;
        StringBuilder runLog = new StringBuilder("");
        StringBuilder errLog = new StringBuilder("");
        try {
            // 1. 获取 ssh session
            connect();

            // 2. 通过 exec 方式执行 shell 命令
            channelExec = (ChannelExec) session.openChannel("exec");
            channelExec.setCommand(cmd);
            channelExec.connect();  // 执行命令

            // 3. 获取标准输入流
            inputStreamReader = new BufferedReader(new InputStreamReader(channelExec.getInputStream()));
            // 4. 获取标准错误输入流
            errInputStreamReader = new BufferedReader(new InputStreamReader(channelExec.getErrStream()));

            // 5. 记录命令执行 log
            String line = null;
            while ((line = inputStreamReader.readLine()) != null) {
                runLog.append(line).append("\n");
            }

            // 6. 记录命令执行错误 log
            String errLine = null;
            while ((errLine = errInputStreamReader.readLine()) != null) {
                errLog.append(errLine).append("\n");
            }

            // 7. 输出 shell 命令执行日志
            log.debug("exitStatus=" + channelExec.getExitStatus() + ", openChannel.isClosed=" + channelExec.isClosed());
            log.debug("命令执行完成，执行日志如下:");
            log.debug(runLog.toString());
            log.debug("命令执行完成，执行错误日志如下:");
            log.debug(errLog.toString());
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (inputStreamReader != null) {
                    inputStreamReader.close();
                }
                if (errInputStreamReader != null) {
                    errInputStreamReader.close();
                }

                if (channelExec != null) {
                    channelExec.disconnect();
                }
//                if (session != null) {
//                    session.disconnect();
//                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return runLog.toString();
    }

    public void mkdir(String dir) {
        this.execCommand("mkdir -p " + dir);
    }

    /**
     * 上传文件到服务器
     * @param localFilePath 本地文件路径
     * @param remoteDirPath 远程目录路径
     * @throws JSchException
     * @throws SftpException
     */
    public void uploadFile(String localFilePath, String remoteDirPath) throws JSchException, SftpException {
        this.connect();
        ChannelSftp channel = (ChannelSftp) this.session.openChannel("sftp");
        channel.connect();
        channel.put(localFilePath, remoteDirPath);
    }

    /**
     * 下载文件到本地
     * @param remoteFilePath 远程文件路径
     * @param localFileOrDirPath 目录路径-下载到目录，文件路径-下载到指定路径
     * @throws JSchException
     * @throws SftpException
     */
    public void downloadFile(String remoteFilePath, String localFileOrDirPath) throws JSchException, SftpException {
        this.connect();
        ChannelSftp channel = (ChannelSftp) this.session.openChannel("sftp");
        channel.connect();
        channel.get(remoteFilePath, localFileOrDirPath);
    }
}
