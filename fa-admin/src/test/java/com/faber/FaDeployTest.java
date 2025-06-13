package com.faber;

import cn.hutool.core.io.FileUtil;
import com.faber.core.utils.FaDeployHelper;
import com.faber.core.utils.FaFileUtils;
import com.faber.core.utils.FaShell;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.SftpException;
import dorkbox.notify.Notify;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;

/**
 * @author Farando
 * @date 2023/2/5 16:54
 * @description
 */
public class FaDeployTest {

    String host = "127.0.0.1";
    int port = 22; // 部署服务器-端口
    int timeout = 60 * 60 * 1000;
    String username = "root"; // 部署服务器-账户
    String password = "123456"; // 部署服务器-密码

    String jarPath = "/opt/fa-admin-web/"; // 远程部署jar目录
    String nginxHtmlPath = "/etc/nginx/html/fa-admin-web"; // 远程部署前端dist目录
    String jarEnv = "prod"; // jar启动的激活环境
    String javaPath = "/usr/local/jdk/jdk1.8.0_261/bin/java"; // 服务端java路径

    @Test
    public void testDeploy() throws JSchException, SftpException, IOException, InterruptedException {
        FaDeployHelper helper = new FaDeployHelper();
        helper.setHost(host);
        helper.setPort(port);
        helper.setUsername(username);
        helper.setPassword(password);

        helper.setJarPath(jarPath); // 远程部署jar目录
//        helper.setNginxHtmlPath(nginxHtmlPath); // 远程部署前端dist目录

        // 打包
        helper.mvnPackage();
        // 部署前端
//        helper.deployFrontend();
        // 部署Jar
        helper.deployJar();

        Notify.create()
                .title("部署完成")
                .text("部署完成!")
                .showInformation();

        Thread.sleep(3000);
    }

    @Test
    public void testCreateServiceSh() throws IOException, JSchException, SftpException {
        String sep = File.separator;

        // 读取模版service.sh
        String rootDir = FaFileUtils.getProjectRootDir();
        System.out.println(rootDir);

        String serviceTplPath = rootDir + sep + "fa-core" + sep + "doc" + sep + "shell" + sep + "service.sh.template";
        String serviceTplFileStr = FileUtil.readUtf8String(serviceTplPath);

        // 替换文件
        serviceTplFileStr = serviceTplFileStr.replaceAll("\\$\\{jarPath\\}", jarPath);
        serviceTplFileStr = serviceTplFileStr.replaceAll("\\$\\{javaPath\\}", javaPath);
        serviceTplFileStr = serviceTplFileStr.replaceAll("\\$\\{jarEnv\\}", jarEnv);
        System.out.println(serviceTplFileStr);

        // 生成新的service.sh
        String serviceFile = rootDir + sep + "doc" + sep + "shell" + sep + "service.sh";
        FileUtil.writeUtf8String(serviceTplFileStr, serviceFile);

        // 上传到服务器中
        FaShell shell = new FaShell(host, username, password, port, timeout);
        shell.mkdir(jarPath);
        shell.uploadFile(serviceFile, jarPath);
        shell.execCommand("chmod +x " + jarPath + "service.sh");
    }

}
