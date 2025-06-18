package com.faber.base.deploy;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.ZipUtil;
import com.faber.core.utils.FaShell;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.SftpException;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.util.Date;

/**
 * @author Farando
 * @date 2023/2/5 15:23
 * @description
 */
@Slf4j
public class FaDeployTest {

    String host = "127.0.0.1";
    int port = 22;
    String username = "root";
    String password = "123456";

    String jarPath = "/opt/fa-admin/"; // 远程部署jar目录
    String nginxHtmlPath = "/etc/nginx/html/fa-admin"; // 远程部署前端dist目录

    String jarName = "fa-admin.jar"; // 本地jar目录
    String jarLocalPath = "fa-admin/target/"; // 本地jar目录
    String webDistPath = "frontend/apps/admin/dist"; // 本地前端打包后的dist目录

    @Test
    public void testDeployAll() throws JSchException, SftpException {
        this.testDeployFrontend();
        this.testDeployJar();
    }

    /**
     * 部署jar服务端
     */
    @Test
    public void testDeployJar() throws JSchException, SftpException {
        String now = DateUtil.format(new Date(), "yyyyMMdd-HHmmss");

        log.info("user.dir: {}", System.getProperty("user.dir"));
        String modulePathStr = System.getProperty("user.dir");
        File modulePath = new File(modulePathStr);
        File prjPath = modulePath.getParentFile();

        // get frontend path
        File jarLocal = new File(prjPath, jarLocalPath + jarName);
        log.info("[本地]jar路径: {}", jarLocal.getAbsolutePath());

        log.info("[本地]jar上传到服务器...");
        FaShell shell = new FaShell(host, username, password);
        shell.uploadFile(jarLocal.getAbsolutePath(), jarPath + "prepare/");

        log.info("[服务器]创建jar备份文件夹...");
        String bakDir = jarPath + "bak/" + now;
        shell.execCommand("mkdir -p " + bakDir);

        log.info("[服务器]停止当前的服务...");
        shell.execCommand(jarPath + "service.sh stop");

        log.info("[服务器]将当前服务移动到备份目录...");
        shell.execCommand(String.format("mv %1$s %2$s", jarPath + jarName, bakDir));

        log.info("[服务器]将更新包移动到当前目录...");
        shell.execCommand(String.format("mv %1$s %2$s", jarPath + "prepare/" + jarName, jarPath));

        log.info("[服务器]启动服务...");
        shell.execCommand(jarPath + "service.sh start");
    }

    /**
     * 部署nginx前端
     * @throws JSchException
     * @throws SftpException
     */
    @Test
    public void testDeployFrontend() throws JSchException, SftpException {
        String now = DateUtil.format(new Date(), "yyyyMMdd-HHmmss");

        log.info("user.dir: {}", System.getProperty("user.dir"));
        String modulePathStr = System.getProperty("user.dir");
        File modulePath = new File(modulePathStr);
        File prjPath = modulePath.getParentFile();

        // get frontend path
        File frontendPath = new File(prjPath, webDistPath);
        log.info("[本地]前端项目路径: {}", frontendPath.getAbsolutePath());

        log.info("[本地]前端dist目录zip打包...");
        String frontendZipPath = frontendPath.getParentFile().getAbsolutePath() + File.separator + "dist.zip";
        ZipUtil.zip(frontendPath.getAbsolutePath(), frontendZipPath);

        log.info("[本地]前端dist.zip上传到服务器...");
        FaShell shell = new FaShell(host, username, password);
        shell.uploadFile(frontendZipPath, nginxHtmlPath);

        log.info("[服务器]创建前端备份文件夹...");
        String bakDir = nginxHtmlPath + "/bak/" + now;
        shell.execCommand("mkdir -p " + bakDir);

        log.info("[服务器]将当前运行前端文件夹移动到备份目录...");
        shell.execCommand(String.format("mv %1$s/admin %2$s", nginxHtmlPath, bakDir));

        log.info("[服务器]前端dist.zip解压...");
        shell.execCommand(String.format("cd %1$s && unzip %2$s/dist.zip -d %3$s/admin", nginxHtmlPath, nginxHtmlPath, nginxHtmlPath));
    }

}
