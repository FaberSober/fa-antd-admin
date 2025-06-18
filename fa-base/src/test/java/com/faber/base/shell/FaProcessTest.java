package com.faber.base.shell;

import org.junit.jupiter.api.Test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class FaProcessTest {

    /**
     * 测试运行命令
     * @throws IOException
     */
    @Test
    public void testRunProcess() throws IOException {
        System.out.println(System.getProperty("os.name"));

        String property = System.getProperty("os.name");
        String[] cmd_win = { "cmd", "/C", "dir" };
        String[] cmd_linux = { "/bin/sh", "-c", "ls" };
        String[] cmd = null;
        System.out.println(property);

        if (property.contains("Windows")) {
            cmd = cmd_win;
        }
        else {
            cmd = cmd_linux;
        }

        Process process =Runtime.getRuntime().exec(cmd);

        // 取得命令结果输出流
        InputStream inputStream = process.getInputStream();
        // 用输出去读
        InputStreamReader inputStreamReader = new InputStreamReader(inputStream);
        // 创建缓冲区
        BufferedReader inputBufferedReader = new BufferedReader(inputStreamReader);
        StringBuilder stringBuilder = new StringBuilder();
        String line = null;
        while ((line = inputBufferedReader.readLine()) != null) {
            stringBuilder.append(line);
            System.out.println(line);
        }
        inputBufferedReader.close();
        inputBufferedReader = null;
        inputStreamReader.close();
        inputStreamReader = null;
        inputStream.close();
        inputStream = null;
    }

}
