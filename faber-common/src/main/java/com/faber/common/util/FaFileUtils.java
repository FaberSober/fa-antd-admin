package com.faber.common.util;

import cn.hutool.core.date.DateUtil;
import org.springframework.core.io.ClassPathResource;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.Date;

public class FaFileUtils {

    /**
     * 下载资源文件
     * @param response
     * @param filePath
     * @throws IOException
     */
    public static void downloadResourceFile(HttpServletResponse response, String filePath, String filename) throws IOException {
        InputStream in = new ClassPathResource(filePath).getInputStream();

        response.setCharacterEncoding("utf-8");
        String fileName = URLEncoder.encode(filename, "UTF-8");
        response.setHeader("Content-disposition", "attachment;filename=" + fileName);
        //4.获取要下载的文件输入流
        int len = 0;
        //5.创建数据缓冲区
        byte[] buffer = new byte[1024];
        //6.通过response对象获取OutputStream流
        OutputStream out = response.getOutputStream();
        //7.将FileInputStream流写入到buffer缓冲区
        while ((len = in.read(buffer)) > 0) {
            //8.使用OutputStream将缓冲区的数据输出到客户端浏览器
            out.write(buffer, 0, len);
        }
        in.close();
    }

    /**
     * 在文件名后追加时间戳。如xxx.jpg修改为xxx_20220815120000.jpg
     * @param fileName
     * @return
     */
    public static String addTimestampToFileName(String fileName) {
        String now = DateUtil.format(new Date(), "yyyyMMddHHmmss");

        if (fileName == null) return now;

        if (fileName.contains(".")) {
            int index = fileName.lastIndexOf(".");
            return fileName.substring(0, index) + "_" + now + fileName.substring(index);
        }
        return fileName + "_" + now;
    }

}
